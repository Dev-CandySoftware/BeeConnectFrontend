import { asRecord, readText } from "../core";

export type UpdateMeResponse = {
  nume?: string;
  prenume?: string;
  email?: string;
};

export function parseUpdateMeResponse(raw: unknown): UpdateMeResponse | null {
  const source = asRecord(raw);
  if (!source) return null;
  return {
    nume: readText(source, ["nume"]),
    prenume: readText(source, ["prenume"]),
    email: readText(source, ["email"]),
  };
}
