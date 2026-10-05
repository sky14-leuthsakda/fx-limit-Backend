import * as orgRepository from "./organization.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
    CreateBranchInput,
    UpdateBranchInput,
    CreateUnitInput,
    UpdateUnitInput
} from "./organization.schema.js";

// ============================== BRANCHES =============================

export const createNewBranch = async (
    data: CreateBranchInput,
    createdBy: number
) => {
    try {
        const branchId = await orgRepository.createBranch(
            data.branchCode,
            data.branchNameEn,
            data.branchNameLo,
            createdBy
        );

        return await orgRepository.findBranchById(branchId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("ລະຫັດສາຂານີ້ມີຢູ່ແລ້ວ", 409);
        }
        throw err;
    }
};

export const getAllBranches = async () => {
    return await orgRepository.findAllBranches();
};

export const getPaginatedBranches = async (
    page: number,
    limit: number
) => {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

    const {
        branches,
        total_records,
    } = await orgRepository.findBranchesPaginated(safePage, safeLimit);

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        branches,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages
        }
    };
};

export const getBranchById = async (branchId: number) => {
    const branch = await orgRepository.findBranchById(branchId);

    if (!branch) {
        throw new AppError(`ບໍ່ພົບສາຂາ ID: ${branchId}`, 404);
    }

    return branch;
};

export const updateExistingBranch = async (
    branchId: number,
    data: UpdateBranchInput,
    updatedBy: number
) => {
    const existingBranch = await getBranchById(branchId);

    try {
        const affectedRows = await orgRepository.updateBranch(
            branchId,
            data.branchCode ?? existingBranch.branch_code,
            data.branchNameEn ?? existingBranch.branch_name_en,
            data.branchNameLo ?? existingBranch.branch_name_lo,
            data.isActive ?? Boolean(existingBranch.is_active),
            updatedBy
        );

        if (affectedRows === 0) {
            throw new AppError("ບໍ່ສາມາດແກ້ໄຂ Branch ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)", 400);
        }
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("Branch Code ນີ້ມີຢູ່ແລ້ວ", 409);
        }
        throw err;
    }

    return await orgRepository.findBranchById(branchId);
};

export const softDeleteBranch = async (
    branchId: number,
    deletedBy: number
) => {
    await getBranchById(branchId);

    const unitsUnderBranch = await orgRepository.findUnitByBranch(branchId);
    if (unitsUnderBranch.length > 0) {
        throw new AppError("ບໍ່ສາມາດລຶບ Branch ນີ້ໄດ້ ເນື່ອງຈາກຍັງມີ Unit ຢູ່ພາຍໃຕ້ ກະລຸນາລຶບ Unit ກ່ອນ", 400);
    }

    const affectedRows = await orgRepository.softDeleteBranch(branchId, deletedBy);
    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Branch ID: ${branchId} ຫລື ອາດຖືກປິດໃຊ້ໄປແລ້ວ`, 404);
    }
};

export const restoreBranch = async (
    branchId: number,
    updatedBy: number
) => {
    const affectedRows = await orgRepository.restoreBranch(branchId, updatedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Branch ID: ${branchId} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້`, 404);
    }
};

// ============================== UNITS ===============================

export const createNewUnit = async (
    data: CreateUnitInput,
    createdBy: number
) => {
    const parentBranch = await orgRepository.findBranchById(data.branchId);
    if (!parentBranch) {
        throw new AppError(`ບໍ່ພົບ Branch ID: ${data.branchId}`, 404);
    }

    try {
        const unitId = await orgRepository.createUnit(
            data.branchId,
            data.unitCode,
            data.unitNameEn,
            data.unitNameLo,
            createdBy
        );

        return await orgRepository.findUnitById(unitId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("Unit Code ນີ້ມີຢູ່ແລ້ວໃນ Branch ນີ້", 409);
        }
        throw err;
    }
};

export const getUnitsByBranch = async (branchId: number) => {
    await getBranchById(branchId); 
    return await orgRepository.findUnitByBranch(branchId);
};

export const getAllUnits = async () => {
    return await orgRepository.findAllUnits();
};

export const getPaginatedUnit = async (
    page: number,
    limit: number
) => {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

    const {
        units,
        total_records,
    } = await orgRepository.findUnitsPaginated(safePage, safeLimit);

    const totalPages = Math.ceil(total_records / safeLimit);

    return {
        units,
        pagination: {
            currentPage: safePage,
            limit: safeLimit,
            totalItems: total_records,
            totalPages
        }
    };
};

export const getUnitById = async (unitId: number) => {
    const unit = await orgRepository.findUnitById(unitId);

    if (!unit) {
        throw new AppError(`ບໍ່ພົບ Unit ID: ${unitId}`, 404);
    }

    return unit;
};

export const updateExistingUnit = async (
    unitId: number,
    data: UpdateUnitInput,
    updatedBy: number
) => {
    const existingUnit = await getUnitById(unitId);

    const targetBranchId = data.branchId ?? existingUnit.branch_id;
    if (data.branchId !== undefined) {
        const targetBranch = await orgRepository.findBranchById(data.branchId);

        if (!targetBranch) {
            throw new AppError(`ບໍ່ພົບ Branch ID: ${data.branchId}`, 404);
        }
    }

    try {
        const affectedRows = await orgRepository.updateUnit(
            unitId,
            targetBranchId,
            data.unitCode ?? existingUnit.unit_code,
            data.unitNameEn ?? existingUnit.unit_name_en,
            data.unitNameLo ?? existingUnit.unit_name_lo,
            data.isActive ?? Boolean(existingUnit.is_active),
            updatedBy
        );

        if (affectedRows === 0) {
            throw new AppError(`ບໍ່ສາມາດແກ້ໄຂ Unit ໄດ້ (ອາດຖືກລົບໄປແລ້ວ)`, 400);
        }
    } catch (err: any) {
        if (err.errno === 1062) {
            throw new AppError("Unit Code ນີ້ມີຢູ່ແລ້ວໃນສາຂານີ້", 409);
        }
        throw err;
    }

    return await orgRepository.findUnitById(unitId);
};

export const softDeleteUnit = async (
    unitId: number,
    deletedBy: number
) => {
    const affectedRows = await orgRepository.softDeleteUnit(unitId, deletedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Unit ID: ${unitId} ຫລື ອາດຖືກປິດໃຊ້ໄປແລ້ວ`, 404);
    }
};

export const restoreUnit = async (
    unitId: number,
    updatedBy: number
) => {
    const affectedRows = await orgRepository.restoreUnit(unitId, updatedBy);

    if (affectedRows === 0) {
        throw new AppError(`ບໍ່ພົບ Unit ID: ${unitId} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້`, 404);
    }
};