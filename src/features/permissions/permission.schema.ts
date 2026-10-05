import { z } from 'zod';

export const createPermissionSchema = z.object({
    permissionCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Permission Code")
        .max(50, "Permission Code ຍາວເກີນ 50 ຕົວອັກສອນ"),
    permissionNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Permission ພາສາອັງກິດ")
        .max(100, "ຊື່ Permission (EN) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    permissionNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Permission ພາສາລາວ")
        .max(100, "ຊື່ Permission (LO) ຍາວເກີນ 100 ຕົວອັກສອນ"),
    description: z.string().trim()
        .max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
});

export const updatePermissionSchema = z.object({
    permissionCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນ Permission Code")
        .max(50, "Permission Code ຍາວເກີນ 50 ຕົວອັກສອນ").optional(),
    permissionNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Permission ພາສາອັງກິດ")
        .max(100, "ຊື່ Permission (EN) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    permissionNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ Permission ພາສາລາວ")
        .max(100, "ຊື່ Permission (LO) ຍາວເກີນ 100 ຕົວອັກສອນ").optional(),
    description: z.string().trim()
        .max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;