import { API_BASE_URL, getAuthHeaders } from "./index";
import { type CreateClientDto } from "../types/client";
import { requestJson, requestVoid, type ApiResult } from "./request";
import { parseDistributionSlices, type DistributionSlice } from "./parsers/entities/distribution";
import { parseClientPage, parseEditableClient } from "./parsers/entities/client";
import type { Client } from "../types/client";

export const DISTRIBUTION_FIELDS = [
  "income_distribution",
  "age_distribution",
  "Ocupation_distribution",
  "marital_status_distribution",
  "number_of_children",
  "since_i_knew_distribution",
  "how_well_i_knew_distribution",
  "meeting_frequency_distribution",
  "contact_info_distribution",
  "reference_provider_distribution",
] as const;

export type DistributionField = (typeof DISTRIBUTION_FIELDS)[number];

export const getClients = async () =>
  fetch(`${API_BASE_URL}/client`, { headers: getAuthHeaders() });

export const getClientById = async (id: number) =>
  fetch(`${API_BASE_URL}/client/${id}`, { headers: getAuthHeaders() });

export const getClientsByBranchId = async (branchId: number) =>
  fetch(`${API_BASE_URL}/client/branch/${branchId}`, {
    headers: getAuthHeaders(),
  });

export const getClientsByUserId = async (userId: number) =>
  fetch(`${API_BASE_URL}/client/user/${userId}`, { headers: getAuthHeaders() });

export const getClientsByUserIdPaged = async (
  userId: number,
  page = 1,
  pageSize = 9,
) =>
  fetch(
    `${API_BASE_URL}/client/user/${userId}/paged?page=${page}&pageSize=${pageSize}`,
    {
      headers: getAuthHeaders(),
    },
  );

export const getClientsByUserIdPagedData = async (
  userId: number,
  page = 1,
  pageSize = 9,
): Promise<ApiResult<{ items: Client[]; totalCount: number; page: number; pageSize: number }>> =>
  requestJson(() => getClientsByUserIdPaged(userId, page, pageSize), {
    parse: (raw) => parseClientPage(raw, pageSize),
  });

const distributionRoutes: Record<DistributionField, string> = {
  income_distribution: "income_distribution",
  age_distribution: "age_distribution",
  Ocupation_distribution: "Ocupation_distribution",
  marital_status_distribution: "marital_status_distribution",
  number_of_children: "number_of_children",
  since_i_knew_distribution: "since_i_knew_distribution",
  how_well_i_knew_distribution: "how_well_i_knew_distribution",
  meeting_frequency_distribution: "meeting_frequency_distribution",
  contact_info_distribution: "contact_info_distribution",
  reference_provider_distribution: "reference_provider_distribution",
};

export const getDistribution = async (
  field: DistributionField,
  userId: number,
) => {
  const route = distributionRoutes[field];
  return fetch(`${API_BASE_URL}/client/${route}/${userId}`, {
    headers: getAuthHeaders(),
  });
};

export const getDistributionData = async (
  field: DistributionField,
  userId: number,
): Promise<ApiResult<DistributionSlice[]>> =>
  requestJson(() => getDistribution(field, userId), {
    parse: parseDistributionSlices,
  });

export const getEditableClientByIdData = async (
  id: number,
): Promise<ApiResult<CreateClientDto>> =>
  requestJson(() => getClientById(id), {
    parse: parseEditableClient,
  });

export const createClient = async (dto: CreateClientDto) =>
  fetch(`${API_BASE_URL}/client`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

export const updateClient = async (id: number, dto: CreateClientDto) =>
  fetch(`${API_BASE_URL}/client/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

export const deleteClient = async (id: number) =>
  fetch(`${API_BASE_URL}/client/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

export const createClientData = async (
  dto: CreateClientDto,
): Promise<ApiResult<null>> => requestVoid(() => createClient(dto));

export const updateClientData = async (
  id: number,
  dto: CreateClientDto,
): Promise<ApiResult<null>> => requestVoid(() => updateClient(id, dto));

export const deleteClientData = async (id: number): Promise<ApiResult<null>> =>
  requestVoid(() => deleteClient(id));
