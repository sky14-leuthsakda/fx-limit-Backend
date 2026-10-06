import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Create Role
export const createRole = async (
    roleCode: string,
    roleNameEn: string,
    roleNameLo:string, 
    description: string | undefined,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_roles_insert(?, ?, ?, ?, ?)",
        [
            roleCode, 
            roleNameEn, 
            roleNameLo, 
            description ?? null,
            createdBy
        ]
    );

    return result[0]?.[0]?.role_id ?? 0;
};

// Roles All
export const findAllRoles = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_roles_get_all()"
    );

    return result[0] ?? [];
};

// Role By ID
export const findRoleById = async (roleId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_roles_get_by_id(?)",
        [roleId]
    );

    return result[0]?.[0] ?? null;
};

// Update Role
export const updateRole = async (
    roleId: number,
    roleCode: string,
    roleNameEn: string,
    roleNameLo: string,
    description: string | undefined,
    isActive: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_roles_update(?, ?, ?, ?, ?, ?, ?)",
        [
            roleId,
            roleCode,
            roleNameEn,
            roleNameLo,
            description ?? null,
            isActive,
            updatedBy
        ]
    );

    return result.affectedRows;
};

// Soft Delete Role
export const softDeleteRole = async (
    roleId: number,
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_roles_soft_delete(?, ?)",
        [roleId, deletedBy]
    );

    return result.affectedRows;
};

// Restore Role
export const restoreRole = async (roleId: number, updatedBy: number) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_roles_restore(?, ?)",
        [roleId, updatedBy]
    );

    return result.affectedRows;
};

// ============================ ROLE PERMISSIONS ============================

// Assign Permissions To Role
export const assignPermissionToRole = async (
    roleId: number, 
    permissionId: number,
    createdBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_role_permissions_insert(?, ?, ?)", 
        [
            roleId, 
            permissionId, 
            createdBy
        ]
    );
    
    return result.affectedRows;
};

// Permissions By Role
export const findRolePermissions = async (roleId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_role_permissions_get_by_role_id(?)",
        [roleId]
    );

    return result[0] ?? [];
};

// Revoke Permission From Role
export const revokePermissionFromRole = async (
    roleId: number,
    permissionId: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_role_permissions_revoke(?, ?)",
        [roleId, permissionId]
    );

    return result.affectedRows;
};





