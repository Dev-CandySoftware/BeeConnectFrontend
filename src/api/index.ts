import { getSessionToken } from "../auth/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL nu este setat în .env");
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getAuthHeaders = () => {
  const token = getSessionToken();

  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Token expirat.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export { API_BASE_URL };
export * from "./auth";
export * from "./branches";
export * from "./sedinte";
export * from "./users";
export * from "./clients";
export * from "./auditLog";
