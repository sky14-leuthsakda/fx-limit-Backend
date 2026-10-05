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

// Create Transaction (upsert customer + insert fx_daily)
fxTransactionRoutes.post("/", authMiddleware, canEnterFx, async (c) => {
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

// Get All Transactions (ປະຫວັດທັງໝົດ — ລະວັງ: ບໍ່ paginate, ໃຊ້ສະເພາະ admin)
fxTransactionRoutes.get("/", authMiddleware, canViewFx, async (c) => {
    const transactions = await fxTransactionService.getAllTransactions();

    return c.json({ 
        success: true, 
        data: transactions 
    });
});

// Get Transactions Paginated
fxTransactionRoutes.get("/paginated", authMiddleware, canViewFx, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await fxTransactionService.getTransactionsPaginated(page, limit);

    return c.json({
        success: true,
        data: result.transactions,
        pagination: result.pagination,
    });
});

// Get Transaction By Id
fxTransactionRoutes.get("/:id", authMiddleware, canViewFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const txn = await fxTransactionService.getTransactionById(Number(id));
    
    return c.json({ 
        success: true, 
        data: txn 
    });
});

// Update Transaction
fxTransactionRoutes.put("/:id", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
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
        Number(id),
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
fxTransactionRoutes.patch("/:id/disable", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await fxTransactionService.softDeleteTransaction(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ລຶບທຸລະກຳສຳເລັດ" 
    });
});

// Restore Transaction
fxTransactionRoutes.patch("/:id/enable", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await fxTransactionService.restoreTransaction(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ກູ້ຄືນທຸລະກຳສຳເລັດ" 
    });
});

export default fxTransactionRoutes;