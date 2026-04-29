export interface Branch {
  id: number;
  nume: string;
  oras: string;
  numarAngajati?: number;
}

export interface CreateBranchDto {
  nume: string;
  oras: string;
}
