import * as permissionRepository from './permission.repository.js';
import { AppError } from '../../utils/AppError.js';
import type { 
    CreatePermissionInput, 
    UpdatePermissionInput 
} 
from './permission.schema.js';

export const createNewPermission = async (
    data: CreatePermissionInput, 
    createdBy: number
) => {
    try {
        const permissionId = await permissionRepository.createPermission(
        data.permissionCode,
        data.permissionNameEn,
        data.permissionNameLo,
        data.description,
        createdBy
    );

    return await permissionRepository.findPermissionById(permissionId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("Permission Code ນີ້ມີຢູ່ແລ້ວ", 409);
        }
        throw err;
    }
};

export const getAllPermissions = async () => {
    return permissionRepository.findAllPermissions();
}


export const getPermissionById = async (permissionId: number) => {
    const permission = await permissionRepository.findPermissionById(permissionId);

    if (!permission) {
        throw new AppError(`ບໍ່ພົບ Permission ID ${permissionId}`, 404);
    }

    return permission;
}

export const updatePermission = async (
    permissionId: number,
    data: UpdatePermissionInput,
    updatedBy: number
) => {
    const existingPermission = await getPermissionById(permissionId);

    try {
        const affectedRows = await permissionRepository.updatePermission(
            permissionId,
            data.permissionCode ?? existingPermission.permission_code,
            data.permissionNameEn ?? existingPermission.permission_name_en,
            data.permissionNameLo ?? existingPermission.permission_name_lo,
            data.description ?? existingPermission.description,
            data.isActive ?? Number(existingPermission.is_active),
            updatedBy
        );

        if (affectedRows === 0) {
            throw new AppError("ບໍ່ສາມາດແກ້ໄຂ Permission ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
        }
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("Permission Code ນີ້ມີຢູ່ແລ້ວ", 409);
        }
        throw err;
    }
    
    return await permissionRepository.findPermissionById(permissionId);
};

export const softDeletePermission = async (
    permissionId: number, 
    deletedBy: number
) => {
    const affectedRows = await permissionRepository.softDeletePermission(
        permissionId, 
        deletedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Permission ID: ${permissionId} ຫລື ອາດຖືກປິດໃຊ້ງານໄປແລ້ວ`, 404);
    }
};

export const restorePermission = async (
    permissionId: number,
    updatedBy: number
) => {
    const affectedRows = await permissionRepository.restorePermission(
        permissionId, 
        updatedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Permission ID: ${permissionId} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້ງານ`, 404);
    }
};