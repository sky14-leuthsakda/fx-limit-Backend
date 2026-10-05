import { z } from "zod";

const dateStringSchema = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ວັນທີຕ້ອງເປັນຮູບແບບ YYYY-MM-DD");

// ============================ Create FX Transaction ============================
// Body ນີ້ປະສົມ "ຂໍ້ມູນລູກຄ້າ" + "ຂໍ້ມູນທຸລະກຳ" ເຂົ້ານຳກັນ (approach B):
// service ຈະ upsert customer ກ່ອນ (ຫາເກົ່າດ້ວຍ idTypeId+idCode, ຖ້າບໍ່ມີຈຶ່ງສ້າງໃໝ່)
// ແລ້ວຈຶ່ງ insert ແຖວ fx_daily ໂດຍໃຊ້ customer_id ທີ່ໄດ້

export const createFxTransactionSchema = z
    .object({
        // ---- Customer identity ----
        idTypeId: z.number().int().positive("ກະລຸນາເລືອກປະເພດເອກະສານ"),
        idCode: z.string().trim()
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

        // ---- Transaction detail ----
        productId: z.number().int().positive("ກະລຸນາເລືອກປະເພດທຸລະກຳ (BUY/SELL)"),
        currencyId: z.number().int().positive("ກະລຸນາເລືອກສະກຸນເງິນ"),
        amountForeign: z.number()
            .positive("ຈຳນວນເງິນຕ້ອງຫຼາຍກວ່າ 0")
            .max(999999999999999.99, "ຈຳນວນເງິນຍາວເກີນໄປ"),
        branchId: z.number().int().positive("ກະລຸນາເລືອກສາຂາ"),
        unitId: z.number().int().positive().optional(),
    })
    // ກົດດຽວກັນກັບ customer.schema.ts: ຊື່ EN/LO ບັງຄັບຕາມ isForeigner
    .superRefine((data, ctx) => {
        if (data.isForeigner) {
            if (!data.firstNameEn) {
                ctx.addIssue({
                    code: "custom",
                    path: ["firstNameEn"],
                    message: "ກະລຸນາປ້ອນຊື່ພາສາອັງກິດ (ສຳລັບລູກຄ້າຕ່າງປະເທດ)",
                });
            }
            if (!data.lastNameEn) {
                ctx.addIssue({
                    code: "custom",
                    path: ["lastNameEn"],
                    message: "ກະລຸນາປ້ອນນາມສະກຸນພາສາອັງກິດ (ສຳລັບລູກຄ້າຕ່າງປະເທດ)",
                });
            }
        } else {
            if (!data.firstNameLo) {
                ctx.addIssue({
                    code: "custom",
                    path: ["firstNameLo"],
                    message: "ກະລຸນາປ້ອນຊື່ພາສາລາວ",
                });
            }
            if (!data.lastNameLo) {
                ctx.addIssue({
                    code: "custom",
                    path: ["lastNameLo"],
                    message: "ກະລຸນາປ້ອນນາມສະກຸນພາສາລາວ",
                });
            }
        }
    });

// ============================ Update FX Transaction ============================
// ອີງ requirement: permission FX_EDIT ແຍກຕ່າງຫາກຈາກ FX_ENTRY ແປວ່າອະນຸຍາດໃຫ້ແກ້ໄດ້
// ແກ້ໄດ້ສະເພາະຂໍ້ມູນທຸລະກຳ (ບໍ່ແກ້ customer ຜ່ານທາງນີ້ — ແກ້ customer ແຍກຜ່ານ /customers/:id)
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