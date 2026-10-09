import { Hono } from "hono";
import {
    appConfigLogQuerySchema,
    fxDailyLogQuerySchema,
} from "./audit.schema.js";
import * as auditService from "./audit.service.js";
import type { Variables } from "../../middlewares/types.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const auditRoutes = new Hono<{ Variables: Variables }>();
const canViewAudit = requirePermission("REPORT_VIEW");

auditRoutes.use("*", authMiddleware);

// App Config Logs
auditRoutes.get("/app-config-logs", canViewAudit, async (c) => {
    const validation = appConfigLogQuerySchema.safeParse(c.req.query());

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const result = await auditService.getAppConfigLogs(validation.data);

    return c.json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
    });
});

// FX Daily Logs
auditRoutes.get("/fx-daily-logs", canViewAudit, async (c) => {
    const validation = fxDailyLogQuerySchema.safeParse(c.req.query());

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const result = await auditService.getFxDailyLogs(validation.data);

    return c.json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
    });
});

export default auditRoutes;