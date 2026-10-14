import pool from "../../connector/db.js";
import type { RowDataPacket } from "mysql2/promise";

// Transaction Report (Detail)
export const findTransactionReport = async (
    dateFrom: string,
    dateTo: string,
    branchId: number | null,
    unitId: number | null,
    tellerId: number | null,
    currencyId: number | null,
    productId: number | null,
    page: number,
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_report_transactions(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            dateFrom,
            dateTo,
            branchId,
            unitId,
            tellerId,
            currencyId,
            productId,
            page,
            limit
        ]
    );

    return {
        results: result[0] ?? [],
        total_records: Number(result[1]?.[0]?.total_records ?? 0),
    };
};

// Summary Report
export const findReportSummary = async (
    dateFrom: string,
    dateTo: string,
    groupBy: string,
    branchId: number | null,
    unitId: number | null,
    tellerId: number | null,
    currencyId: number | null,
    productId: number | null
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_report_summary(?, ?, ?, ?, ?, ?, ?, ?)",
        [
            dateFrom,
            dateTo,
            groupBy,
            branchId,
            unitId,
            tellerId,
            currencyId,
            productId
        ]
    );

    return {
        results: result[0] ?? [],
        totals: result[1]?.[0] ?? null,
    };
};

// Over-limit Report
export const findOverLimitReport = async (
    dateFrom: string,
    dateTo: string,
    page: number,
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_report_over_limit(?, ?, ?, ?)",
        [
            dateFrom,
            dateTo,
            page,
            limit
        ]
    );

    return {
        results: result[0] ?? [],
        total_records: Number(result[1]?.[0]?.total_records ?? 0),
        limit_usd: result[1]?.[0]?.limit_usd ?? null,
    };
};