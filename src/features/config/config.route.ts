import { Hono } from "hono";
import { createConfigSchema, updateConfigSchema } from "./config.schema.js";
import * as configService from "./config.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const  configRoutes = new Hono<{ Variables: Variables}>();

configRoutes.get("/", authMiddleware, async (c) => {
    const configs = await configService.getAllConfigs();
    return c.json({
        success: true,
        data: configs
    }); 
});

configRoutes.get("/:key", authMiddleware, async (c) => {
    const key = c.req.param("key");
    if (!key) 
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Key"
    }, 400);

    const config = await configService.getConfigByKey(key);
    return c.json({
        success: true,
        data: config
    });
});

configRoutes.post("/", authMiddleware, async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    const validation = createConfigSchema.safeParse(body);
    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
    }

    const newConfig = await configService.createNewConfig(validation.data, user.userId);
    return c.json({
        success: true,
        message: "ສ້າງການຕັ້ງຄ່າສຳເລັດ",
        data: newConfig
    }, 201);
});

configRoutes.put("/:key", authMiddleware, async (c) => {
    const user = c.get("user");
    const key = c.req.param("key");
    if (!key) 
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ Key"
    }, 400);

    const body = await c.req.json();
    const validation = updateConfigSchema.safeParse(body);
    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
    }

    const updated = await configService.updateExistingConfig(key, validation.data, user.userId);
    return c.json({
        success: true,
        message: "ແກ້ໄຂການຕັ້ງຄ່າສຳເລັດ",
        data: updated
    });
});

export default configRoutes; 