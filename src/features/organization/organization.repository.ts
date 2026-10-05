import pool from "../../connector/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// ====================================== BRANCHES ============================================

export const createBranch = async (
    branchCode: string, 
    branchNameEn: string,
    branchNameLo: string,
    createdBy: number  
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_branches_insert(?, ?, ?, ?)",
        [
            branchCode, 
            branchNameEn, 
            branchNameLo,
            createdBy,
        ]);
    
    return result[0]?.[0]?.branch_id ?? 0;
};

export const findAllBranches = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_branches_get_all()"
    );

    return result[0] ?? [];
};

export const findBranchesPaginated = async (
    page: number, 
    limit: number
) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_branches_get_paginated(?, ?)",
        [page, limit]
    );

    return {
        branches: results[0] ?? [],
        total_records: results[1]?.[0]?.total_records ?? 0
    };
}

export const findBranchById = async (branchId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_branches_get_by_id(?)",
        [branchId]
    );
    
    return result[0]?.[0] ?? null;
};


export const updateBranch = async (
    branchId: number, 
    branchCode: string,
    branchNameEn: string,
    branchNameLo: string,
    isActive: boolean,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_branches_update(?, ?, ?, ?, ?, ?)",
        [
            branchId,
            branchCode,
            branchNameEn,
            branchNameLo,
            isActive ? 1 : 0,
            updatedBy
        ]
    );

    return result.affectedRows;
};

export const softDeleteBranch = async (
    branchId: number, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_branches_soft_delete(?, ?)",
        [branchId, deletedBy]
    );

    return result.affectedRows;
};

export const restoreBranch = async (
    branchId: number, 
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_branches_restore(?, ?)",
        [branchId, updatedBy]
    );

    return result.affectedRows;
};

// ====================================== UNITS ============================================

export const createUnit = async (
    branchId: number, 
    unitCode: string, 
    unitNameEn: string, 
    unitNameLo: string,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_units_insert(?, ?, ?, ?, ?)",
        [
            branchId, 
            unitCode, 
            unitNameEn, 
            unitNameLo,
            createdBy
        ]
    );

    return result[0]?.[0]?.unit_id ?? 0;
};

export const findAllUnits = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_units_get_all()"
    );

    return result[0] ?? [];
};

export const findUnitsPaginated = async (
    page: number,
    limit: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_units_get_paginated(?, ?)",
        [page, limit]
    );

    return {
        units: result[0] ?? [],
        total_records: result[1]?.[0]?.total_records ?? 0,
    };
};

export const findUnitById = async (unitId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_units_get_by_id(?)",
        [unitId]
    );

    return result[0]?.[0] ?? null;
}

export const findUnitByBranch = async (branchId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_units_get_by_branch(?)",
        [branchId]
    );

    return result[0] ?? [];
};

export const updateUnit = async (
    unitId: number,
    branchId: number,
    unitCode: string,
    unitNameEn: string,
    unitNameLo: string,
    isActive: boolean,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_units_update(?, ?, ?, ?, ?, ?, ?)",
        [
            unitId,
            branchId,
            unitCode,
            unitNameEn,
            unitNameLo,
            isActive ? 1 : 0,
            updatedBy
        ]
    );

    return result.affectedRows;
};

export const softDeleteUnit = async (
    unitId: number,
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_units_soft_delete(?, ?)",
        [unitId, deletedBy]
    );

    return result.affectedRows;
};

export const restoreUnit = async (
    unitId: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_units_restore(?, ?)",
        [unitId, updatedBy]
    );

    return result.affectedRows;
};
