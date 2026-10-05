import * as customerRepository from "./customers.repository.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers.schema.js";

const MYSQL_DUP_ENTRY = 1062;

const getErrno = (err: unknown) => (err as { errno?: number }).errno;

const duplicateMessage = (idCode: string) =>
  `ລູກຄ້າທີ່ມີເລກທີເອກະສານ "${idCode}" ສຳລັບປະເພດເອກະສານນີ້ ມີຢູ່ແລ້ວ`;

// ============================ Create ============================

export const createNewCustomer = async (
  data: CreateCustomerInput,
  createdBy: number
) => {
  try {
    const customerId = await customerRepository.createCustomer(
      data.idTypeId,
      data.idCode,
      data.firstNameEn,
      data.lastNameEn,
      data.firstNameLo,
      data.lastNameLo,
      data.dateOfBirth,
      data.isForeigner,
      data.genderId,
      data.phoneNumber,
      data.address,
      createdBy
    );

    return await customerRepository.findCustomerById(customerId);
  } catch (err) {
    if (getErrno(err) === MYSQL_DUP_ENTRY) {
      throw new AppError(duplicateMessage(data.idCode), 409);
    }
    throw err;
  }
};

// ============================ Get ============================

export const getAllCustomers = async () => {
  return await customerRepository.findAllCustomers();
};

export const getCustomersPaginated = async (
    page: number, 
    limit: number
) => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

  const { customers, total_records } = await customerRepository.findCustomersPaginated(
    safePage,
    safeLimit
  );

  const totalPages = Math.ceil(total_records / safeLimit);

  return {
    customers,
    pagination: {
      currentPage: safePage,
      limit: safeLimit,
      totalItems: total_records,
      totalPages,
    },
  };
};

// Customer By Id — single source of truth ສຳລັບ "ມີຢູ່ບໍ່"
export const getCustomerById = async (customerId: number) => {
  const customer = await customerRepository.findCustomerById(customerId);

  if (!customer) {
    throw new AppError(`ບໍ່ພົບລູກຄ້າ ID: ${customerId}`, 404);
  }

  return customer;
};


export const findCustomerByIdCode = async (idTypeId: number, idCode: string) => {
  return await customerRepository.findCustomerByIdCode(idTypeId, idCode);
};

// ============================ Update ============================

export const updateExistingCustomer = async (
  customerId: number,
  data: UpdateCustomerInput,
  updatedBy: number
) => {
  const existing = await getCustomerById(customerId);

  const merged = {
    idTypeId: data.idTypeId ?? existing.id_type_id,
    idCode: data.idCode ?? existing.id_code,
    firstNameEn: data.firstNameEn ?? existing.first_name_en,
    lastNameEn: data.lastNameEn ?? existing.last_name_en,
    firstNameLo: data.firstNameLo ?? existing.first_name_lo,
    lastNameLo: data.lastNameLo ?? existing.last_name_lo,
    dateOfBirth: data.dateOfBirth ?? existing.date_of_birth,
    isForeigner: typeof data.isForeigner === "boolean" ? data.isForeigner : !!existing.is_foreigner,
    genderId: data.genderId ?? existing.gender_id,
    phoneNumber: data.phoneNumber ?? existing.phone_number,
    address: data.address ?? existing.address,
    isActive: data.isActive ?? existing.is_active,
  };

  if (merged.isForeigner) {
    if (!merged.firstNameEn || !merged.lastNameEn) {
      throw new AppError(
        "ລູກຄ້າຕ່າງປະເທດຕ້ອງມີຊື່ ແລະ ນາມສະກຸນພາສາອັງກິດ",
        400
      );
    }
  } else {
    if (!merged.firstNameLo || !merged.lastNameLo) {
      throw new AppError("ລູກຄ້າຕ້ອງມີຊື່ ແລະ ນາມສະກຸນພາສາລາວ", 400);
    }
  }

  let affectedRows: number;

  try {
    affectedRows = await customerRepository.updateCustomer(
      customerId,
      merged.idTypeId,
      merged.idCode,
      merged.firstNameEn,
      merged.lastNameEn,
      merged.firstNameLo,
      merged.lastNameLo,
      merged.dateOfBirth,
      merged.isForeigner ? 1 : 0,
      merged.genderId,
      merged.phoneNumber,
      merged.address,
      merged.isActive,
      updatedBy
    );
  } catch (err) {
    if (getErrno(err) === MYSQL_DUP_ENTRY) {
      throw new AppError(duplicateMessage(merged.idCode), 409);
    }
    throw err;
  }

  if (affectedRows === 0) {
    throw new AppError(
      "ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນລູກຄ້າໄດ້ (ອາດຖືກລົບໄປແລ້ວ)",
      400
    );
  }

  return await customerRepository.findCustomerById(customerId);
};

// ============================ Soft Delete / Restore ============================

export const softDeleteCustomer = async (
    customerId: number, 
    deletedBy: number
) => {
  const affectedRows = await customerRepository.softDeleteCustomer(
    customerId,
    deletedBy
  );

  if (affectedRows === 0) {
    throw new AppError(
      `ບໍ່ພົບລູກຄ້າ ID: ${customerId} ຫລື ອາດຖືກປິດໃຊ້ໄປແລ້ວ`,
      404
    );
  }
};

export const restoreCustomer = async (
    customerId: number, 
    updatedBy: number
) => {
  const affectedRows = await customerRepository.restoreCustomer(
    customerId,
    updatedBy
  );

  if (affectedRows === 0) {
    throw new AppError(
      `ບໍ່ພົບລູກຄ້າ ID: ${customerId} ຫລື ບໍ່ໄດ້ຖືກປິດໃຊ້`,
      404
    );
  }
};