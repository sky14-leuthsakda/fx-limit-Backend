import { z } from "zod";

export const createConfigSchema = z.object({
    configKey: z.string().min(1, "ກະລຸນາປ້ອນ Key"),
    configValue: z.string().min(1, "ກະລຸນາປ້ອນຄ່າ"),
    description: z.string().optional(),
});

export const updateConfigSchema = z.object({
    configValue: z.string().min(1, "ກະລຸນາປ້ອນຄ່າ"),
});

export type CreateConfigInput = z.infer<typeof createConfigSchema>;
export type UpdateConfigInput = z.infer<typeof updateConfigSchema>;
