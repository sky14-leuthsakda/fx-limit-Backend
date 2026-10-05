import pool from "../../connector/db.js";

export const  searchCustomers = async (
    keyword: string,
    limit: number,
    offset: number
) => {
    const searchPattern = `%${keyword}%`;

    const [rows] = await pool.query<any[]>(
        `SELECT DISTINCT customer_id_code, customer_name FROM fx_daily WHERE customer_id_code LIKE ? OR customer_name LIKE? ORDER BY customer_name ASC LIMIT ? OFFSET ?`,
        [searchPattern, searchPattern, limit, offset]
    );

    const [countRows] = await pool.query<any[]>(
        `SELECT COUNT(DISTINCT customer_id_code) AS total FROM fx_daily WHERE customer_id_code LIKE ? OR customer_name LIKE ?`,
        [searchPattern, searchPattern]
    );

    return { 
        customers: rows,
        total: countRows[0].total
    }; 
};

export const findCustomerHistory = async (CustomerIdCode: string) => {
    const [rows] = await pool.query<any[]>(
        `SELECT fd.txn_id, fd.txn_date, fd.amount_foreign, fd.rate, 
            fd.amount_lak, fd.amount_usd, sc.code AS currency_code 
        FROM fx_daily fd 
        JOIN sys_codes sc ON fd.currency_id = sc.code_id 
        WHERE fd.customer_id_code = ? 
            AND YEAR(fd.txn_date) = YEAR(CURDATE()) 
            AND MONTH(fd.txn_date) = MONTH(CURDATE()) 
        ORDER BY fd.txn_date DESC`,
        [CustomerIdCode]
    );

    return rows;
}