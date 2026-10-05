import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Create New Rate
export const createRate = async (
    rateDate: string,
    currencyId: number,
    rate: number,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_insert(?, ?, ?, ?)",
        [
            rateDate, 
            currencyId, 
            rate, 
            createdBy
        ]
    );

    return result[0]?.[0]?.rate_id ?? 0;
};

// Rates All
export const findRateAll = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_all()"
    );

    return result[0] ?? [];
};

// Rates Paginated
export const findRatesPaginated = async (
    page: number, 
    limit: number
) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_paginated(?, ?)",
        [page, limit]
    );
    
    return { 
        rates: results[0] ?? [], 
        total_records: results[1]?.[0]?.total_records ?? 0 
    };
};

// Today's Rate Per CurrencyId 
export const findTodayRate = async (currencyId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_today_by_currency(?)",
        [currencyId]
    );

    return result[0]?.[0] ?? null;
}

// History Rate Per CurrencyId (Default: 30 days)
export const findRateHistory = async (
    currencyId: number, 
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_history_by_currency(?, ?)",
        [currencyId, limit]
    );

    return result[0] ?? [];
}

// Today's Rates All
export const findAllCurrentRates = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_today_all()"
    );

    return result[0] ?? [];
}

// Rate By Id - single source of truth
export const findRateById = async (rateId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_ex_rate_daily_get_by_id(?)",
        [rateId]
    );

    return result[0]?.[0] ?? null;
}

// Uppdate Rate
export const updateRate = async (
  rateId: number,
  rateDate: string,
  currencyId: number,
  rate: number,
  isActive: number,
  updatedBy: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_ex_rate_daily_update(?, ?, ?, ?, ?, ?)",
    [
        rateId, 
        rateDate,
        currencyId,
        rate,
        isActive, 
        updatedBy
    ]
  );

  return result.affectedRows;
};

// Soft Delete Rate
export const softDeleteRate = async (
    rateId: number, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_ex_rate_daily_soft_delete(?, ?)",
        [rateId, deletedBy]
    );

    return result.affectedRows;
};

// Restore Rate
export const restoreRate = async (
    rateId: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_ex_rate_daily_restore(?, ?)",
        [rateId, updatedBy]
    );

    return result.affectedRows;
};

