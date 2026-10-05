import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// Create User
export const createUser = async (
    username: string,
    passwordHash: string,
    firstNameEn: string,
    lastNameEn: string,
    firstNameLo: string,
    lastNameLo: string,
    branchId: number,
    unitId: number | undefined,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_users_insert(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            username, 
            passwordHash,
            firstNameEn,
            lastNameEn,
            firstNameLo,
            lastNameLo, 
            branchId, 
            unitId ?? null,
            createdBy
        ]
    );

    return result[0]?.[0]?.user_id ?? 0;
};

// Users All
export const findUsersAll = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_users_get_all()"
    );

    return result[0] ?? [];
};

// Users Pagination
export const findUsersPaginated = async (
    page: number, 
    limit: number
) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_users_get_paginated(?, ?)",
        [page, limit]
    );
    
    return { 
        users: results[0] ?? [], 
        total_records: results[1]?.[0]?.total_records ?? 0 
    };
};

// User By ID
export const findUserById = async (userId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_users_get_by_id(?)",
        [userId]
    );
    
    return result[0]?.[0] ?? null;

};

// Update User
export const updateUser = async (
  userId: number,
  firstNameEn: string,
  lastNameEn: string,
  firstNameLo: string,
  lastNameLo: string,
  branchId: number,
  unitId: number | null,
  isActive: number,
  updatedBy: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_users_update(?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
        userId, 
        firstNameEn, 
        lastNameEn, 
        firstNameLo, 
        lastNameLo, 
        branchId, 
        unitId, 
        isActive, 
        updatedBy
    ]
  );

  return result.affectedRows;
};

// Soft Delete User
export const softDeleteUser = async (
    userId: number, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_users_soft_delete(?, ?)",
        [userId, deletedBy]
    );

    return result.affectedRows;
};

// Restore User
export const restoreUser = async (
    userId: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_users_restore(?, ?)",
        [userId, updatedBy]
    );

    return result.affectedRows;
};

// =================== User Roles ====================

// Assign Role To User
export const assignUserRole = async (
    userId: number, 
    roleId: number, 
    createdBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_user_roles_insert(?, ?, ?)",
        [userId, roleId, createdBy]
    );

    return result.affectedRows;
};

// Role By User
export const findRolesByUserId = async (userId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_user_roles_get_by_user_id(?)",
        [userId]
    );

    return result[0] ?? [];
};

// Revoke Role From User
export const removeUserRole = async (
    userId: number,
    roleId: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_user_roles_delete(?, ?)",
        [userId, roleId]
    );

    return result.affectedRows;
};