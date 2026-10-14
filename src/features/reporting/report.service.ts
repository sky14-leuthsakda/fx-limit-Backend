import * as reportRepository from "./report.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
    TransactionReportQueryInput,
    ReportSummaryQueryInput,
    OverLimitReportQueryInput,
} from "./report.schema.js";

// Check the date range and format to cover the full day (00:00:00 - 23:59:59)
const prepareDateRange = (dateFrom: string, dateTo: string) => {
    if (dateFrom > dateTo) {
        throw new AppError("ວັນທີເລີ່ມຕົ້ນຕ້ອງບໍ່ຫຼັງຈາກວັນທີສິ້ນສຸດ", 400);
    }

    return {
        dateFrom: `${dateFrom} 00:00:00`,
        dateTo: `${dateTo} 23:59:59`,
    };
};

// ---------- Transaction Report (Detail) ----------

export const getTransactionReport = async (query: TransactionReportQueryInput) => {
    const { dateFrom, dateTo } = prepareDateRange(query.dateFrom, query.dateTo);

    const safePage = query.page > 0 ? query.page : 1;
    const safeLimit = query.limit > 0 && query.limit <= 100 ? query.limit : 20;

    const { results, total_records } = await reportRepository.findTransactionReport(
        dateFrom,
        dateTo,
        query.branchId ?? null,
        query.unitId ?? null,
        query.tellerId ?? null,
        query.currencyId ?? null,
        query.productId ?? null,
        safePage,
        safeLimit
    );

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        rows: results,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages,
        },
    };
};

// ---------- Summary Report ----------

export const getReportSummary = async (query: ReportSummaryQueryInput) => {
    const { dateFrom, dateTo } = prepareDateRange(query.dateFrom, query.dateTo);

    const { results, totals } = await reportRepository.findReportSummary(
        dateFrom,
        dateTo,
        query.groupBy,
        query.branchId ?? null,
        query.unitId ?? null,
        query.tellerId ?? null,
        query.currencyId ?? null,
        query.productId ?? null
    );

    return {
        rows: results,
        totals,
    };
};

// ---------- Over-limit Report ----------

export const getOverLimitReport = async (query: OverLimitReportQueryInput) => {
    const { dateFrom, dateTo } = prepareDateRange(query.dateFrom, query.dateTo);

    const safePage = query.page > 0 ? query.page : 1;
    const safeLimit = query.limit > 0 && query.limit <= 100 ? query.limit : 20;

    const { results, total_records, limit_usd } = await reportRepository.findOverLimitReport(
        dateFrom,
        dateTo,
        safePage,
        safeLimit
    );

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        rows: results,
        limitUsd: limit_usd,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages,
        },
    };
};