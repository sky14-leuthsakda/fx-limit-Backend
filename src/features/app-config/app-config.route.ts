import { Hono } from "hono";
import {
    createAppConfigSchema,
    updateAppConfigSchema,
} from "./app-config.schema.js";
import * as appConfigService from "./app-config.service.js";
import type { Variables } from "../../middlewares/types.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const appConfigRoutes = new Hono<{ Variables: Variables }>();
const canEditConfig = requirePermission("CONFIG_EDIT");

// Authentication
appConfigRoutes.use("*", authMiddleware);


// Create Config
appConfigRoutes.post("/", canEditConfig, async (c) => {
    const body = await c.req.json();
    const validation = createAppConfigSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const { userId } = c.get("user");
    const newConfig = await appConfigService.createNewConfig(
        validation.data, 
        userId
    );

    return c.json({
        success: true,
        message: "ສ້າງ Config ສຳເລັດ",
        data: newConfig,
    }, 201);
});


// Configs All
appConfigRoutes.get("/", async (c) => {
    const result = await appConfigService.getAllConfigs();

    return c.json({
        success: true,
        data: result,
    });
});


// Config By Key
appConfigRoutes.get("/:configKey", async (c) => {
    const configKey = c.req.param("configKey");

    if (!configKey) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Config Key"
        }, 400);
    }

    const result = await appConfigService.getConfigByKey(
        configKey
    );

    return c.json({
        success: true,
        data: result,
    });
});


// Update Config
appConfigRoutes.put("/:configKey", canEditConfig, async (c) => {
    const configKey = c.req.param("configKey");

    if (!configKey) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Config Key"
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateAppConfigSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const { userId } = c.get("user");
    const updatedConfig = await appConfigService.updateConfig(
        configKey,
        validation.data,
        userId
    );

    return c.json({
        success: true,
        message: "ແກ້ໄຂ Config ສຳເລັດ",
        data: updatedConfig,
    });
});


// Soft Delete Config
appConfigRoutes.patch("/:configKey/disable", canEditConfig, async (c) => {
    const configKey = c.req.param("configKey");

    if (!configKey) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Config Key"
        }, 400);
    }

    const { userId } = c.get("user");
    await appConfigService.softDeleteConfig(configKey, userId);

    return c.json({
        success: true,
        message: "ລຶບ Config ສຳເລັດ"
    });
});


// Restore Config
appConfigRoutes.patch("/:configKey/enable", canEditConfig, async (c) => {
    const configKey = c.req.param("configKey");

    if (!configKey) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Config Key"
        }, 400);
    }

    const { userId } = c.get("user");
    await appConfigService.restoreConfig(configKey, userId);

    return c.json({
        success: true,
        message: "ກູ້ຄືນ Config ສຳເລັດ"
    });
});


export default appConfigRoutes;