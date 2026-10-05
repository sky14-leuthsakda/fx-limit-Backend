import * as configRepository from "./config.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { 
    CreateConfigInput, 
    UpdateConfigInput 
} from "./config.schema.js";

export const getAllConfigs = async () => {
    return await configRepository.findAllConfigs();
};

export const getConfigByKey = async (key: string) => {
    const config = await configRepository.findConfigByKey(key);
    if (!config) {
        throw new AppError(`ບໍ່ພົບການຕັ້ງຄ່າ: ${key}`, 404);
    }

    return config;
};

export const getConfigValueAsNumber = async (key: string): Promise<number> => {
    const config = await configRepository.findConfigByKey(key);
    if (!config) {
        throw new AppError(`ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ: ${key} ໃນລະບົບ`, 500);
    }

    const value = Number(config.config_value);
    if (isNaN(value)) {
        throw new AppError(`ຄ່າ ${key} ບໍ່ແມ່ນຕົວເລກທີ່ຖືກຕ້ອງ`, 500);
    }

    return value;
};

export const getConfigValueAsString = async (key: string): Promise<string> => {
    const config = await configRepository.findConfigByKey(key);
    if (!config) {
        throw new AppError(`ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ ${key} ໃນລະບົບ`, 500);
    }

    return config.config_value;
};

export const createNewConfig = async (data: CreateConfigInput, userId: number) => {
    const existing = await configRepository.findConfigByKey(data.configKey);
    if (existing) {
        throw new AppError(`Config Key "${data.configKey}" ມິຢູ່ແລ້ວ`, 400);
    }

    await configRepository.createConfig(
        data.configKey,
        data.configValue,
        data.description,
        userId
    );

    return {
        configKey: data.configKey,
        configValue: data.configValue,
    };
};

export const updateExistingConfig = async (
    key: string,
    data: UpdateConfigInput,
    userId: number
) => {
    const existing = await configRepository.findConfigByKey(key);
    if (!existing) {
        throw new AppError(`ບໍ່ພົບການຕັ້ງຄ່າ ${key}`, 404);
    }

    await configRepository.logConfigChange(
        key,
        existing.config_value,
        data.configValue,
        userId
    );

    await configRepository.updateConfig(key, data.configValue, userId);
    return {
        configKey: key,
        configValue: data.configValue
    };
};