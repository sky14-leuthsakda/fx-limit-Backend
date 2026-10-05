import { Hono } from "hono";
import {
    createBranchSchema,
    updateBranchSchema,
    createUnitSchema,
    updateUnitSchema
} 
from "./organization.schema.js";
import * as orgService from "./organization.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const orgRoutes = new Hono<{ Variables: Variables }>();
const canManageUser = requirePermission("USER_MANAGE");

// =========================== Branches ================================

// Create Branch
orgRoutes.post("/branches", authMiddleware, canManageUser, async (c) => {
    const body = await c.req.json();
    const validation = createBranchSchema.safeParse(body);

    if (!validation.success) {
    return c.json({ 
        success: false, 
        message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
        errors: validation.error.issues }, 400);
    }

    const { userId } = c.get("user");
    const newBranch = await orgService.createNewBranch(validation.data, userId);

    return c.json({ 
        success: true, 
        message: "ສ້າງສາຂາສຳເລັດ", 
        data: newBranch 
    }, 201);
});

// Branch All
orgRoutes.get("/branches", authMiddleware, async (c) => {
    const branches = await orgService.getAllBranches();

    return c.json({ 
        success: true, 
        data: branches 
    });
});

// Branch Paginated
orgRoutes.get("/branches/paginated", authMiddleware, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await orgService.getPaginatedBranches(page, limit);
        return c.json({
            success: true,
            ...result
        });
    }
);

// Branch By Id
orgRoutes.get("/branches/:id", authMiddleware, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const branch = await orgService.getBranchById(Number(id));

    return c.json({
        success: true,
        data: branch
    });
});

// Update Branch
orgRoutes.put("/branches/:id", authMiddleware,canManageUser, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
        success: false, 
        message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateBranchSchema.safeParse(body);

    if (!validation.success) {

    return c.json({ 
        success: false, 
        message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
        errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await orgService.updateExistingBranch(Number(id), validation.data, userId);

    return c.json({ 
        success: true, 
        message: "ແກ້ໄຂສາຂາສຳເລັດ", 
        data: updated 
    });
});

// Soft Delete
orgRoutes.patch("/branches/:id/disable", authMiddleware, canManageUser, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({ 
        success: false,   
        message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await orgService.softDeleteBranch(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ປິດການໃຊ້ງານສາຂາສຳເລັດ" 
    });
});

// Restore Branch
orgRoutes.patch("/branches/:id/enable", authMiddleware, canManageUser, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const { userId } = c.get("user");
    await orgService.restoreBranch(Number(id), userId);

    return c.json({
        success: true,
        message: "ເປີດການໃຊ້ງານສາຂາສຳເລັດ"
    });
});

// ============================= Units ==================================

// Create Unit
orgRoutes.post("/units", authMiddleware, canManageUser, async (c) => {
    const body = await c.req.json();
    const validation = createUnitSchema.safeParse(body);
    
    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const newUnit = await orgService.createNewUnit(validation.data, userId);

    return c.json({ 
        success: true, 
        message: "ສ້າງໜ່ວຍບໍລິການສຳເລັດ", 
        data: newUnit 
    }, 201);
});

// Units All
orgRoutes.get("/units",authMiddleware, async (c) => {
    const units = await orgService.getAllUnits();
    return c.json({ 
        success: true, 
        data: units 
    });
});


// Units Pagination
orgRoutes.get("/units/paginated", authMiddleware, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await orgService.getPaginatedUnit(page, limit);
    
    return c.json({
        success: true,
        ...result
    });
});


// Branch By Units
orgRoutes.get("/branches/:branchId/units", authMiddleware,  async (c) => {
    const branchId = c.req.param("branchId");
    if (!branchId) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ Branch ID" 
        }, 400);
    } 
        
    const units = await orgService.getUnitsByBranch(Number(branchId));

    return c.json({ 
        success: true, 
        data: units 
    });
});


// Unit By Id
orgRoutes.get("/units/:id", authMiddleware, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const unit = await orgService.getUnitById(Number(id));

    return c.json({
        success: true,
        data: unit
    });
});


// Update Unit
orgRoutes.put("/units/:id", authMiddleware, canManageUser, async (c) => {
    const id = c.req.param("id");
    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID "
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateUnitSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await orgService.updateExistingUnit(Number(id), validation.data, userId);

    return c.json({
        success: true,
        message: "ແກ້ໄຂຫນ່ວຍບໍລິການສຳເລັດ",
        data: updated
    });
});


// Soft Delete Unit
orgRoutes.patch("/units/:id/disable", authMiddleware, canManageUser, async (c) => {
    const id = c.req.param("id");
    if (!id) {
            return c.json({ 
        success: false, 
        message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }
    
    const { userId } = c.get("user");
    await orgService.softDeleteUnit(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ປິດການໃຊ້ງານໜ່ວຍບໍລິການສຳເລັດ" 
    });
});


// Restore Unit
orgRoutes.patch("/units/:id/enable", authMiddleware, canManageUser, async (c) => {
    const id = c.req.param("id"); 
    if (!id) {
        return c.json({
            success: false,
            message: "ຕ້ອງລະບຸ ID"
        }, 400);
    }

    const { userId } = c.get("user");
    await orgService.restoreUnit(Number(id), userId);

    return c.json({
        success: true,
        message: "ເປີດການໃຊ້ງານຫນ່ວຍບໍລິການສຳເລັດ"
    });
})

export default orgRoutes;