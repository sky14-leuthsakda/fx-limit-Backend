
import { z } from "zod";

export const createRoleSchema = z.object({
    roleCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Role Code")
        .max(50, "Role Code ຍາວເກີນ 50 ຕົວອັກສອນ"),
    roleNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Role ພາສາອັງກິດ")
        .max(100, "ຊື່ Role (EN) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    roleNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Role ພາສາລາວ")
        .max(100, "ຊື່ Role (LO) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    description: z.string().trim()
        .max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
});

export const updateRoleSchema = z.object({
    roleCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Role Code")
        .max(50, "Role Code ຍາວເກີນ 50 ຕົວອັກສອນ").optional(),
    roleNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Role ພາສາອັງກິດ")
        .max(100, "ຊື່ Role (EN) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    roleNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Role ພາສາລາວ")
        .max(100, "ຊື່ Role (LO) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    description: z.string().trim()
        .max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export const assignPermissionSchema = z.object({
    permissionId: z.number().int().positive("Permission ID ບໍ່ຖືກຕ້ອງ"),
});



export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;