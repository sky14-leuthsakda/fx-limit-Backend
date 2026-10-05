import bcrypt from "bcrypt";
import * as userRepository from "./user.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { 
    CreateUserInput, 
    UpdateUserInput 
} from "./user.schema.js";

// Create User
export const createNewUser = async (
    data: CreateUserInput, 
    createdBy: number
) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const userId = await userRepository.createUser(
        data.username,
        hashedPassword,
        data.firstNameEn,
        data.lastNameEn,
        data.firstNameLo,
        data.lastNameLo,
        data.branchId,
        data.unitId,
        createdBy
    );

    return {
        userId,
        username: data.username,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        firstNameLo: data.firstNameLo,
        lastNameLo: data.lastNameLo
    };
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError(`Username "${data.username}" ມີຢູ້ແລ້ວ`, 409);
        }
        throw err;
    }
};

// User All
export const getAllUsers = async () => {
    return userRepository.findUsersAll();
}

// User Paginated
export const getUsersPaginated = async (
    page: number, 
    limit: number
) => {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

    const { 
        users, 
        total_records 
    } = await userRepository.findUsersPaginated(safePage, safeLimit);

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        users,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records, totalPages
        },
    };
};

// User By ID 
export const getUserById = async (userId: number) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new AppError(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${userId}`, 404);
    }

    return user;
};

// Update User
export const updateExistingUser = async (
    userId: number, 
    data: UpdateUserInput, 
    updatedBy: number
) => {
    const existingUser = await getUserById(userId); 

    const affectedRows = await userRepository.updateUser(
        userId,
        data.firstNameEn ?? existingUser.first_name_en,
        data.lastNameEn ?? existingUser.last_name_en,
        data.firstNameLo ?? existingUser.first_name_lo,
        data.lastNameLo ?? existingUser.last_name_lo,
        data.branchId ?? existingUser.branch_id,
        data.unitId ?? existingUser.unit_id,
        data.isActive ?? existingUser.is_active,
        updatedBy
    );

    if (affectedRows === 0) {
        throw new AppError("ບໍ່ສາມາດແກ້ໄຂ User ໄດ້", 400);
    }

    return await userRepository.findUserById(userId);
};

// Soft Delete User
export const softDeleteUser = async (
    userId: number, 
    deletedBy: number
) => {
  const affectedRows = await userRepository.softDeleteUser(userId, deletedBy);

  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${userId}`, 404);
  }
};

// Restore User 
export const restoreUser = async (
    userId: number,
    updatedBy: number
) => {
  const affectedRows = await userRepository.restoreUser(userId, updatedBy);
  
  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບຜູ້ໃຊ້ ID: ${userId}`, 404);
  }
};

// ===================== User Roles ======================

// Assign Role To User
export const assignRole = async (
    userId: number,
    roleId: number,
    createdBy: number
) => {
    await getUserById(userId);

    try {
        await userRepository.assignUserRole(
            userId, 
            roleId, 
            createdBy
        );
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("User ນີ້ມີ Role ນີ້ແລ້ວ", 409);
        }
        if (err.errno === 1452) {
            throw new AppError(`ບໍ່ພົບ Role ID: ${roleId}`, 404);
        }
        throw err;
    }

    return await userRepository.findRolesByUserId(userId);
}

export const getUserRoles = async (userId: number) => {
    await getUserById(userId);
    return await userRepository.findRolesByUserId(userId);

}

export const removeUserRole = async (
    userId: number,
    roleId: number
) => {
    await getUserById(userId);

    const affectedRows = await userRepository.removeUserRole(userId, roleId);

    if (affectedRows === 0) {
        throw new AppError(`User ID: ${userId} ບໍ່ມີ Role ID: ${roleId}`, 404);
    }
};