export interface Client {
  id: number;
  userId: number;
  branchId: number;
  nume: string;
  prenume: string;
  email: string;
  phoneNumber: string;
  sursa: string;
  venit: string;
  varsta: string;
  ocupatie: string;
  stareCivila: string;
  numarCopii: string;
  deCandCunoscPersoana: string;
  catDeBineCunoscPersoana: string;
  frecventaIntalniriAnuala: string;
  infoContact: string;
  esteFurnizorReferinte: string;
  status: string;
  observatii: string;
  createdAt: string;
  dataContract?: string;
}

export interface CreateClientDto {
  nume: string;
  prenume: string;
  email: string;
  phoneNumber: string;
  sursa: string;
  venit: string;
  varsta: string;
  ocupatie: string;
  stareCivila: string;
  numarCopii: string;
  deCandCunoscPersoana: string;
  catDeBineCunoscPersoana: string;
  frecventaIntalniriAnuala: string;
  infoContact: string;
  esteFurnizorReferinte: string;
  status: string;
  observatii: string;
  userId: number;
  branchId: number;
  dataContract?: string;
}
