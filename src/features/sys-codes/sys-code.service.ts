import * as sysCodeRepository from "./sys-code.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
    CreateSysCodeInput,
    UpdateSysCodeInput
} from "./sys-code.schema.js";

// Create Sys Code
export const createNewSysCode = async (
    data: CreateSysCodeInput,
    createdBy: number
) => {
    try {
        const codeId = await sysCodeRepository.createSysCode(
            data.category,
            data.code,
            data.nameEn,
            data.nameLo,
            data.codeOrder,
            createdBy
    );

    return await sysCodeRepository.findSysCodeById(codeId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError(`Code "${data.code}" ໃນ Category "${data.category}" ມີຢູ່ແລ້ວ`, 409);
        }
        throw err;
    }
};
// Sys Codes All / Category
export const getSysCodes = async (category?: string) => {
    if (category) {
        return await sysCodeRepository.findSyscodesByCategory(category);
    }
    
    return await sysCodeRepository.findAllSysCodes();
};

// Sys Code By ID
export const getSysCodeById = async (codeId: number) => {
    const sysCode = await sysCodeRepository.findSysCodeById(codeId);

    if(!sysCode) {
        throw new AppError(`ບໍ່ພົບ Sys Code ID: ${codeId}`, 404);
    }

    return sysCode;
};

// Update Sys code
export const updateExistingSysCode = async (
    codeId: number, 
    data: UpdateSysCodeInput,
    updatedBy: number
) => {
    const existing = await getSysCodeById(codeId);

    let affectedRows: number;

    try {
        affectedRows = await sysCodeRepository.updateSysCode(
            codeId,
            data.category ?? existing.category,
            data.code ?? existing.code,
            data.nameEn ?? existing.name_en,
            data.nameLo ?? existing.name_lo,
            data.codeOrder ?? existing.code_order,
            data.isActive ?? existing.is_active,
            updatedBy
        );
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError(`Code "${data.code ?? existing.code}" ໃນ Category "${data.category ?? existing.category}" ມີຢູ່ແລ້ວ`, 409);
        }
        throw err;
    }
    if (affectedRows === 0) {
        throw new AppError("ບໍ່ສາມາດແກ້ໄຂ Sys Code ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
    }
    return await sysCodeRepository.findSysCodeById(codeId);
};

// Soft Delete Sys Code
export const softdeleteSysCode = async (
    codeId: number,
    deletedBy: number
) => {
    const affectedRows = await sysCodeRepository.softDeleteSysCode(codeId, deletedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Sys Code ID: ${codeId}`, 404);
    }
};

// Restore Sys Code
export const restoreSysCode = async (
    codeId: number,
    updatedBy: number
) => {
    const affectedRows = await sysCodeRepository.restoreSysCode(codeId, updatedBy);

    if(affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Sys Code ID: ${codeId}`, 404);
    }
};