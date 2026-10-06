import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Create Config
export const createConfig = async (
    configKey: string,
    configValue: string,
    description: string | undefined,
    createdBy: number
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_app_config_insert(?, ?, ?, ?)",
        [
            configKey, 
            configValue, 
            description ?? null, 
            createdBy
        ]
    );

    return result[0]?.[0]?.config_key ?? configKey;
};

// Configs All
export const findAllConfigs = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_app_config_get_all()"
    );

    return result[0] ?? [];
};

// Config By Key
export const findConfigByKey = async (configKey: string) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_app_config_get_by_key(?)",
        [configKey]
    );

    return result[0]?.[0] ?? null;
};

// Update Config 
export const updateConfig = async (
    configKey: string,
    configValue: string,
    description: string | null,
    isActive: number,
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_app_config_update(?, ?, ?, ?, ?)",
        [
            configKey, 
            configValue, 
            description, 
            isActive, 
            updatedBy
        ]
    );

    return result.affectedRows;
};

// Soft Delete Config
export const softDeleteConfig = async (
    configKey: string, 
    deletedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_app_config_soft_delete(?, ?)",
        [configKey, deletedBy]
    );

    return result.affectedRows;
};

// Restore Config
export const restoreConfig = async (
    configKey: string, 
    updatedBy: number
) => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_app_config_restore(?, ?)",
        [configKey, updatedBy]
    );

    return result.affectedRows;
};