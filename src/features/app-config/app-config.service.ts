import * as appConfigRepository from "./app-config.repository.js";
import { AppError } from "../../utils/AppError.js";
import type { 
    CreateAppConfigInput,
    UpdateAppConfigInput
} from "./app-config.schema.js";

// Create New Config
export const createNewConfig = async (
    data: CreateAppConfigInput,
    createdBy: number
) => {
    try {
        const configKey = await appConfigRepository.createConfig(
            data.configKey,
            data.configValue,
            data.description,
            createdBy
        );

        return await appConfigRepository.findConfigByKey(configKey);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError(`Config Key "${data.configKey}" ມີຢູ່ແລ້ວ`, 409);
        }
        throw err;
    }
};

// Configs All
export const getAllConfigs = async () => {
    return await appConfigRepository.findAllConfigs();
};

// Config By Key
export const getConfigByKey = async (configKey: string) => {
    const config = await appConfigRepository.findConfigByKey(configKey);

    if (!config) {
        throw new AppError("ບໍ່ພົບ Config ທີ່ຕ້ອງການ", 404);
    }

    return config;
};

// Update Config
export const updateConfig = async (
    configKey: string,
    data: UpdateAppConfigInput,
    updatedBy: number
) => {
    const existingConfig = await getConfigByKey(configKey)

    const configValue = data.configValue ?? existingConfig.config_value;
    const description = data.description !== undefined ? data.description
    : existingConfig.description;

    const isActive = data.isActive ?? existingConfig.is_active;
    const affectedRows = await appConfigRepository.updateConfig(
        configKey,
        configValue,
        description,
        isActive,
        updatedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ສາມາດແກ້ໄຂ Config ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)`, 400);
    }

    return await appConfigRepository.findConfigByKey(configKey);
};

// Soft Delete Config
export const softDeleteConfig = async (
    configKey: string,
    deletedBy: number
) => {
    const affectedRows = await appConfigRepository.softDeleteConfig(
        configKey,
        deletedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Config Key: ${configKey} ຫລື ອາດຖືກປິດໃຊ້ໄປແລ້ວ`, 404);
    }
}

// Restore Config
export const restoreConfig = async (
    configKey: string,
    updatedBy: number
) => {
    const affectedRows = await appConfigRepository.restoreConfig(
        configKey,
        updatedBy
    );

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Config Key: ${configKey} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້`, 404);
    }
};