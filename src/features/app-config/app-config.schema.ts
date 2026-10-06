import { z } from "zod";

const configKeySchema = z.string().trim()
    .min(1, "ກະລຸນາປ້ອນ Config Key")
    .max(100, "Config Key ຍາວເກີນ 100 ຕົວອັກສອນ")
    .regex(/^[A-Z][A-Z0-9_]*$/, "Config Key ຕ້ອງເປັນໂຕພິມໃຫຍ່ ແລະ _ ເທົ່ານັ້ນ (ເຊັ່ນ MONTHLY_LIMIT_USD)");

export const createAppConfigSchema = z.object({
    configKey: configKeySchema,
    configValue: z.string().trim().min(1, "ກະລຸນາປ້ອນຄ່າ Config"),
    description: z.string().trim().max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
});

export const updateAppConfigSchema = z.object({
    configValue: z.string().trim().min(1, "ກະລຸນາປ້ອນຄ່າ Config").optional(),
    description: z.string().trim()
        .max(255, "ລາຍລະອຽດຍາວເກີນ 255 ຕົວອັກສອນ").optional(),
    isActive: z.number().int().min(0).max(1).optional(),
});

export type CreateAppConfigInput = z.infer<typeof createAppConfigSchema>;
export type UpdateAppConfigInput = z.infer<typeof updateAppConfigSchema>;