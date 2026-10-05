import { Hono } from "hono";
import { createTransactionSchema } from "./fx-transaction.schema.js";
import * as fxService from "./fx-transaction.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const fxRoutes = new Hono<{ Variables: Variables}>();

fxRoutes.post("/", authMiddleware, async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    const validation = createTransactionSchema.safeParse(body);

    if(!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues
        }, 400);
    }

    const newTxn = await fxService.createNewTransaction(validation.data, user.userId, 1);

    return c.json({
        success: true,
        message: "ບັນທຶກທຸລະກຳສຳເລັດ",
        data:  newTxn
    }, 201);
});

export default fxRoutes;