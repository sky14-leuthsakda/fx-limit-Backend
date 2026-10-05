import { z } from "zod";

export const createBranchSchema = z.object({
    branchCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນລະຫັດສາຂາ")
        .max(20, "ລະຫັດສາຂາຍາວເກີນ 20 ຕົວອັກສອນ"),
    branchNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ສາຂາ (ອັງກິດ)")
        .max(150, "ຊື່ສາຂາ (ອັງກິດ) ຍາວເກີນ 150 ຕົວອັກສອນ"),
    branchNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ສາຂາ (ລາວ)")
        .max(150, "ຊື່ສາຂາ (ລາວ) ຍາວເກີນ 150 ຕົວອັກສອນ"),
});

export const updateBranchSchema = z.object({
    branchCode: z.string().trim()
        .min(1, "ລະຫັດສາຂາຕ້ອງບໍ່ວ່າງ")
        .max(20, "ລະຫັດສາຂາຍາວເກີນ 20 ຕົວອັກສອນ")
        .optional(),
    branchNameEn: z.string().trim()
        .min(1, "ຊື່ສາຂາ (ອັງກິດ) ຕ້ອງບໍ່ວ່າງເປົ່າ")
        .max(150, "ຊື່ສາຂາ (ອັງກິດ) ຍາວເກີນ 150 ຕົວອັກສອນ")
        .optional(),
    branchNameLo: z.string().trim()
        .min(1, "ຊື່ສາຂາ (ລາວ) ຕ້ອງບໍ່ວ່າງເປົ່າ")
        .max(150, "ຊື່ສາຂາ (ລາວ) ຍາວເກີນ 150 ຕົວອັກສອນ")
        .optional(),
    isActive: z.boolean().optional(),
});

export const createUnitSchema = z.object({
    branchId: z.number().int().positive("ກະລຸນາເລືອກສາຂາ"),
    unitCode: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນລະຫັດຫນ່ວຍບໍລິການ")
        .max(20, "ລະຫັດຫນ່ວຍບໍລິການຍາວເກີນ 20 ຕົວອັກສອນ"),
    unitNameEn: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ຫນ່ວຍບໍລິການ (ອັງກິດ)")
        .max(150, "ຊື່ຫນ່ວຍບໍລິການ (ອັງກິດ) ຍາວເກີນ 150 ຕົວອັກສອນ"),
    unitNameLo: z.string().trim()
        .min(1, "ກະລຸນາປ້ອນຊື່ຫນ່ວຍບໍລິການ (ລາວ)")
        .max(150, "ຊື່ຫນ່ວຍບໍລິການ (ລາວ) ຍາວເກີນ 150 ຕົວອັກສອນ"),
});

export const updateUnitSchema = z.object({
    branchId: z.number().int().positive().optional(),
    unitCode: z.string().trim()
        .min(1, "ລະຫັກຫນ່ວຍບໍລິການຕ້ອງບໍ່ວ່າງເປົ່າ")
        .max(20, "ລະຫັດຫນ່ວຍບໍລິການຍາວເກີນ 20 ຕົວອັກສອນ")
        .optional(),
    unitNameEn: z.string().trim()
        .min(1, "ຊື່ຫນ່ວຍບໍລິການ (ອັງກິດ) ຕ້ອງບໍ່ວ່າງເປົ່າ")
        .max(150, "ຊື່ຫນ່ວຍບໍລິການ (ອັງກິດ) ຍາວເກີນ 150 ຕົວອັກສອນ")
        .optional(),
    unitNameLo: z.string().trim()
        .min(1, "ຊື່ຫນ່ວຍບໍລິການ (ລາວ) ຕ້ອງບໍ່ວ່າງເປົ່າ")
        .max(150, "ຊື່ຫນ່ວຍບໍລິການ (ລາວ) ຍາວເກີນ 150 ຕົວອັກສອນ")
        .optional(),
    isActive: z.boolean().optional(),
})


export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
