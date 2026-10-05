import { z } from "zod";

const dateStringSchema = z.string().trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ວັນທີຕ້ອງເປັນຮູບແບບ YYYY-MM-DD");

export const createRateSchema = z.object({
    rateDate: dateStringSchema,
    currencyId: z.number().int().positive("ກະລຸນາເລືອກສະກຸນເງິນ"),
    rate: z.number()
        .positive("ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0")
        .max(999999999999.999999, "ອັດຕາແລກປ່ຽນຍາວເກີນໄປ"),
});

export const updateRateSchema = z.object({
    rateDate: dateStringSchema.optional(),
    currencyId: z.number().int().positive().optional(),
    rate: z.number()
        .positive("ອັດຕາແລກປ່ຽນຕ້ອງຫຼາຍກວ່າ 0")
        .max(999999999999.999999, "ອັດຕາແລກປ່ຽນຍາວເກີນໄປ")
        .optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export type CreateRateInput = z.infer<typeof createRateSchema>;
export type UpdateRateInput = z.infer<typeof updateRateSchema>;