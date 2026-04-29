import { asRecord, readNumber, readText, readValue } from "../core";

export type LoginResponse = {
  token: string;
  id: number;
  nume: string;
  prenume: string;
  email: string;
  role: string;
  branchId: number;
  isLicenseActive: boolean;
  licenseType: "trial" | "paid" | "expired";
  licenseExpiryDate: string | null;
};

export function parseLoginResponse(raw: unknown): LoginResponse | null {
  const source = asRecord(raw);
  if (!source) return null;

  const token = readText(source, ["token"]);
  const id = readNumber(source, ["id"]);
  const role = readText(source, ["role"]);
  const branchId = readNumber(source, ["branchId"]);
  const isLicenseActive = readValue(source, ["isLicenseActive"]);
  const rawLicenseType = readText(source, ["licenseType"]);
  const licenseExpiryDate = readText(source, ["licenseExpiryDate"]) ?? null;
  if (
    !token ||
    id == null ||
    !role ||
    branchId == null ||
    typeof isLicenseActive !== "boolean"
  ) {
    return null;
  }

  const licenseType =
    rawLicenseType === "trial" || rawLicenseType === "paid" || rawLicenseType === "expired"
      ? rawLicenseType
      : "expired";

  return {
    token,
    id,
    role,
    branchId,
    isLicenseActive,
    licenseType,
    licenseExpiryDate,
    nume: readText(source, ["nume"]) ?? "",
    prenume: readText(source, ["prenume"]) ?? "",
    email: readText(source, ["email"]) ?? "",
  };
}

export type InviteValidationResponse = { valid: boolean };

export function parseInviteValidationResponse(
  raw: unknown,
): InviteValidationResponse | null {
  const source = asRecord(raw);
  if (!source) return null;
  const valid = readValue(source, ["valid"]);
  return typeof valid === "boolean" ? { valid } : null;
}

export type InviteCodeResponse = { inviteCode: string };

export function parseInviteCodeResponse(raw: unknown): InviteCodeResponse | null {
  const source = asRecord(raw);
  if (!source) return null;
  const inviteCode = readText(source, ["inviteCode"]);
  return inviteCode ? { inviteCode } : null;
}
