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

permissionRoutes.use('*', authMiddleware, canManageUsers);

// Create New Permission
permissionRoutes.post("/", async (c) => {
    const body = await c.req.json();
    const validation =  createPermissionSchema.safeParse(body);

    if(!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
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
permissionRoutes.get("/", async (c) => {
    const permissions = await permissionService.getAllPermissions();
    return c.json({
        success: true,
        message: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານທັງຫມົດສຳເລັດ",
        data: permissions
    }, 200);
});

// Get Deleted Permissions (Trash Bin)
permissionRoutes.get("/deleted", async (c) => {
    const deletedPermissions = await permissionService.getDeletedPermissions();
    return c.json({ 
        success: true,
        message: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານທີ່ຖືກລົບສຳເລັດ", 
        data: deletedPermissions 
    });
});

// Permission By Id     
permissionRoutes.get("/:id", async (c) => {
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
        message: "ດຶງຂໍ້ມູນສິດການໃຊ້ງານສຳເລັດ",
        data: permission
    }, 200);
});

// Update Permission
permissionRoutes.put("/:id", async (c) => {
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
            message: "ແກ້ໄຂສິດການໃຊ້ງານສຳເລັດ",
            data: updatedPermission
        }, 200);
    });

// Soft Delete Permission
permissionRoutes.patch("/:id/disable", async (c) => {
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
        message: "ປິດການໃຊ້ງານສີດການໃຊ້ງານສຳເລັດ"
    }, 200);
});

// Restore Permission
permissionRoutes.patch("/:id/enable", async (c) => {
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
        message: "ເປີດການໃຊ້ງານສິດການໃຊ້ງານສຳເລັດ"
    }, 200);
});

export default permissionRoutes;