export interface User {
  id: number;
  nume: string;
  prenume: string;
  email: string;
  role: string;
  status: string;
  inviteCode?: string;
  createdAt: string;
  branchId: number;
  managerId?: number;
  recrutatDeId?: number;
}

export interface CreateUserDto {
  nume: string;
  prenume: string;
  email: string;
  role: string;
  branchId: number;
  managerId?: number;
  recrutatDeId?: number;
}

export interface UpdateUserDto {
  nume?: string;
  prenume?: string;
  email?: string;
}
