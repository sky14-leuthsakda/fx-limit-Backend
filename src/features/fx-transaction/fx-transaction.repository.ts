import pool from "../../connector/db.js";

export const findTodayRateByCurrency = async (currencyId: number) => {
    const [rows] = await pool.query<any[]>(
        "SELECT sell_rate FROM ex_rate_daily WHERE currency_id = ? AND rate_date = CURDATE()",
        [currencyId]
    );

    return rows[0] ?? null;
};

export const createTransaction = async (data: {
    idTypeId: number;
    customerIdCode: string;
    customerName: string;
    productId: number;
    currencyId: number;
    amountForeign: number;
    rate: number;
    amountLak: number;
    amountUsd: number;
    userId: number;
    branchId: number;
}) => {
    const [result] = await pool.query<any>(
        `INSERT INTO fx_daily
        (id_type_id, customer_id_code, customer_name, product_id, currency_id, amount_foreign, rate, amount_lak, amount_usd, user_id, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

        [
            data.idTypeId,
            data.customerIdCode,
            data.customerName,
            data.productId,
            data.currencyId,
            data.amountForeign,
            data.rate,
            data.amountLak,
            data.amountUsd,
            data.userId,
            data.branchId,
        ]
    );
    
    return result.insertId;
};