import { API_BASE_URL, getAuthHeaders } from "./index";
import { requestJson, requestVoid, type ApiResult } from "./request";
import {
  parseInviteCodeResponse,
  parseInviteValidationResponse,
  parseLoginResponse,
  type InviteCodeResponse,
  type InviteValidationResponse,
  type LoginResponse,
} from "./parsers/entities/auth";
import {
  parseRegisterResponse,
  type RegisterResponse,
} from "./parsers/entities/register";

export const register = async (dto: {
  nume: string;
  prenume: string;
  email: string;
  role: string;
  branchId: number;
  managerId?: number;
  recrutatDeId?: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });
  return response;
};

export const registerUser = async (
  dto: Parameters<typeof register>[0],
): Promise<ApiResult<RegisterResponse>> =>
  requestJson(() => register(dto), {
    parse: parseRegisterResponse,
    fallbackError:
      "Utilizatorul a fost creat, dar răspunsul nu conține codul de invitație.",
  });

export const login = async (
  email: string,
  password: string,
  deviceFingerprint?: string,
) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, deviceFingerprint }),
  });
  return response;
};

export const loginUser = async (
  email: string,
  password: string,
  deviceFingerprint?: string,
): Promise<ApiResult<LoginResponse>> =>
  requestJson(() => login(email, password, deviceFingerprint), {
    parse: parseLoginResponse,
    fallbackError: "Email sau parolă incorectă. Verifică datele introduse.",
  });

export const activate = async (inviteCode: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteCode, password }),
  });
  return response;
};

export const activateAccount = async (
  inviteCode: string,
  password: string,
): Promise<ApiResult<null>> =>
  requestVoid(() => activate(inviteCode, password), "Activarea contului a eșuat.");

export const validateInviteCode = async (inviteCode: string) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/invite/${encodeURIComponent(inviteCode)}/validate`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  return response;
};

export const validateInviteCodeData = async (
  inviteCode: string,
): Promise<ApiResult<InviteValidationResponse>> =>
  requestJson(() => validateInviteCode(inviteCode), {
    parse: parseInviteValidationResponse,
    fallbackError: "Codul nu a putut fi verificat.",
  });

export const requestPasswordReset = async (userId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/${userId}/issue-password-reset`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );
  return response;
};

export const requestPasswordResetData = async (
  userId: number,
): Promise<ApiResult<InviteCodeResponse>> =>
  requestJson(() => requestPasswordReset(userId), {
    parse: parseInviteCodeResponse,
  });
