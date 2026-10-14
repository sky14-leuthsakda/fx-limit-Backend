import { Hono } from "hono";
import { 
    transactionReportQuerySchema,
    reportSummaryQuerySchema,
    overLimitReportQuerySchema
} from "./report.schema.js";
import * as reportService from "./report.service.js";
import type { Variables } from "../../middlewares/types.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const reportRoutes = new Hono<{ Variables: Variables }>();
const canViewReport = requirePermission("REPORT_VIEW");

// Apply authentication middleware to all report routes
reportRoutes.use("*", authMiddleware);

// ==================== REPORT QUERY ROUTES (JSON) ====================

// Transaction Report (Detail)
reportRoutes.get("/transaction", canViewReport, async (c) => {
    const validation = transactionReportQuerySchema.safeParse(c.req.query());

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const result = await reportService.getTransactionReport(validation.data);

    return c.json({
        success: true,
        data: result.rows,
        pagination: result.pagination,
    });
});

// Summary Report
reportRoutes.get("/summary", canViewReport, async (c) => {
    const validation = reportSummaryQuerySchema.safeParse(c.req.query());

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const result = await reportService.getReportSummary(validation.data);

    return c.json({
        success: true,
        data: result.rows,
        totals: result.totals,
    });
});

// Over-limit Report
reportRoutes.get("/over-limit", canViewReport, async (c) => {
    const validation = overLimitReportQuerySchema.safeParse(c.req.query());

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const result = await reportService.getOverLimitReport(validation.data);

    return c.json({
        success: true,
        data: result.rows,
        limitUsd: result.limitUsd,
        pagination: result.pagination,
    });
});

export default reportRoutes;