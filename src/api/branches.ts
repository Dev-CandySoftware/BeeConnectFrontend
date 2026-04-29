import { API_BASE_URL, getAuthHeaders } from "./index";
import { type CreateBranchDto } from "../types/branch";
import { requestJson, requestVoid, type ApiResult } from "./request";
import { parseBranches } from "./parsers/entities/register";
import type { Branch } from "../types/branch";

export const getBranches = async () => {
  const response = await fetch(`${API_BASE_URL}/branch`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return response;
};

export const getBranchesData = async (): Promise<ApiResult<Branch[]>> =>
  requestJson(() => getBranches(), {
    parse: parseBranches,
  });
export const getBranchById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/branch/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return response;
};
export const createBranch = async (data: CreateBranchDto) => {
  const response = await fetch(`${API_BASE_URL}/branch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response;
};
export const updateBranch = async (id: number, data: CreateBranchDto) => {
  const response = await fetch(`${API_BASE_URL}/branch/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response;
};
export const deleteBranch = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/branch/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response;
};

export const createBranchData = async (
  data: CreateBranchDto,
): Promise<ApiResult<null>> => requestVoid(() => createBranch(data));

export const updateBranchData = async (
  id: number,
  data: CreateBranchDto,
): Promise<ApiResult<null>> => requestVoid(() => updateBranch(id, data));

export const deleteBranchData = async (id: number): Promise<ApiResult<null>> =>
  requestVoid(() => deleteBranch(id));
