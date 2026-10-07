import * as fxTransactionRepository from "./fx-transaction.repository.js";
import * as exchangeRateService from "../exchange-rate/exchange-rate.service.js";
import * as sysCodeService from "../sys-codes/sys-code.service.js";
import * as appConfigRepository from "../app-config/app-config.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateFxTransactionInput,
  UpdateFxTransactionInput,
} from "./fx-transaction.schema.js";
import type { PoolConnection } from "mysql2/promise";

const round2 = (n: number) => Math.round(n * 100) / 100;

// Limit Check Engine
const checkTransactionLimit = async (
  customerId: number,
  amountUsd: number,
  excludeTxnId?: number
): Promise<void> => {
  const config = await appConfigRepository.findConfigByKey("MONTHLY_LIMIT_USD");

  if (!config || !config.is_active) {
    throw new AppError("ບໍ່ພົບການຕັ້ງຄ່າ MONTHLY_LIMIT_USD ໃນລະບົບ", 500);
  }

  const limit = parseFloat(config.config_value);

  if (isNaN(limit) || limit <= 0) {
    throw new AppError("ຄ່າ MONTHLY_LIMIT_USD ບໍ່ຖືກຕ້ອງ", 500);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const existingTotal = customerId > 0 
    ? await fxTransactionRepository.findCustomerMonthlyTotal(
    customerId,
    year,
    month,
    excludeTxnId
  )
  : 0;

  const newTotal = existingTotal + amountUsd;

  if (newTotal > limit) {
    throw new AppError(
        `ທຸລະກຳນີ້ເກີນວົງເງິນສູງສຸດຕໍ່ເດືອນ (${limit.toFixed(2)} USD). ` +
        `ຍອດໃຊ້ແລ້ວເດືອນນີ້: ${existingTotal.toFixed(2)} USD, ` +
        `ທຸລະກຳນີ້: ${amountUsd.toFixed(2)} USD`,
      409
    );
  }
};

// Calculate Rate / amount_lak / amount_usd / By Today Rate
const calculateAmounts = async (currencyId: number, amountForeign: number) => {
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
    // Today Rate Change LAK → USD (cross-rate)
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

// Create — upsert customer + insert fx_daily in DB transaction 
export const createNewTransaction = async (
  data: CreateFxTransactionInput,
  createdBy: number
) => {
// Calculate before open Amount & Rate
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

    if (existingCustomer) {
      await checkTransactionLimit(
        existingCustomer.customer_id,
        amountUsd
      );
    } else {
      await checkTransactionLimit(0, amountUsd);
    }

    const customerId = existingCustomer
      ? existingCustomer.customer_id
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
  } catch (err: any) {
    await connection.rollback();

    if (err.errno === 1062) {
      throw new AppError(`ລູກຄ້າທີ່ມີເລກທີເອກະສານ "${data.idCode}" ມີຢູ່ແລ້ວ`, 409);
    }
    if (err.errno === 1452) {
      throw new AppError("ຂໍ້ມູນອ້າງອີງ (ສາຂາ/ຫົວໜ່ວຍ/ປະເພດ/ສະກຸນເງິນ) ບໍ່ຖືກຕ້ອງ", 400);
    }
    if (err.errno === 3819) {
      throw new AppError("ຈຳນວນເງິນ ຫຼື ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0", 400);
    }
    throw err;
  } finally {
    connection.release();
  }
};

// Transactions All
export const getAllTransactions = async () => {
  return await fxTransactionRepository.findAllTransactions();
};

// Transactions Paginated
export const getTransactionsPaginated = async (page: number, limit: number) => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

  const { transactions, total_records } =
    await fxTransactionRepository.findTransactionsPaginated(safePage, safeLimit);

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

// Update Transaction 
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
    unitId: data.unitId !== undefined ? data.unitId : existing.unit_id,
    isActive: data.isActive ?? existing.is_active,
  };

  const amountOrCurrencyChanged =
    data.amountForeign !== undefined || data.currencyId !== undefined;

  let rate: number;
  let amountLak: number;
  let amountUsd: number;

  if (amountOrCurrencyChanged) {
    const calculated = await calculateAmounts(merged.currencyId, merged.amountForeign);
    rate = calculated.rate;
    amountLak = calculated.amountLak;
    amountUsd = calculated.amountUsd;

    // re-check limit 
    await checkTransactionLimit(merged.customerId, amountUsd, txnId);
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
  } catch (err: any) {
    if (err.errno === 1452) {
      throw new AppError("ຂໍ້ມູນອ້າງອີງ (ສາຂາ/ຫົວໜ່ວຍ/ປະເພດ/ສະກຸນເງິນ) ບໍ່ຖືກຕ້ອງ", 400);
    }
    if (err.errno === 3819) {
      throw new AppError("ຈຳນວນເງິນ ຫຼື ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0", 400);
    }
    throw err;
  }

  if (affectedRows === 0) {
    throw new AppError("ບໍ່ສາມາດແກ້ໄຂທຸລະກຳໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
  }

  return await fxTransactionRepository.findTransactionById(txnId);
};

// Soft Delete Transaction
export const softDeleteTransaction = async (txnId: number, deletedBy: number) => {
  const affectedRows = await fxTransactionRepository.softDeleteTransaction(
    txnId,
    deletedBy
  );

  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບທຸລະກຳ ID: ${txnId} ຫລື ອາດຖືກລົບໄປແລ້ວ`, 404);
  }
};

// Restore Transaction
export const restoreTransaction = async (txnId: number, updatedBy: number) => {
  const affectedRows = await fxTransactionRepository.restoreTransaction(
    txnId,
    updatedBy
  );

  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບທຸລະກຳ ID: ${txnId} ຫລື ບໍ່ໄດ້ຖືກລົບ`, 404);
  }
};