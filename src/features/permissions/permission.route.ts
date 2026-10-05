import { Hono } from "hono";
import { 
    createPermissionSchema, 
    updatePermissionSchema 
} from "./permission.schema.js";
import * as permissionService from "./permission.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const permissionRoutes = new Hono<{ Variables: Variables }>();
const canManageUsers = requirePermission("USER_MANAGE");

// Create New Permission
permissionRoutes.post("/", authMiddleware,canManageUsers, async (c) => {
    const body = await c.req.json();
    const validation =  createPermissionSchema.safeParse(body);

    if(!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        },400);
    }
    
    const { userId } = c.get("user");
    const newPermission = await permissionService.createNewPermission(validation.data, userId);

    return c.json({
        success: true,
        message: "ສ້າງສິດການໃຊ້ສຳເລັດ",
        data: newPermission
    },201);
});

// Get All Permission 
permissionRoutes.get("/", authMiddleware, canManageUsers, async (c) => {
    const permissions = await permissionService.getAllPermissions();
    return c.json({
        success: true,
        message: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານສຳເລັດ",
        data: permissions
    }, 200);
});

// Permission By Id     
permissionRoutes.get("/:id", authMiddleware, canManageUsers, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    } 
       
    const permission = await permissionService.getPermissionById(Number(id));

    return c.json({
        success: true,
        data: permission
    }, 200);
});

// Update Permission
permissionRoutes.put("/:id", authMiddleware, canManageUsers, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const body = await c.req.json();
    const validation = updatePermissionSchema.safeParse(body);

    if (!validation.success) {
        return c.json(
            {
                success: false,
                message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
                errors: validation.error.issues
            },400);
        }

        const { userId } = c.get("user")
        const updatedPermission = await permissionService.updatePermission(Number(id), validation.data, userId);
        
        return c.json({
            success: true,
            message: "ແກ້ໄຂສິດການໃຊ້ສຳເລັດ",
            data: updatedPermission
        }, 200);
    });

// Soft Delete Permission
permissionRoutes.patch("/:id/disable", authMiddleware, canManageUsers, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user")
    await permissionService.softDeletePermission(Number(id), userId);

    return c.json({
        success: true,
        message: "ປິດການໃຊ້ງານ Permission ສຳເລັດ"
    }, 200);
});

// Restore Permission
permissionRoutes.patch("/:id/enable", authMiddleware, canManageUsers, async (c) => {
    const id = c.req.param("id"); 

    if (!id) { 
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const { userId } = c.get("user")
    await permissionService.restorePermission(Number(id), userId);

    return c.json({
        success: true,
        message: "ເປີດການໃຊ້ Permission ສຳເລັດ"
    }, 200);
});

export default permissionRoutes;