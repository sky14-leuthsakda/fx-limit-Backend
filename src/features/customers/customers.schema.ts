import { z } from "zod";

const dateStringSchema = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ວັນທີຕ້ອງເປັນຮູບແບບ YYYY-MM-DD");

export const createCustomerSchema = z.object({
    idTypeId: z.number()
        .int()
        .positive("ກະລຸນາເລືອກປະເພດເອກະສານ"),
    idCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນເລກທີເອກະສານ")
        .max(50, "ເລກທີເອກະສານຍາວເກີນ 50 ຕົວອັກສອນ"),
    isForeigner: z.boolean(),
    firstNameEn: z.string().trim()
        .max(100, "ຊື່ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    lastNameEn: z.string().trim()
        .max(100, "ນາມສະກຸນ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    firstNameLo: z.string().trim()
        .max(100, "ຊື່ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    lastNameLo: z.string().trim()
        .max(100, "ນາມສະກຸນ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    dateOfBirth: dateStringSchema.optional(),
    genderId: z.number().int().positive().optional(),
    phoneNumber: z.string().trim()
        .max(20, "ເບີໂທຍາວເກີນ 20 ຕົວອັກສອນ").optional(),
    address: z.string().trim().max(1000, "ທີ່ຢູ່ຍາວເກີນ 1000 ຕົວອັກສອນ").optional(),
});
    

export const updateCustomerSchema = z.object({
    idTypeId: z.number().int().positive().optional(),
    idCode: z.string().trim()
        .min(1, "ເລກທີເອກະສານຕ້ອງບໍ່ຫວ່າງເປົ່າ")
        .max(50, "ເລກທີເອກະສານຍາວເກີນ 50 ຕົວອັກສອນ")
        .optional(),    
    isForeigner: z.boolean().optional(),
    
    firstNameEn: z.string().trim()
        .max(100, "ຊື່ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ")
        .optional(),
    lastNameEn: z.string().trim()
        .max(100, "ນາມສະກຸນ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ")
        .optional(),
    firstNameLo: z.string().trim()
        .max(100, "ຊື່ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ")
        .optional(),
    lastNameLo: z.string().trim()
        .max(100, "ນາມສະກຸນ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ")
        .optional(),

    dateOfBirth: dateStringSchema.optional(),
    genderId: z.number().int().positive().nullable().optional(),
    phoneNumber: z.string().trim()
        .max(20, "ເບີໂທຍາວເກີນ 20 ຕົວອັກສອນ").optional(),
    address: z.string().trim()
        .max(1000, "ທີ່ຢູ່ຍາວເກີນ 1000 ຕົວອັກສອນ").optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export const findCustomerByIdCodeSchema = z.object({
    idTypeId: z.coerce.number().int().positive("ກະລຸນາເລືອກປະເພດເອກະສານ"),
    idCode: z.string().trim().min(1, "ກະລຸນາປ້ອນເລກທີເອກະສານ"),
});

export const searchCustomerByNameSchema = z.object({
    name: z.string().trim().min(1, "ກະລຸນາປ້ອນຊື່ທີ່ຕ້ອງການຄົ້ນຫາ"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type FindCustomerByIdCodeInput = z.infer<typeof findCustomerByIdCodeSchema>;
export type SearchCustomerByNameInput = z.infer<typeof searchCustomerByNameSchema>;