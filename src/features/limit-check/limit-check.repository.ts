import pool from "../../connector/db.js";

export const checkCustomerLimit = async (
    customerIdCode: string,
    newAmountUsd: number
) => {
    const [results] = await pool.query<any>(
        "CALL sp_check_customer_limit(?, ?)",
        [customerIdCode, newAmountUsd]
    );

    return results[0][0];
}