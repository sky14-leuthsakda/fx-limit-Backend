export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  full_name: string;
  branch_id: number;
  unit_id: number | null;
  is_active: boolean;
  created_at: boolean;
  updated_at: Date;
}

export interface UserWithPermissions extends User {
  roles: string[];
  permissions: string[];
}