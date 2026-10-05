export interface Role {
    role_id: number;
    role_name: string;
    description: string | null;
}

export interface Permission {
    permission_id: number;
    permission_code: string;
    description: string | null;
}