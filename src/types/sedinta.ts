export interface Sedinta {
  id: number;
  userId: number;
  numeConsultant: string;
  startAt: string;
  endAt: string;
  observatii?: string;
  createdAt: string;
  isTeamMeeting?: boolean;
  managerId?: number;
}

export interface CreateSedintaDto {
  userId: number;
  numeConsultant: string;
  startAt: string;
  endAt: string;
  observatii?: string;
}

export interface TeamMeetingDto {
  startAt: string;
  endAt: string;
  observatii?: string | null;
  participantIds: number[];
}
