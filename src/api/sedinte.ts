import { API_BASE_URL, getAuthHeaders } from "./index";
import { type CreateSedintaDto } from "../types/sedinta";
import { requestJson, requestVoid, type ApiResult } from "./request";
import { parseEditableSedinta, parseSedintePage } from "./parsers/entities/sedinta";
import type { Sedinta } from "../types/sedinta";

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
