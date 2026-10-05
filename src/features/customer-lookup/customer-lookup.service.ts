import * as customerRepository from "./customer-lookup.repository.js";
import * as limitCheckRepository from "../limit-check/limit-check.repository.js";
import { AppError } from "../../utils/AppError.js";

export const searchCustomersPaginated = async (
    keyword: string,
    page: number,
    limit: number
) => {
    const offset = (page - 1) * limit;
    const { customers, total } = await customerRepository.searchCustomers(
        keyword,
        limit,
        offset
    );

    const totalPages = Math.ceil(total / limit);

    return {
        customers,
        pagination: {
            currentPage: page, limit,
            totalItems: total, totalPages
        },
    };
};

export const getCustomerDetail = async (customerIdCode: string) => {
    const history = await customerRepository.findCustomerHistory(customerIdCode);

    const limitInfo = await limitCheckRepository.checkCustomerLimit(customerIdCode, 0);

    if (history.length === 0) {
        throw new AppError(`ບໍ່ພົບປະຫວັດການແລກປ່ຽນຂອງລູກຄ້າ: ${customerIdCode}`,404);
    }

    return {
        customerIdCode,
        customerName: history[0].customer_name ?? "",
        monthlyLimit: limitInfo.monthly_limit,
        usedAmount: limitInfo.used_amount,
        remainingAmount: limitInfo.remaining_amount,
        transactionHistory: history,
    };
};