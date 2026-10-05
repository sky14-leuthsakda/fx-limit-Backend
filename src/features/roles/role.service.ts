import * as roleRepository from "./role.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { 
  CreateRoleInput, 
  UpdateRoleInput, 
  AssignPermissionInput 
} from "./role.schema.js";

// =========================== Roles ===============================

// Create Role
export const createNewRole = async (
  data: CreateRoleInput, 
  createdBy: number
) => { 
  try {
    const roleId = await roleRepository.createRole(
      data.roleCode,
      data.roleNameEn,
      data.roleNameLo,
      data.description,
      createdBy
    );

    return { roleId, ...data };
  } catch (err: any) {
      if (err.errno === 1062) {
        throw new AppError(`Role Code "${data.roleCode}" ມີຢູ່ແລ້ວ`, 409);
      }
      throw err;
  }
};
 
// Roles All
export const getAllRoles = async () => {
  return await roleRepository.findAllRoles();
};

// Role By Id
export const getRoleById = async (roleId: number) => {
  const role = await roleRepository.findRoleById(roleId);

  if (!role) {
    throw new AppError(`ບໍ່ພົບ Role ID: ${roleId}`, 404);
  }

  return role;
};

// Update Role
export const updateExistingRole = async (
    roleId: number,
    data: UpdateRoleInput,
    updatedBy: number
) => {
  const existingRole = await getRoleById(roleId);

  let affectedRows: number;

  try {
    affectedRows = await roleRepository.updateRole(
      roleId,
      data.roleCode ?? existingRole.role_code,
      data.roleNameEn ?? existingRole.role_name_en,
      data.roleNameLo ?? existingRole.role_name_lo,
      data.description ?? existingRole.description,
      data.isActive ?? existingRole.is_active,
      updatedBy
    );
  } catch (err: any) {
    if (err.errno === 1062) {
      throw new AppError(`Role Code "${data.roleCode}" ມີຢູ່ແລ້ວ`, 409);
    }
    throw err;
  }

  if (affectedRows === 0) {
    throw new AppError("ບໍ່ສາມາດແກ້ໄຂ Role ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);  
  }

  return await roleRepository.findRoleById(roleId);
};

// Soft Delete To Role
export const softDeleteRole = async (
  roleId: number, 
  deletedBy: number
) => {
  const affectedRows = await roleRepository.softDeleteRole(roleId, deletedBy);

  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບ Role ID: ${roleId} ຫລື ອາດຖືກປິດໃຊ້ໄປແລ້ວ`, 404);
  }
};

// Restore Role
export const restoreRole = async (
  roleId: number,
  updatedBy: number
) => {
  const affectedRows = await roleRepository.restoreRole(roleId, updatedBy);

  if (affectedRows === 0) {
    throw new AppError(`ບໍ່ພົບ Role ID: ${roleId} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້`, 404);
  }
};

// ======================= Role Permissions =========================

// Assign Permission To Role
export const assignPermission = async (
  roleId: number,
  permissionId: number,
  createdBy: number
) => {
  await getRoleById(roleId);

  try {
    await roleRepository.assignPermissionToRole(
      roleId, 
      permissionId, 
      createdBy
    );
  } catch (err: any) {
    if (err.errno === 1062) {
      throw new AppError("Role ນີ້ມີ Permission ນີ້ແລ້ວ", 409);
    }
    if (err.errno === 1452) {
      throw new AppError(`ບໍ່ພົບ Permission ID: ${permissionId}`, 404);
    }
    throw err;
  }

  return await roleRepository.findRolePermissions(roleId);
};  

// Role To Permissions
export const getRolePermissions = async (roleId: number) => {
  await getRoleById(roleId);
  return await roleRepository.findRolePermissions(roleId);
};

// Revoke Permission From Role
export const revokePermission = async (
  roleId: number, 
  permissionId: number
) => {
  const affectedRows = await roleRepository.revokePermissionFromRole(
    roleId,
    permissionId
  );

  if (affectedRows === 0) {
    throw new AppError(`Role ID: ${roleId} ບໍ່ມີ Permission ID: ${permissionId}`, 404);
  }
};

