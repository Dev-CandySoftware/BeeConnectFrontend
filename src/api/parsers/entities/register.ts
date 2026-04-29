import { asRecord, readNumber, readText } from "../core";
import type { Branch } from "../../../types/branch";

export type RegisterResponse = { id: number; inviteCode: string };

export function parseBranch(raw: unknown): Branch | null {
  const source = asRecord(raw);
  if (!source) return null;
  const id = readNumber(source, ["id", "Id"]);
  if (id == null || id <= 0) return null;
  return {
    id,
    nume: readText(source, ["nume", "Nume"]) ?? "",
    oras: readText(source, ["oras", "Oras"]) ?? "",
  };
}

export function parseBranches(raw: unknown): Branch[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.map(parseBranch).filter((b): b is Branch => b != null);
}

export function parseRegisterResponse(raw: unknown): RegisterResponse | null {
  const source = asRecord(raw);
  if (!source) return null;
  const id = readNumber(source, ["id", "Id"]);
  const inviteCode = readText(source, ["inviteCode", "InviteCode"]);
  if (id == null || !inviteCode) return null;
  return { id, inviteCode };
}
