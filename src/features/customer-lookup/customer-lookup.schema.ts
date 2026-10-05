import { z }  from "zod";

export const searchCustomerSchema = z.object({
    keyword: z.string().min(1, "ກະລຸນາປ້ອນຄຳຄົ້ນຫາ"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
});