import { Hono } from "hono";
import {
  createFxTransactionSchema,
  updateFxTransactionSchema,
} from "./fx-transaction.schema.js";
import * as fxTransactionService from "./fx-transaction.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const fxTransactionRoutes = new Hono<{ Variables: Variables }>();
const canEnterFx = requirePermission("FX_ENTRY");
const canViewFx = requirePermission("FX_VIEW");
const canEditFx = requirePermission("FX_EDIT");

// Apply authMiddleware globally for all Fx-Transaction routes
fxTransactionRoutes.use("*", authMiddleware);

// Create Transaction (upsert customer + insert fx_daily)
fxTransactionRoutes.post("/", canEnterFx, async (c) => {
    const body = await c.req.json();
    const validation = createFxTransactionSchema.safeParse(body);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const newTxn = await fxTransactionService.createNewTransaction(validation.data, userId);

    return c.json({ 
        success: true, 
        message: "ບັນທຶກທຸລະກຳສຳເລັດ", 
        data: newTxn 
    }, 201);
});

// Transactions All
fxTransactionRoutes.get("/", canViewFx, async (c) => {
    const transactions = await fxTransactionService.getAllTransactions();

    return c.json({ 
        success: true, 
        data: transactions 
    });
});

// Transactions Paginated
fxTransactionRoutes.get("/paginated", canViewFx, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await fxTransactionService.getTransactionsPaginated(page, limit);

    return c.json({
        success: true,
        data: result.transactions,
        pagination: result.pagination,
    });
});

// Transaction By Id
fxTransactionRoutes.get("/:id", canViewFx, async (c) => {
    const id = Number(c.req.param("id"));

    if (!id || isNaN(id)) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const txn = await fxTransactionService.getTransactionById(id);
    
    return c.json({ 
        success: true, 
        data: txn 
    });
});

// Update Transaction
fxTransactionRoutes.put("/:id", canEditFx, async (c) => {
    const id = Number(c.req.param("id"));

    if (!id || isNaN(id)) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateFxTransactionSchema.safeParse(body);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await fxTransactionService.updateExistingTransaction(
        id,
        validation.data,
        userId
    );

    return c.json({
        success: true,
        message: "ແກ້ໄຂທຸລະກຳສຳເລັດ",
        data: updated,
    });
});

// Soft Delete Transaction
fxTransactionRoutes.patch("/:id/disable", canEditFx, async (c) => {
    const id = Number(c.req.param("id"));

    if (!id || isNaN(id)) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await fxTransactionService.softDeleteTransaction(id, userId);

    return c.json({ 
        success: true, 
        message: "ລຶບທຸລະກຳສຳເລັດ" 
    });
});

// Restore Transaction
fxTransactionRoutes.patch("/:id/enable", canEditFx, async (c) => {
    const id = Number(c.req.param("id"));

    if (!id || isNaN(id)) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await fxTransactionService.restoreTransaction(id, userId);

    return c.json({ 
        success: true, 
        message: "ກູ້ຄືນທຸລະກຳສຳເລັດ" 
    });
});

export default fxTransactionRoutes;