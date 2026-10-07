import pool from "../../connector/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export const createCustomer = async (
    idTypeId: number,
    idCode: string,
    firstNameEn: string | undefined,
    lastNameEn: string | undefined,
    firstNameLo: string | undefined,
    lastNameLo: string | undefined,
    dateOfBirth: string | undefined,
    isForeigner: boolean,
    genderId: number | undefined,
    phoneNumber: string | undefined,
    address: string | undefined,
    createdBy: number
): Promise<number> => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            idTypeId,
            idCode,
            firstNameEn ?? null,
            lastNameEn ?? null,
            firstNameLo ?? null,
            lastNameLo ?? null,
            dateOfBirth ?? null,
            isForeigner ? 1 : 0,
            genderId ?? null,
            phoneNumber ?? null,
            address ?? null,
            createdBy,
        ]
    );

    return result[0]?.[0]?.customer_id ?? 0;
};

export const findAllCustomers = async () => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_get_all()"
    );

    return result[0] ?? [];
};

export const findCustomersPaginated = async (
    page: number, 
    limit: number
) => {
    const [results] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_get_paginated(?, ?)",
        [page, limit]
    );

    return {
        customers: results[0] ?? [],
        total_records: results[1]?.[0]?.total_records ?? 0,
    };
};

export const findCustomerById = async (customerId: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_get_by_id(?)",
        [customerId]
    );

    return result[0]?.[0] ?? null;
};

export const findCustomerByIdCode = async (
    idTypeId: number, 
    idCode: string
) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_find_by_id_code(?, ?)",
        [idTypeId, idCode]
    );

    return result[0]?.[0] ?? null;
};

// Customer Lookup 
export const searchCustomersByName = async (name: string, limit: number) => {
    const [result] = await pool.query<RowDataPacket[][]>(
        "CALL sp_customers_search_by_name(?, ?)",
        [name, limit]
    );

    return result[0] ?? [];
};

// Update Customer
export const updateCustomer = async (
    customerId: number,
    idTypeId: number,
    idCode: string,
    firstNameEn: string | null,
    lastNameEn: string | null,
    firstNameLo: string | null,
    lastNameLo: string | null,
    dateOfBirth: string | null,
    isForeigner: number,
    genderId: number | null,
    phoneNumber: string | null,
    address: string | null,
    isActive: number,
    updatedBy: number
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_customers_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            customerId,
            idTypeId,
            idCode,
            firstNameEn,
            lastNameEn,
            firstNameLo,
            lastNameLo,
            dateOfBirth,
            isForeigner,
            genderId,
            phoneNumber,
            address,
            isActive,
            updatedBy,
        ]
    );

    return result.affectedRows ?? 1;
};

// Soft Delete Customer
export const softDeleteCustomer = async (
    customerId: number, 
    deletedBy: number
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_customers_soft_delete(?, ?)",
        [customerId, deletedBy]
    );

    return result.affectedRows ?? 1;
};

// Restore Customer
export const restoreCustomer = async (
    customerId: number, 
    updatedBy: number
): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        "CALL sp_customers_restore(?, ?)",
        [customerId, updatedBy]
    );

    return result.affectedRows ?? 1;
};