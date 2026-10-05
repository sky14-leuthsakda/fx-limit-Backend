import * as fxTransactionRepository from "./fx-transaction.repository.js";
import * as exchangeRateService from "../exchange-rate/exchange-rate.service.js";
import * as sysCodeService from "../sys-codes/sys-code.service.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateFxTransactionInput,
  UpdateFxTransactionInput,
} from "./fx-transaction.schema.js";

const MYSQL_DUP_ENTRY = 1062;
const MYSQL_FK_FAIL = 1452;
const MYSQL_CHECK_VIOLATED = 3819; // ມາຈາກ chk_amount_positive / chk_rate_positive

const getErrno = (err: unknown) => (err as { errno?: number }).errno;

// ປັດ decimal(18,2) — ຕັດໃຫ້ເຫຼືອ 2 ຫຼັກທົດສະນິຍົມ ກ່ອນສົ່ງເຂົ້າ DB
const round2 = (n: number) => Math.round(n * 100) / 100;

// ====================================================================
// Limit Check placeholder — Module 8 ຈະມາຕື່ມ logic ຈິງຢູ່ນີ້
// ຕອນນີ້ບໍ່ check ຫຍັງ, ພຽງແຕ່ວາງ hook ໄວ້ໃນຈຸດທີ່ຖືກຕ້ອງ
// (requirement: "called before every save")
// ====================================================================
const checkTransactionLimit = async (
  _customerId: number,
  _amountUsd: number
): Promise<void> => {
  // TODO(module 8): ດຶງ MONTHLY_LIMIT_USD ຈາກ app_config,
  // ລວມຍອດ fxTransactionRepository.findCustomerMonthlyTotal(customerId, year, month),
  // ແລ້ວ throw AppError 400/409 ຖ້າເກີນ
  return;
};

// ====================================================================
// ຄຳນວນ rate / amount_lak / amount_usd ຈາກອັດຕາຂອງມື້ນີ້
// throw 404 ຖ້າຍັງບໍ່ມີອັດຕາຂອງສະກຸນເງິນນັ້ນໃນມື້ນີ້ (ຜ່ານ exchangeRateService.getTodayRate)
// ====================================================================
const calculateAmounts = async (
    currencyId: number, 
    amountForeign: number
) => {
    const currency = await sysCodeService.getSysCodeById(currencyId);

    if (currency.category !== "CURRENCY") {
        throw new AppError(`Currency ID: ${currencyId} ບໍ່ແມ່ນລະຫັດສະກຸນເງິນ`, 400);
    }

    const rateInfo = await exchangeRateService.getTodayRate(currencyId);
    const rate = Number(rateInfo.rate);
    const amountLak = round2(amountForeign * rate);

    let amountUsd: number;

    if (currency.code === "USD") {
        amountUsd = round2(amountForeign);
    } else {
        // ຕ້ອງການອັດຕາ USD ຂອງມື້ນີ້ ເພື່ອແປງ LAK → USD (cross-rate)
        const currencies = await sysCodeService.getSysCodes("CURRENCY");
        const usdCode = currencies.find((c: any) => c.code === "USD");

    if (!usdCode) {
        throw new AppError("ບໍ່ພົບລະຫັດສະກຸນເງິນ USD ໃນລະບົບ", 500);
    }

        const usdRateInfo = await exchangeRateService.getTodayRate(usdCode.code_id);
        const usdRate = Number(usdRateInfo.rate);
        amountUsd = round2(amountLak / usdRate);
    }

    return { rate, amountLak, amountUsd };
};

// Create — upsert customer + insert fx_daily ໃນ DB transaction ດຽວກັນ
export const createNewTransaction = async (
  data: CreateFxTransactionInput,
  createdBy: number
) => {
    // ຄຳນວນກ່ອນເປີດ transaction (ເປັນແຕ່ການອ່ານ, ບໍ່ຈຳເປັນຕ້ອງຢູ່ໃນ transaction)
    const { rate, amountLak, amountUsd } = await calculateAmounts(
        data.currencyId,
        data.amountForeign
    );

    const connection = await fxTransactionRepository.getTransactionConnection();

    try {
        await connection.beginTransaction();

        const existingCustomer = await fxTransactionRepository.findCustomerByIdCodeTx(
            connection,
            data.idTypeId,
            data.idCode
        );

        const customerId = existingCustomer ? existingCustomer.customer_id
        : await fxTransactionRepository.createCustomerTx(
            connection,
            data.idTypeId,
            data.idCode,
            data.firstNameEn,
            data.lastNameEn,
            data.firstNameLo,
            data.lastNameLo,
            data.dateOfBirth,
            data.isForeigner,
            data.genderId,
            data.phoneNumber,
            data.address,
            createdBy
        );

        // ຈຸດທີ່ requirement ບອກ "ຕ້ອງເອີ້ນກ່ອນທຸກຄັ້ງທີ່ save" — ຍັງເປັນ placeholder
        await checkTransactionLimit(customerId, amountUsd);

        const txnId = await fxTransactionRepository.createTransactionTx(
            connection,
            new Date(),
            customerId,
            data.productId,
            data.currencyId,
            data.amountForeign,
            rate,
            amountLak,
            amountUsd,
            data.branchId,
            data.unitId,
            createdBy
        );

        await connection.commit();

        return await fxTransactionRepository.findTransactionById(txnId);
    } catch (err) {
        await connection.rollback();

        const errno = getErrno(err);

    if (errno === MYSQL_DUP_ENTRY) {
        throw new AppError(`ລູກຄ້າທີ່ມີເລກທີເອກະສານ "${data.idCode}" ມີຢູ່ແລ້ວ`, 409);
    }
    if (errno === MYSQL_FK_FAIL) {
        throw new AppError("ຂໍ້ມູນອ້າງອີງ (ສາຂາ/ຫົວໜ່ວຍ/ປະເພດ/ສະກຸນເງິນ) ບໍ່ຖືກຕ້ອງ", 400);
    }
    if (errno === MYSQL_CHECK_VIOLATED) {
        throw new AppError("ຈຳນວນເງິນ ຫຼື ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0", 400);
    }
        throw err;
    } finally {
        connection.release();
    }
};

