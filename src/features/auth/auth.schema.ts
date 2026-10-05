import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
  password: z.string().min(1, "ກະລຸນາປ້ອນລະຫັດຜ່ານ"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "ກະລຸນາປ້ອນລະຫັດຜ່ານເກົ່າ"),
  newPassword: z.string()
    .min(6, "ລະຫັດຜ່ານໃຫມ່ຢ່າງຫນ້ອຍ 6 ຕົວອັກສອນ")
    .max(72, "ລະຫັກຜ່ານຍາວເກີນໄປ"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "ລະຫັດຜ່ານໃຫມ່ຢ່າງຫນ້ອຍ 6 ຕົວອັກສອນ")
    .max(72, "ລະຫັກຜ່ານຍາວເກີນໄປ"),
})

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;