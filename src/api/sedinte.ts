import { API_BASE_URL, getAuthHeaders } from "./index";
import { type CreateSedintaDto } from "../types/sedinta";
import { requestJson, requestVoid, type ApiResult } from "./request";
import { parseEditableSedinta, parseSedinta, parseSedintePage } from "./parsers/entities/sedinta";
import type { Sedinta, TeamMeetingDto } from "../types/sedinta";

export const getSedinte = async () => {
  const response = await fetch(`${API_BASE_URL}/sedinte`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return response;
};
export const getSedintePaged = async (page: number, pageSize: number) => {
  return fetch(
    `${API_BASE_URL}/sedinte/paged?page=${page}&pageSize=${pageSize}`,
    {
      headers: getAuthHeaders(),
    },
  );
};

export const getSedintePagedData = async (
  page: number,
  pageSize: number,
): Promise<ApiResult<{ items: Sedinta[]; totalCount: number; page: number; pageSize: number }>> =>
  requestJson(() => getSedintePaged(page, pageSize), {
    parse: (raw) => parseSedintePage(raw, pageSize),
  });

export const getSedintaById = async (id: number) => {
  return fetch(`${API_BASE_URL}/sedinte/${id}`, { headers: getAuthHeaders() });
};

export const getEditableSedintaByIdData = async (
  id: number,
): Promise<ApiResult<CreateSedintaDto>> =>
  requestJson(() => getSedintaById(id), {
    parse: parseEditableSedinta,
  });

export const createSedinta = async (data: CreateSedintaDto) => {
  return fetch(`${API_BASE_URL}/sedinte`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};
export const updateSedinta = async (id: number, data: CreateSedintaDto) => {
  return fetch(`${API_BASE_URL}/sedinte/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};
export const deleteSedinta = async (id: number) => {
  return fetch(`${API_BASE_URL}/sedinte/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const createSedintaData = async (
  data: CreateSedintaDto,
): Promise<ApiResult<null>> => requestVoid(() => createSedinta(data));

export const updateSedintaData = async (
  id: number,
  data: CreateSedintaDto,
): Promise<ApiResult<null>> => requestVoid(() => updateSedinta(id, data));

export const deleteSedintaData = async (id: number): Promise<ApiResult<null>> =>
  requestVoid(() => deleteSedinta(id));

export const getSedinteByUserId = async (userId: number) =>
  fetch(`${API_BASE_URL}/sedinte/user/${userId}`, { headers: getAuthHeaders() });

export const getSedinteMyTeam = async () =>
  fetch(`${API_BASE_URL}/sedinte/my-team`, { headers: getAuthHeaders() });

export const createTeamMeeting = async (data: TeamMeetingDto) =>
  fetch(`${API_BASE_URL}/sedinte/team-meeting`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const getSedinteByUserIdData = async (
  userId: number,
): Promise<ApiResult<Sedinta[]>> =>
  requestJson(() => getSedinteByUserId(userId), {
    parse: (raw) => {
      if (!Array.isArray(raw)) return null;
      const items = raw.map(parseSedinta).filter((x): x is Sedinta => x != null);
      return items;
    },
  });

export const getSedinteMyTeamData = async (): Promise<ApiResult<Sedinta[]>> =>
  requestJson(() => getSedinteMyTeam(), {
    parse: (raw) => {
      if (!Array.isArray(raw)) return null;
      return raw.map(parseSedinta).filter((x): x is Sedinta => x != null);
    },
  });
  
  
  export const createTeamMeetingData = async (
    data: TeamMeetingDto,
  ): Promise<ApiResult<null>> => requestVoid(() => createTeamMeeting(data));

  export const getSedinteAll = async () =>
    fetch(`${API_BASE_URL}/sedinte`, { headers: getAuthHeaders() });
  
  export const getSedinteAllData = async (): Promise<ApiResult<Sedinta[]>> =>
    requestJson(() => getSedinteAll(), {
      parse: (raw) => {
        if (!Array.isArray(raw)) return null;
        return raw.map(parseSedinta).filter((x): x is Sedinta => x != null);
      },
    });