// ============================ Get ============================

export const getAllTransactions = async () => {
    return await fxTransactionRepository.findAllTransactions();
};

export const getTransactionsPaginated = async (
    page: number, 
    limit: number
) => {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

    const { 
        transactions, 
        total_records 
    } = await fxTransactionRepository.findTransactionsPaginated(safePage, safeLimit);

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        transactions,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages,
        },
    };
};

// Transaction By Id — single source of truth
export const getTransactionById = async (txnId: number) => {
    const txn = await fxTransactionRepository.findTransactionById(txnId);

    if (!txn) {
        throw new AppError(`ບໍ່ພົບທຸລະກຳ ID: ${txnId}`, 404);
    }

    return txn;
};

// ============================ Update ============================
// ຖ້າ amountForeign ຫຼື currencyId ປ່ຽນ, ຄຳນວນ rate/amount_lak/amount_usd ໃໝ່
// ຕາມອັດຕາຂອງ "ມື້ນີ້" (ບໍ່ແມ່ນມື້ທີ່ສ້າງທຸລະກຳເດີມ) — ນີ້ແມ່ນການຕັດສິນໃຈອອກແບບ,
// ຖ້າຢາກຄົງ rate ເດີມໄວ້ເມື່ອແກ້ແຕ່ field ອື່ນ (ເຊັ່ນ branchId) ໃຫ້ແຈ້ງເພື່ອປັບ
export const updateExistingTransaction = async (
    txnId: number,
    data: UpdateFxTransactionInput,
    updatedBy: number
) => {
    const existing = await getTransactionById(txnId);

    const merged = {
        customerId: existing.customer_id,
        productId: data.productId ?? existing.product_id,
        currencyId: data.currencyId ?? existing.currency_id,
        amountForeign: data.amountForeign ?? Number(existing.amount_foreign),
        branchId: data.branchId ?? existing.branch_id,
        unitId: data.unitId ?? existing.unit_id,
        isActive: data.isActive ?? existing.is_active,
    };

    const amountOrCurrencyChanged = data.amountForeign !== undefined || data.currencyId !== undefined;

    let rate: number;
    let amountLak: number;
    let amountUsd: number;

    if (amountOrCurrencyChanged) {
        const calculated = await calculateAmounts(merged.currencyId, merged.amountForeign);
        rate = calculated.rate;
        amountLak = calculated.amountLak;
        amountUsd = calculated.amountUsd;
    } else {
        rate = Number(existing.rate);
        amountLak = Number(existing.amount_lak);
        amountUsd = Number(existing.amount_usd);
    }

    let affectedRows: number;

    try {
        affectedRows = await fxTransactionRepository.updateTransaction(
            txnId,
            existing.txn_date,
            merged.customerId,
            merged.productId,
            merged.currencyId,
            merged.amountForeign,
            rate,
            amountLak,
            amountUsd,
            merged.branchId,
            merged.unitId,
            merged.isActive,
            updatedBy
        );
    } catch (err) {
        const errno = getErrno(err);

    if (errno === MYSQL_FK_FAIL) {
        throw new AppError("ຂໍ້ມູນອ້າງອີງ (ສາຂາ/ຫົວໜ່ວຍ/ປະເພດ/ສະກຸນເງິນ) ບໍ່ຖືກຕ້ອງ", 400);
    }
    if (errno === MYSQL_CHECK_VIOLATED) {
        throw new AppError("ຈຳນວນເງິນ ຫຼື ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0", 400);
    }
        throw err;
    }

    if (affectedRows === 0) {
        throw new AppError("ບໍ່ສາມາດແກ້ໄຂທຸລະກຳໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
    }

    return await fxTransactionRepository.findTransactionById(txnId);
};

// ============================ Soft Delete / Restore ============================

export const softDeleteTransaction = async (
    txnId: number, 
    deletedBy: number
) => {
    const affectedRows = await fxTransactionRepository.softDeleteTransaction(
        txnId,
        deletedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບທຸລະກຳ ID: ${txnId} ຫລື ອາດຖືກລົບໄປແລ້ວ`, 404);
    }
};

export const restoreTransaction = async (txnId: number, updatedBy: number) => {
    const affectedRows = await fxTransactionRepository.restoreTransaction(
        txnId,
        updatedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບທຸລະກຳ ID: ${txnId} ຫລື ບໍ່ໄດ້ຖືກລົບ`, 404);
    }
};