import * as auditRepository from "./audit.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
    AppConfigLogQueryInput,
    FxDailyLogQueryInput
} from "./audit.schema.js";

// ກວດຊ່ວງວັນທີ ແລະ Format ໃຫ້ກວມເອົາເຕັມວັນ (00:00:00 - 23:59:59)
const prepareDateRange = (
    dateFrom?: string, 
    dateTo?: string
) => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
        throw new AppError("ວັນທີເລີ່ມຕົ້ນຕ້ອງບໍ່ຫຼັງຈາກວັນທີສິ້ນສຸດ", 400);
    }

    return {
        dateFrom: dateFrom ? `${dateFrom} 00:00:00` : null,
        dateTo: dateTo ? `${dateTo} 23:59:59` : null,
    };
};

// App Config Logs
export const getAppConfigLogs = async (query: AppConfigLogQueryInput) => {
    const { dateFrom, dateTo } = prepareDateRange(
        query.dateFrom, 
        query.dateTo
    );

    const safePage = query.page > 0 ? query.page : 1;
    const safeLimit = query.limit > 0 && query.limit <= 100 ? query.limit : 20;

    const { results, total_records } = await auditRepository.findAppConfigLogs(
        dateFrom,
        dateTo,
        query.userId ?? null,
        query.configKey ?? null,
        query.actionType ?? null,
        safePage,
        safeLimit
    );

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        logs: results,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages,
        },
    };
};

// FX Daily Logs
export const getFxDailyLogs = async (query: FxDailyLogQueryInput) => {
    const { dateFrom, dateTo } = prepareDateRange(
        query.dateFrom, 
        query.dateTo
    );

    const safePage = query.page > 0 ? query.page : 1;
    const safeLimit = query.limit > 0 && query.limit <= 100 ? query.limit : 20;

    const { results, total_records } = await auditRepository.findFxDailyLogs(
        dateFrom,
        dateTo,
        query.userId ?? null,
        query.txnId ?? null,
        query.actionType ?? null,
        safePage,
        safeLimit
    );

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        logs: results,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages,
        },
    };
};