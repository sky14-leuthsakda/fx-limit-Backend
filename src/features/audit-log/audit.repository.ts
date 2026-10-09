import pool from "../../connector/db.js";
import type { RowDataPacket } from "mysql2/promise";

// App Config Logs
export const findAppConfigLogs = async (
    dateFrom: string | null,
    dateTo: string | null,
    userId: number | null,
    configKey: string | null,
    actionType: string | null,
    page: number,
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_app_config_logs_get_filtered(?, ?, ?, ?, ?, ?, ?)",
        [
            dateFrom, 
            dateTo, 
            userId, 
            configKey, 
            actionType, 
            page, 
            limit
        ]
    );

    return {
        results: result[0] ?? [],
        total_records: Number(result[1]?.[0]?.total_records ?? 0),
    };
};

// FX Daily Logs
export const findFxDailyLogs = async (
    dateFrom: string | null,
    dateTo: string | null,
    userId: number | null,
    txnId: number | null,
    actionType: string | null,
    page: number,
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_fx_daily_logs_get_filtered(?, ?, ?, ?, ?, ?, ?)",
        [
            dateFrom, 
            dateTo, 
            userId, 
            txnId, 
            actionType, 
            page, 
            limit
        ]
    );

    return {
        results: result[0] ?? [],
        total_records: Number(result[1]?.[0]?.total_records ?? 0),
    };
};