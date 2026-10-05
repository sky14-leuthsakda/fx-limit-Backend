import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().trim()
        .min(3, "ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ")
        .max(50, "ຊື່ຜູ້ໃຊ້ຍາວເກີນ 50 ຕົວອັກສອນ"),
    password: z.string()
        .min(6, "ລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ")
        .max(72, "ລະຫັດຜ່ານຍາວເກີນໄປ"),
    firstNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ")
        .max(100, "ຊື່ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    lastNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນນາມສະກຸນພາສາອັງກິດ")
        .max(100, "ນາມສະກຸນ (EN) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    firstNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ພາສາລາວ")
        .max(100, "ຊື່ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    lastNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນນາມສະກຸນພາສາລາວ")
        .max(100, "ນາມສະກຸນ (LO) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    branchId: z.number().int().positive("ກະລຸນາເລືອກສາຂາ"),
    unitId: z.number().int().positive().optional(),
});

export const updateUserSchema = z.object({
    firstNameEn: z.string().trim().min(1).max(100).optional(),
    lastNameEn: z.string().trim().min(1).max(100).optional(),
    firstNameLo: z.string().trim().min(1).max(100).optional(),
    lastNameLo: z.string().trim().min(1).max(100).optional(),
    branchId: z.number().int().positive().optional(),
    unitId: z.number().int().positive().optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export const assignRoleSchema = z.object({
    roleId: z.number().int().positive("Role ID ບໍ່ຖືກຕ້ອງ"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;