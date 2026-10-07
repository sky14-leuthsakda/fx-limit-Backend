import { z } from "zod";

const dateStringSchema = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ວັນທີຕ້ອງເປັນຮູບແບບ YYYY-MM-DD");

export const createFxTransactionSchema = z.object({
  // ---- Customer Identity ----
    idTypeId: z.number().int().positive("ກະລຸນາເລືອກປະເພດເອກະສານ"),
    idCode: z
        .string()
        .trim()
        .min(1, "ກະລຸນາປ້ອນເລກທີເອກະສານ")
        .max(50, "ເລກທີເອກະສານຍາວເກີນ 50 ຕົວອັກສອນ"),
    isForeigner: z.boolean(),
    firstNameEn: z.string().trim().max(100).optional(),
    lastNameEn: z.string().trim().max(100).optional(),
    firstNameLo: z.string().trim().max(100).optional(),
    lastNameLo: z.string().trim().max(100).optional(),
    dateOfBirth: dateStringSchema.optional(),
    genderId: z.number().int().positive().optional(),
    phoneNumber: z.string().trim().max(20).optional(),
    address: z.string().trim().max(1000).optional(),

  // ---- Transaction Details ----
    productId: z.number().int().positive("ກະລຸນາເລືອກປະເພດທຸລະກຳ (BUY/SELL)"),
    currencyId: z.number().int().positive("ກະລຸນາເລືອກສະກຸນເງິນ"),
    amountForeign: z
        .number()
        .positive("ຈຳນວນເງິນຕ້ອງຫຼາຍກວ່າ 0")
        .max(999999999999999.99, "ຈຳນວນເງິນຍາວເກີນໄປ"),
    branchId: z.number().int().positive("ກະລຸນາເລືອກສາຂາ"),
    unitId: z.number().int().positive().optional(),
});

export const updateFxTransactionSchema = z.object({
    productId: z.number().int().positive().optional(),
    currencyId: z.number().int().positive().optional(),
    amountForeign: z.number()
        .positive("ຈຳນວນເງິນຕ້ອງຫຼາຍກວ່າ 0")
        .max(999999999999999.99, "ຈຳນວນເງິນຍາວເກີນໄປ")
        .optional(),
    branchId: z.number().int().positive().optional(),
    unitId: z.number().int().positive().optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export type CreateFxTransactionInput = z.infer<typeof createFxTransactionSchema>;
export type UpdateFxTransactionInput = z.infer<typeof updateFxTransactionSchema>;