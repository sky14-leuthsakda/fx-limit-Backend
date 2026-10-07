import { Hono } from "hono";
import type { Context, Next } from "hono";
import {
    createAppConfigSchema,
    updateAppConfigSchema,
} from "./app-config.schema.js";
import * as appConfigService from "./app-config.service.js";
import type { Variables } from "../../middlewares/types.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { AppError } from "../../utils/AppError.js";

const appConfigRoutes = new Hono<{ Variables: Variables }>();
const canEditConfig = requirePermission("CONFIG_EDIT");

// ====================================================================
// requirement: Module 8 ຕ້ອງການ "LIMIT_MANAGE to change the cap" ແຍກ
// ຈາກ Module 10 "CONFIG_EDIT" ທົ່ວໄປ. ດັ່ງນັ້ນ key ທີ່ກ່ຽວກັບວົງເງິນ
// (ຕອນນີ້ມີແຕ່ MONTHLY_LIMIT_USD, ເພີ່ມໄດ້ພາຍຫຼັງຖ້າມີ key ອື່ນ) ຕ້ອງການ
// LIMIT_MANAGE ແທນ CONFIG_EDIT — ຄົນທີ່ແກ້ config ທົ່ວໄປ (ເຊັ່ນ
// REGULATION_DOC_URL) ບໍ່ຄວນປ່ຽນວົງເງິນໄດ້ນຳ.
// ====================================================================
const LIMIT_CONFIG_KEYS = ["MONTHLY_LIMIT_USD"];

const resolveConfigKey = async (c: Context): Promise<string | undefined> => {
    const paramKey = c.req.param("configKey");
    if (paramKey) return paramKey;

    try {
        const body = await c.req.json<{ configKey?: string }>();
        return body?.configKey;
    } catch {
        return undefined;
    }
};

// Dynamic permission: ເລືອກ LIMIT_MANAGE ຫຼື CONFIG_EDIT ຕາມ configKey
// ຂອງ request ນີ້ (ຮູ້ຈາກ URL param ຕອນ update/disable/enable,
// ຫຼືຈາກ body ຕອນ create)
const requireConfigPermission = async (
    c: Context<{ Variables: Variables }>,
    next: Next
) => {
    const configKey = await resolveConfigKey(c);
    const requiredPermission =
        configKey && LIMIT_CONFIG_KEYS.includes(configKey)
            ? "LIMIT_MANAGE"
            : "CONFIG_EDIT";

    const user = c.get("user");

    if (!user.permissions?.includes(requiredPermission)) {
        throw new AppError(
            `ທ່ານບໍ່ມີສິດ ${requiredPermission} ໃນການດຳເນີນການນີ້`,
            403
        );
    }

    await next();
};

// Authentication — ທຸກ route ຕ້ອງ login ກ່ອນ
appConfigRoutes.use("*", authMiddleware);

// ======================================
// Create Config
// ======================================
appConfigRoutes.post("/", requireConfigPermission, async (c) => {
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

// ======================================
// Get All Configs (ບໍ່ຕ້ອງການ CONFIG_EDIT/LIMIT_MANAGE, login ພຽງພໍ)
// ======================================
appConfigRoutes.get("/", async (c) => {
    const result = await appConfigService.getAllConfigs();

    return c.json({
        success: true,
        data: result,
    });
});

// ======================================
// Get Config By Key
// ======================================
appConfigRoutes.get("/:configKey", async (c) => {
    const configKey = c.req.param("configKey");

    if (!configKey) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Config Key"
        }, 400);
    }

    const result = await appConfigService.getConfigByKey(configKey);

    return c.json({
        success: true,
        data: result,
    });
});

// ======================================
// Update Config
// ======================================
appConfigRoutes.put("/:configKey", requireConfigPermission, async (c) => {
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

// ======================================
// Soft Delete Config
// ======================================
appConfigRoutes.patch("/:configKey/disable", requireConfigPermission, async (c) => {
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
        message: "ປິດການໃຊ້ງານ Config ສຳເລັດ"
    });
});

// ======================================
// Restore Config
// ======================================
appConfigRoutes.patch("/:configKey/enable", requireConfigPermission, async (c) => {
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
        message: "ເປີດການໃຊ້ງານ Config ສຳເລັດ"
    });
});

export default appConfigRoutes;