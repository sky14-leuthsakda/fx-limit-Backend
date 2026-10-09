import { z } from "zod";

const dateSchema = z.string().trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ວັນທີຕ້ອງເປັນຮູບແບບ YYYY-MM-DD");

const actionTypeSchema = z.enum(["CREATE", "UPDATE", "DELETE"], {
    message: "ປະເພດການກະທຳຕ້ອງເປັນ CREATE, UPDATE ຫຼື DELETE",
});

const baseLogQuerySchema = z.object({
    dateFrom: dateSchema.optional(),
    dateTo: dateSchema.optional(),
    userId: z.coerce.number()
        .int()
        .positive("User ID ບໍ່ຖືກຕ້ອງ")
        .optional(),
    actionType: actionTypeSchema.optional(),
    page: z.coerce.number()
        .int()
        .min(1, "ໜ້າຕ້ອງເລີ່ມແຕ່ 1")
        .default(1),
    limit: z.coerce.number()
        .int()
        .min(1, "ຈຳນວນຕໍ່ໜ້າຕ້ອງຢ່າງໜ້ອຍ 1")
        .max(100, "ຈຳນວນຕໍ່ໜ້າສູງສຸດ 100")
        .default(20),
});

export const appConfigLogQuerySchema = baseLogQuerySchema.extend({
    configKey: z.string().trim()
        .min(1)
        .max(100, "Config Key ຍາວເກີນ 100 ຕົວອັກສອນ")
        .optional(),
});

export const fxDailyLogQuerySchema = baseLogQuerySchema.extend({
    txnId: z.coerce.number()
        .int()
        .positive("Transaction ID ບໍ່ຖືກຕ້ອງ")
        .optional(),
});

export type AppConfigLogQueryInput = z.infer<typeof appConfigLogQuerySchema>;
export type FxDailyLogQueryInput = z.infer<typeof fxDailyLogQuerySchema>;