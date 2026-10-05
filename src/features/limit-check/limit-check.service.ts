import * as limitCheckRepository from "./limit-check.repository.js";
import { AppError } from "../../utils/AppError.js";

export const validateCustomerLimit = async (
    customerIdCode: string,
    newAmountUsd: number
) => {
    const result = await limitCheckRepository.checkCustomerLimit(customerIdCode, newAmountUsd);

    if (result.is_exceeded) {
        throw new AppError(`ເກີນວົງເງິນທີ່ກຳນົດ ${result.monthly_limit} USD, ໃຊ້ໄປແລ້ວ: ${result.used_amount} USD, ຍັງເຫລືອ: ${result.remaining_amount} USD`, 400);
    }

    return result;
}