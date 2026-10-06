import pool from '../../connector/db.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const createPermission = async (
    permissionCode: string,
    permissionNameEn: string,
    permissionNameLo: string,
    description: string | undefined,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_permissions_insert(?, ?, ?, ?, ?)",
        [
            permissionCode,
            permissionNameEn,
            permissionNameLo,
            description ?? null,
            createdBy
        ]
    );

    return result[0]?.[0]?.permission_id ?? 0;
}

export const findAllPermissions = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
    "CALL sp_permissions_get_all()"
    );

    return result[0] ?? []; 
};

export const findPermissionById = async (permissionId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_permissions_get_by_id(?)",
        [permissionId]
    );

    return result[0]?.[0] ?? null;
};

export const updatePermission = async (
    permissionId: number,
    permissionCode: string,
    permissionNameEn: string,
    permissionNameLo: string,
    description: string | undefined,
    isActive: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_permissions_update(?, ?, ?, ?, ?, ?, ?)",
        [
            permissionId,
            permissionCode,
            permissionNameEn,
            permissionNameLo,
            description ?? null,
            isActive,
            updatedBy
        ]
    );

    return result.affectedRows;
};

export const softDeletePermission = async (
    permissionId: number, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_permissions_soft_delete(?, ?)",
    [permissionId, deletedBy]
    );

    return result.affectedRows;
};

export const restorePermission = async (
    permissionId: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_permissions_restore(?, ?)",
    [permissionId, updatedBy]
    );

    return result.affectedRows;
}

