import { Hono } from "hono";
import { 
    createSysCodeSchema,
    updateSysCodeSchema
 } from "./sys-code.schema.js";
import * as sysCodeService from "./sys-code.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

 const sysCodeRoutes = new Hono<{ Variables: Variables }>();
 const canEditConfig = requirePermission("CONFIG_EDIT");

//  Create Sys Code
 sysCodeRoutes.post("/", authMiddleware, canEditConfig, async (c) => {
    const body = await c.req.json();
    const validation = createSysCodeSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
    }

    const { userId } =c.get("user");
    const newCode = await sysCodeService.createNewSysCode(validation.data, userId);
        
    return c.json({
        success: true,
        message: " ສ້າງ Sys Code ສຳເລັດ",
        data: newCode
    }, 201);
 });

// Sys Codes All / Category (?category=CURRENCY) 
sysCodeRoutes.get("/", authMiddleware, async (c) => {
    const category = c.req.query("category");
    const codes = await sysCodeService.getSysCodes(category);

    return c.json({ 
        success: true, 
        data: codes 
    });
});

// Sys Code By ID
sysCodeRoutes.get("/:id", authMiddleware, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    } 
            
    const sysCode = await sysCodeService.getSysCodeById(Number(id));
    
    return c.json({ 
        success: true, 
        data: sysCode 
    });
});

// Update Sys Code 
sysCodeRoutes.put("/:id", authMiddleware, canEditConfig, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);  
    }

    const body = await c.req.json();
    const validation = updateSysCodeSchema.safeParse(body);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await sysCodeService.updateExistingSysCode(Number(id), validation.data, userId);
        
    return c.json({ 
        success: true, 
        message: "ແກ້ໄຂ Sys Code ສຳເລັດ", 
        data: updated 
    });
});

// Soft Delete Sys Code 
sysCodeRoutes.patch("/:id/disable", authMiddleware, canEditConfig, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }
    
    const { userId } = c.get("user");
    await sysCodeService.softdeleteSysCode(Number(id), userId);
        
    return c.json({ 
        success: true, 
        message: "ປິດການໃຊ້ງານ Sys Code ສຳເລັດ" 
    });
});

// Restore Sys Code
sysCodeRoutes.patch("/:id/enable", authMiddleware, canEditConfig, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await sysCodeService.restoreSysCode(Number(id), userId);
        
    return c.json({ 
        success: true, 
        message: "ເປີດການໃຊ້ງານ Sys Code ສຳເລັດ" 
    });
});


export default sysCodeRoutes;

