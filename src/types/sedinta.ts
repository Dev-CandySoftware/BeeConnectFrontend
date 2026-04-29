export interface Sedinta {
  id: number;
  userId: number;
  numeConsultant: string;
  startAt: string;
  endAt: string;
  observatii?: string;
  createdAt: string;
}

export interface CreateSedintaDto {
  userId: number;
  numeConsultant: string;
  startAt: string;
  endAt: string;
  observatii?: string;
}
