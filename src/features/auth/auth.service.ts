import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { 
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput 
} from "./auth.schema.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

   if (!secret) {
    console.error("CRITICAL: JWT_SECRET is not defined in environment variables");
    
    throw new AppError("ເກີດຂໍ້ຜິດພາດທາງດ້ານ Server config", 500);
    }

    return secret;
}

// =========================== Login ===========================

export const loginUser = async (input: LoginInput) => {
  const user = await authRepository.findUserByUsername(input.username);

  if (!user) {
    throw new AppError("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", 401);
  }

  if (!user.is_active) {
    throw new AppError("ບັນຊີຜູ້ໃຊ້ນີ້ຖືກປິດການໃຊ້ງານ", 403);
  }

  const { roles, permissions } = await authRepository.findUserRolesAndPermissions(
    user.user_id
  );

  const token = jwt.sign(
    {
      userId: user.user_id,
      username: user.username,
      roles,
      permissions,
    },
    getJwtSecret(),
    { expiresIn: "8h" }
  );

return {
  token,
  user: {
    userId: user.user_id,
    username: user.username,
    firstNameEn: user.first_name_en,
    lastNameEn: user.last_name_en,
    firstNameLo: user.first_name_lo,
    lastNameLo: user.last_name_lo,
    branchId: user.branch_id,
    unitId: user.unit_id,
    roles,
    permissions,
    },
  };
};

// ============================= Logout ===============================

export const logoutUser = async (_userId: number) => {
  return { message: "ອອກຈາກລະບົບສຳເລັດ" };
};

// ============================= Password ==============================

export const changePassword = async (
  userId: number,
  data: ChangePasswordInput
) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new AppError(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${userId}`, 404);
  }

  const isOldPasswordValid = await bcrypt.compare(
    data.oldPassword,
    user.password_hash
  );

  if (!isOldPasswordValid) {
    throw new AppError("ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ", 401);
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
  await authRepository.updatePassword(userId, newPasswordHash);

  return { message: "ປ່ຽນລະຫັດຜ່ານສຳເລັດ" };
}

export const resetPassword = async (
  targetUserId: number,
  data: ResetPasswordInput
) => {
  const user = await authRepository.findUserById(targetUserId);

  if (!user) {
    throw new AppError(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${targetUserId}`, 404);
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
  await authRepository.updatePassword(targetUserId, newPasswordHash);

  return { message: "ຣີເຊັດລະຫັດຜ່ານສຳເລັດ" };
}