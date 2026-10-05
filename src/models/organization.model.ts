export interface Branch {
  branch_id: number;
  branch_code: string;
  branch_name_en: string;
  branch_name_lo: string;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
}

export interface Unit {
    unit_id: number;
    branch_id: number;
    unit_code: string;
    unit_name_en: string;
    unit_name_lo: string;
    is_active: boolean;
    created_by: number | null;
    created_at: string;
    updated_by: number | null;
    updated_at: string | null
}