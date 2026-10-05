import pool from "../../connector/db.js";

export const findAllConfigs = async () => {
    const [rows] = await pool.query<any[]>(
        "SELECT * FROM app_config ORDER BY config_key ASC"
    );

    return rows;
};

export const findConfigByKey = async (key: string) => {
    const [rows] = await pool.query<any[]>(
        "SELECT * FROM app_config WHERE config_key = ?",
        [key]
    );

    return rows[0] ?? null;
};

export const createConfig = async (
    key: string,
    value: string,
    description: string | undefined,
    updatedBy: number
) => {
    await pool.query("INSERT INTO app_config (config_key, config_value, description, updated_by) VALUES (?, ?, ?, ?)",
    [key, value, description, updatedBy]   
    );
};

export const updateConfig = async (
    key: string,
    value: string,
    updatedBy: number
) => {
    const [result] = await pool.query<any>(
        "UPDATE app_config SET config_value = ?, updated_by = ? WHERE config_key = ?",
        [value, updatedBy, key]
    );

    return result.affectedRows;
};

export const logConfigChange = async (
    key: string,
    oldValue: string | null,
    newValue: string,
    changedBy: number
) => {
    await pool.query(
        "INSERT INTO app_config_logs (config_key, old_value, new_value, changed_by) VALUES (?, ?, ?, ?)",
        [key, oldValue, newValue, changedBy]
    );
}; 