export interface ExchangeRate {
    rate_id: number;
    rate_date: string;
    currency_id: number;
    buy_rate: number;
    sell_rate: number;
    created_by: number | null;
    created_at: string;
}