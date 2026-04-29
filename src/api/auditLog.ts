import { API_BASE_URL, getAuthHeaders } from "./index";
import { requestJson, type ApiResult } from "./request";
import { parseAuditLogPage } from "./parsers/entities/auditLog";
import type { AuditLogEntry } from "../types/auditLog";

export const getAuditLogs = async (page: number, pageSize: number) => {
  const response = await fetch(
    `${API_BASE_URL}/auditlog?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  return response;
};

export const getAuditLogsData = async (
  page: number,
  pageSize: number,
): Promise<
  ApiResult<{ items: AuditLogEntry[]; totalCount: number; page: number; pageSize: number }>
> =>
  requestJson(() => getAuditLogs(page, pageSize), {
    parse: (raw) => parseAuditLogPage(raw, pageSize),
  });

export const getAuditLogsByUser = async (
  userId: number,
  page = 1,
  pageSize = 50,
) => {
  const response = await fetch(
    `${API_BASE_URL}/auditlog/user/${userId}?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  return response;
};
