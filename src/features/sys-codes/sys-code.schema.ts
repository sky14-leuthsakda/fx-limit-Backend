import { z } from "zod";

export const createSysCodeSchema = z.object({
    category: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Category")
        .max(30, "Category ຍາວເກີນ 30 ຕົວອັກສອນ"),
    code: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Code")
        .max(30, "Code ຍາວເກີນ 30 ຕົວອັກສອນ"),
    nameEn: z.string().trim()
        .min(1,"ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ")
        .max(100, "ຊື່ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    nameLo: z.string().trim()
        .min(1,"ກະລຸນາປ້ອນຊື່ພາສາລາວ")
        .max(100, "ຊື່ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    codeOrder: z.number().int().min(0).optional(),
});

export const updateSysCodeSchema = z.object({
    category: z.string().trim().min(1).max(30).optional(),
    code: z.string().trim().min(1).max(30).optional(),
    nameEn: z.string().trim().min(1).max(100).optional(),
    nameLo: z.string().trim().min(1).max(100).optional(),
    codeOrder: z.number().int().min(0).optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export type CreateSysCodeInput = z.infer<typeof createSysCodeSchema>;
export type UpdateSysCodeInput = z.infer<typeof updateSysCodeSchema>;