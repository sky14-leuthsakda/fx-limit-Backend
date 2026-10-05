import pool from "../../connector/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export const findUserByUsername = async (username: string) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_auth_get_user_by_username(?)",
        [username]
    );
  
    return result[0]?.[0] ?? null;
};

export const findUserById = async (userId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_auth_get_user_by_id(?)",
        [userId]
    );

    return result[0]?.[0] ?? null;
}

export const findUserRolesAndPermissions = async (userId: number) => {
    const [roleResult] = await pool.query<RowDataPacket[][]>(
        "CALL sp_auth_get_user_roles(?)",
        [userId]
    );
    const roleRows = roleResult[0] ?? [];

    const [permResult] = await pool.query<RowDataPacket[][]>(
        "CALL sp_auth_get_user_permissions(?)",
        [userId]
    );
    const permRows = permResult[0] ?? [];

    return {
        roles: roleRows.map((r) => r.role_code),
        permissions: permRows.map((p) => p.permission_code),
    };
};

export const updatePassword = async (
    userId: number, 
    passwordHash: string 
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_auth_update_password(?, ?)",
        [userId, passwordHash]
    );
    
    return result.affectedRows;
}