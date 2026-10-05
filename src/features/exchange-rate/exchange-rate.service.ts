import * as rateRepository from "../exchange-rate/exchange-rate.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateRateInput, UpdateRateInput } from "./exchange-rate.schema.js";

// Create New Rate
export const createNewRate = async (
    data: CreateRateInput, 
    createdBy: number
) => {
    try {
        const rateId = await rateRepository.createRate(
            data.rateDate, 
            data.currencyId, 
            data.rate, 
            createdBy
        );

        return await rateRepository.findRateById(rateId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError(`ມີອັດຕາແລກປ່ຽນຂອງສະກຸນເງິນ ID: ${data.currencyId} ສຳລັບວັນທີ ${data.rateDate} ຢູ່ແລ້ວ`, 409);
        }
        throw err;
    }
};

// Rates All
export const getAllRates = async () => {
    return await rateRepository.findRateAll();
};

// Rates Paginated
export const getRatePaginated = async (
    page: number, 
    limit: number
) => {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit < 100 ? limit : 20;

    const {rates, total_records} = await rateRepository.findRatesPaginated(
        safePage, 
        safeLimit
    );

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        rates,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records, totalPages
        },
    };
};

// Rate By Id - single source of truth 
export const getRateById = async (rateId: number) => {
    const rate = await rateRepository.findRateById(rateId);

    if (!rate) {
        throw new AppError(`ບໍ່ພົບ Rate ID: ${rateId}`, 404);
    }

    return rate;
};

// Rate Per CurrencyId
export const getTodayRate = async (currencyId: number) => {
    const rate = await rateRepository.findTodayRate(currencyId);

    if (!rate) {
        throw new AppError(`ຍັງບໍ່ມີອັດຕາແລກປ່ຽນສະກຸນເງິນ ID: ${currencyId} ສຳລັບມື້ນີ້`, 404);
    }

    return rate;
}

// History Rate Per CurrencyId (Default: 30 days)
export const getRateHistory = async (currencyId: number, limit?: number) => {
    const safeLimit = limit && limit > 0 && limit < 365 ? limit : 30;

    return await rateRepository.findRateHistory(currencyId, safeLimit);
};

// Today's Rates All
export const getTodayAllRates = async () => {
    return await rateRepository.findAllCurrentRates();
}

// Update Existing Rate
export const updateExistingRate = async (
  rateId: number,
  data: UpdateRateInput,
  updatedBy: number
) => {
  const existing = await getRateById(rateId);
 
  let affectedRows: number;
 
  try {
    affectedRows = await rateRepository.updateRate(
      rateId,
      data.rateDate ?? existing.rate_date,
      data.currencyId ?? existing.currency_id,
      data.rate ?? existing.rate,
      data.isActive ?? existing.is_active,
      updatedBy
    );
  } catch (err: any) {
    if (err.errno === 1062) {
      throw new AppError(`ມີອັດຕາແລກປ່ຽນຂອງສະກຸນເງິນ ID: ${data.currencyId ?? existing.currency_id} ສຳລັບວັນທີ ${data.rateDate ?? existing.rate_date} ຢູ່ແລ້ວ`, 409);
    }
    throw err;
  }
 
  if (affectedRows === 0) {
    throw new AppError("ບໍ່ສາມາດແກ້ໄຂ Rate ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
  }
 
  return await rateRepository.findRateById(rateId);
};

// Soft Delete Rate
export const softDeleteRate = async (
    rateId: number, 
    deletedBy: number
) => {
    const affectedRows = await rateRepository.softDeleteRate(rateId, deletedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Rate ID: ${rateId} ຫລື ອາດຖືກລຶບໄປແລ້ວ`, 404);
    }
}

// Restore Rate
export const restoreRate = async (
    rateId: number, 
    updatedBy: number
) => {
    const affectedRows = await rateRepository.restoreRate(rateId, updatedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Rate ID: ${rateId} ຫລື ບໍ່ໄດ້ຖືກລຶບ`, 404);
    }
}