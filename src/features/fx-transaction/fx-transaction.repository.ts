import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";

// ====================================================================
// TRANSACTION-AWARE HELPERS (customer upsert + fx_daily insert)
// ----------------------------------------------------------------------
// ເພື່ອໃຫ້ "ຫາ/ສ້າງລູກຄ້າ" ແລະ "ບັນທຶກທຸລະກຳ" ເປັນ atomic ດຽວກັນ
// (ຖ້າ insert fx_daily ລົ້ມ, customer ທີ່ຫາກໍສ້າງຕ້ອງ rollback ນຳ),
// function ກຸ່ມນີ້ຮັບ `connection` ທີ່ service ເປີດຜ່ານ pool.getConnection()
// ແລະ beginTransaction() ໄວ້ແລ້ວ — ແທນທີ່ຈະໃຊ້ `pool` ໂດຍກົງຄືບ່ອນອື່ນ.
// Pattern ນີ້ຄືກັນກັບ syncRolePermissions ໃນ role.repository.ts.
// ====================================================================

export const getTransactionConnection = () => pool.getConnection();

export const findCustomerByIdCodeTx = async (
    connection: PoolConnection,
    idTypeId: number,
    idCode: string
) => {
    const [result] = await connection.query<RowDataPacket[][]>(
        "CALL sp_customers_find_by_id_code(?, ?)",
        [idTypeId, idCode]
    );

    return result[0]?.[0] ?? null;
};

export const createCustomerTx = async (
    connection: PoolConnection,
    idTypeId: number,
    idCode: string,
    firstNameEn: string | undefined,
    lastNameEn: string | undefined,
    firstNameLo: string | undefined,
    lastNameLo: string | undefined,
    dateOfBirth: string | undefined,
    isForeigner: boolean,
    genderId: number | undefined,
    phoneNumber: string | undefined,
    address: string | undefined,
    createdBy: number
) => {
    const [result] = await connection.query<RowDataPacket[][]>(
        "CALL sp_customers_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            idTypeId,
            idCode,
            firstNameEn ?? null,
            lastNameEn ?? null,
            firstNameLo ?? null,
            lastNameLo ?? null,
            dateOfBirth ?? null,
            isForeigner ? 1 : 0,
            genderId ?? null,
            phoneNumber ?? null,
            address ?? null,
            createdBy,
        ]
    );

    return result[0]?.[0]?.customer_id ?? 0;
};

export const createTransactionTx = async (
    connection: PoolConnection,
    txnDate: Date,
    customerId: number,
    productId: number,
    currencyId: number,
    amountForeign: number,
    rate: number,
    amountLak: number,
    amountUsd: number,
    branchId: number,
    unitId: number | undefined,
    createdBy: number
) => {
    const [result] = await connection.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            txnDate,
            customerId,
            productId,
            currencyId,
            amountForeign,
            rate,
            amountLak,
            amountUsd,
            branchId,
            unitId ?? null,
            createdBy,
        ]
    );

    return result[0]?.[0]?.txn_id ?? 0;
};

// ====================================================================
// NORMAL CRUD (ບໍ່ຕ້ອງການ transaction ແຍກ — ໃຊ້ pool ຕາມປົກກະຕິ)
// ====================================================================

export const findAllTransactions = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_all()"
    );

    return result[0] ?? [];
};

export const findTransactionsPaginated = async (
    page: number, 
    limit: number
) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_paginated(?, ?)",
        [page, limit]
    );

    return {
        transactions: results[0] ?? [],
        total_records: results[1]?.[0]?.total_records ?? 0,
    };
};

export const findTransactionById = async (txnId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_by_id(?)",
        [txnId]
    );

    return result[0]?.[0] ?? null;
};

export const updateTransaction = async (
    txnId: number,
    txnDate: Date,
    customerId: number,
    productId: number,
    currencyId: number,
    amountForeign: number,
    rate: number,
    amountLak: number,
    amountUsd: number,
    branchId: number,
    unitId: number | null,
    isActive: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_fx_daily_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            txnId,
            txnDate,
            customerId,
            productId,
            currencyId,
            amountForeign,
            rate,
            amountLak,
            amountUsd,
            branchId,
            unitId,
            isActive,
            updatedBy,
        ]
    );

    return result.affectedRows;
};

export const softDeleteTransaction = async (
    txnId: number, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_fx_daily_soft_delete(?, ?)",
        [txnId, deletedBy]
    );

    return result.affectedRows;
};

export const restoreTransaction = async (
    txnId: number, 
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_fx_daily_restore(?, ?)",
        [txnId, updatedBy]
    );

    return result.affectedRows;
};

// ສຳລັບ module 8 (Limit Check) — ລວມຍອດ amount_usd ຂອງລູກຄ້າໃນເດືອນທີ່ລະບຸ
// ຍັງບໍ່ຖືກເອີ້ນໃຊ້ຈິງຕອນນີ້ (checkTransactionLimit ໃນ service ເປັນ placeholder ຢູ່)
export const findCustomerMonthlyTotal = async (
    customerId: number,
    year: number,
    month: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_customer_monthly_total(?, ?, ?)",
        [customerId, year, month]
    );

    return Number(result[0]?.[0]?.total_usd ?? 0);
};