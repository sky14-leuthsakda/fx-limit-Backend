import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Create Sys code Category
export const createSysCode = async (
    category: string,
    code: string,
    nameEn: string,
    nameLo: string,
    codeOrder: number | undefined,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_sys_codes_insert(?, ?, ?, ?, ?, ?)",
        [
          category, 
          code, 
          nameEn, 
          nameLo,
          codeOrder ?? null,
          createdBy
        ]
    );

    return result[0]?.[0]?.code_id ?? 0;
};

// Sys Codes All
export const findAllSysCodes = async () => {
  const [result] = await pool.query<RowDataPacket[][]>(
    "CALL sp_sys_codes_get_all"
  );
  return result[0] ?? [];
};

// Sys Codes By Category
export const findSyscodesByCategory = async (category: string) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_sys_codes_get_by_category(?)",
        [category]
    );

    return result[0] ?? [];
};

// Sys Code By ID
export const findSysCodeById = async (codeId: number) => {
  const [result] = await pool.query<RowDataPacket[][]>(
    "CALL sp_sys_codes_get_by_id(?)",
    [codeId]
  );
  return result[0]?.[0] ?? null;
};

// Update Sys Code 
export const updateSysCode = async (
  codeId: number,
  category: string,
  code: string,
  nameEn: string,
  nameLo: string,
  codeOrder: number,
  isActive: number,
  updatedBy: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_sys_codes_update(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      codeId,
      category,
      code,
      nameEn, 
      nameLo,
      codeOrder,
      isActive,
      updatedBy
    ]
  );

  return result.affectedRows;
};

// Soft Delete Sys Code 
export const softDeleteSysCode = async (
  codeId: number,
  deletedBy: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_sys_codes_soft_delete(?, ?)",
    [codeId, deletedBy]
  );
  return result.affectedRows;
};

// Restore Sys Code
export const restoreSysCode = async (
  codeId: number,
  updatedBy: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    "CALL sp_sys_codes_restore(?, ?)",
    [codeId, updatedBy] 
  );

  return result.affectedRows;
};