import type { UpdateUserDto } from "../types/user";
import { API_BASE_URL, getAuthHeaders } from "./index";
import { requestJson, requestVoid, type ApiResult } from "./request";
import { parseTeamPage, type TeamMember } from "./parsers/entities/team";
import { parseUpdateMeResponse, type UpdateMeResponse } from "./parsers/entities/user";

export const getUsers = async () => {
  return fetch(`${API_BASE_URL}/User`, { headers: getAuthHeaders() });
};

export const getUserById = async (id: number) => {
  return fetch(`${API_BASE_URL}/User/${id}`, { headers: getAuthHeaders() });
};

export const getMyTeam = async () => {
  return fetch(`${API_BASE_URL}/User/me/team`, { headers: getAuthHeaders() });
};

export const getMyTeamPaged = async (page = 1, pageSize = 10) => {
  return fetch(`${API_BASE_URL}/User/me/team/paged?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeaders(),
  });
};

export const getMyTeamPagedData = async (
  page = 1,
  pageSize = 10,
): Promise<
  ApiResult<{ items: TeamMember[]; totalCount: number; page: number; pageSize: number }>
> =>
  requestJson(() => getMyTeamPaged(page, pageSize), {
    parse: (raw) => parseTeamPage(raw, pageSize),
  });

export const updateMe = async (data: {
  nume?: string;
  prenume?: string;
  email?: string;
}) => {
  return fetch(`${API_BASE_URL}/User/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateMeData = async (data: {
  nume?: string;
  prenume?: string;
  email?: string;
}): Promise<ApiResult<UpdateMeResponse>> =>
  requestJson(() => updateMe(data), {
    parse: parseUpdateMeResponse,
  });

export const updateUser = async (id: number, data: UpdateUserDto) => {
  return fetch(`${API_BASE_URL}/User/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number) => {
  return fetch(`${API_BASE_URL}/User/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const deleteUserData = async (id: number): Promise<ApiResult<null>> =>
  requestVoid(() => deleteUser(id));
