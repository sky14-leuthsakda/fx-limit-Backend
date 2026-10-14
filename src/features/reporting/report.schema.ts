import { z } from "zod";

// Optional ID: empty string "" or null is treated as "not provided"
const optionalId = (label: string) =>
    z.preprocess(
        (v) => (v === "" || v === null ? undefined : v),
        z.coerce.number()
            .int(`${label} ບໍ່ຖືກຕ້ອງ`)
            .positive(`${label} ບໍ່ຖືກຕ້ອງ`)
            .optional()
    );

// Date string in YYYY-MM-DD format and must be a valid calendar date
const dateString = (label: string) =>
    z.string().trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} ຕ້ອງເປັນຮູບແບບ YYYY-MM-DD`)
        .refine(
            (v) => new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v,
            { message: `${label} ບໍ່ຖືກຕ້ອງ` }
        );

// Common filters shared across reports
const reportFilterFields = {
    dateFrom: dateString("ວັນທີເລີ່ມຕົ້ນ"),
    dateTo: dateString("ວັນທີສິ້ນສຸດ"),
    branchId: optionalId("ສາຂາ"),
    unitId: optionalId("ໜ່ວຍ"),
    tellerId: optionalId("ພະນັກງານ"),
    currencyId: optionalId("ສະກຸນເງິນ"),
    productId: optionalId("ຜະລິດຕະພັນ"),
};

// Supported grouping dimensions for Summary reports
export const REPORT_GROUP_BY = [
    "BRANCH",
    "UNIT",
    "TELLER",
    "CURRENCY",
    "PRODUCT",
] as const;

// Transaction Report (Detail) Schema
export const transactionReportQuerySchema = z.object({
    ...reportFilterFields,
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
});

// Summary Report Schema
export const reportSummaryQuerySchema = z.object({
    ...reportFilterFields,
    groupBy: z.string().trim().refine(
        (v) => (REPORT_GROUP_BY as readonly string[]).includes(v),
        { message: `groupBy ຕ້ອງເປັນ ${REPORT_GROUP_BY.join(", ")}` }
    ),
});

// Over-limit Report Schema
export const overLimitReportQuerySchema = z.object({
    dateFrom: dateString("ວັນທີເລີ່ມຕົ້ນ"),
    dateTo: dateString("ວັນທີສິ້ນສຸດ"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
});

// Type Definitions for Query Inputs
export type TransactionReportQueryInput = z.infer<typeof transactionReportQuerySchema>;
export type ReportSummaryQueryInput = z.infer<typeof reportSummaryQuerySchema>;
export type OverLimitReportQueryInput = z.infer<typeof overLimitReportQuerySchema>;