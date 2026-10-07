import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";

// TRANSACTION-AWARE HELPERS (customer upsert + fx_daily insert)
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

// Create Customer In Transaction
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

// Create Transaction
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

// Transactions All
export const findAllTransactions = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_all()"
    );

    return result[0] ?? [];
};

// Transactions Paginated
export const findTransactionsPaginated = async (page: number, limit: number) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_paginated(?, ?)",
        [page, limit]
    );

    return {
        transactions: results[0] ?? [],
        total_records: results[1]?.[0]?.total_records ?? 0,
    };
};

// Transaction By Txn ID
export const findTransactionById = async (txnId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_by_id(?)",
        [txnId]
    );

    return result[0]?.[0] ?? null;
};

// Update Transaction
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
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader[]>(
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

    return result[0]?.affectedRows ?? 0;
};

// Soft Delete Transaction
export const softDeleteTransaction = async (
    txnId: number, 
    deletedBy: number
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader[]>(
        "CALL sp_fx_daily_soft_delete(?, ?)",
        [txnId, deletedBy]
    );

    return result[0]?.affectedRows ?? 0;
};

// Restore Transaction
export const restoreTransaction = async (
    txnId: number, 
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader[]>(
        "CALL sp_fx_daily_restore(?, ?)",
        [txnId, updatedBy]
    );

    return result[0]?.affectedRows ?? 0;
};

// Limit Check — ລວມຍອດ amount_usd ຂອງລູກຄ້າຕໍ່ເດືອນ
export const findCustomerMonthlyTotal = async (
    customerId: number,
    year: number,
    month: number,
    excludeTxnId?: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_get_customer_monthly_total(?, ?, ?, ?)",
        [customerId, year, month, excludeTxnId ?? null]
    );

    return Number(result[0]?.[0]?.total_usd ?? 0);
};