import * as fxRepository from "./fx-transaction.repository.js";
import * as limitCheckService from "../limit-check/limit-check.service.js";
import * as configService from "../config/config.service.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateTransactionInput } from "./fx-transaction.schema.js";

export const createNewTransaction = async (
    data: CreateTransactionInput,
    userId: number,
    branchId: number
) => {
    const rateRow = await fxRepository.findTodayRateByCurrency(data.currencyId);
    if (!rateRow) {
        throw new AppError("ຍັງບໍ່ມີອັດຕາແລກປ່ຽນສຳລັບສະກຸນເງິນນີ້ໃນມື້ນີ້", 400);
    }
    const rate = rateRow.sell_rate;

    const lakPerUsd = await configService.getConfigValueAsNumber("LAK_PER_USD");
    
    const rawAmountLak = data.amountForeign * rate;
    const amountLak = Math.round(rawAmountLak);

    const rawAmountUsd = amountLak / lakPerUsd;
    const amountUsd = Number(rawAmountUsd.toFixed(4));

    await limitCheckService.validateCustomerLimit(data.customerIdCode, amountUsd);

    const txnId = await fxRepository.createTransaction({
        idTypeId: data.idTypeId,
        customerIdCode: data.customerIdCode,
        customerName: data.customerName,
        productId: data.productId,
        currencyId: data.currencyId,
        amountForeign: data.amountForeign,
        rate,
        amountLak,
        amountUsd,
        userId,
        branchId,
    });

    return {
        txnId,
        ...data,
        rate,
        amountLak,
        amountUsd,
    };
};