export interface FxTransaction {
    txn_id: number;
    txn_date: string;
    id_type_id: number;
    customer_id_code: string;
    customer_name: string;
    product_id: number;
    currency_id: number;
    amount_foreign: number;
    rate: number;
    amount_lak: number;
    amount_usd: number;
    user_id: number;
    branch_id: number;
}