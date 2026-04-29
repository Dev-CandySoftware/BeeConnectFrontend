import type { CreateSedintaDto, Sedinta } from "../../../types/sedinta";
import { readDateText, readNumber, readText, asRecord } from "../core";
import { parsePaged } from "../paged";

export function parseSedinta(raw: unknown): Sedinta | null {
  const source = asRecord(raw);
  if (!source) return null;

  const id = readNumber(source, ["id", "Id"]);
  const userId = readNumber(source, ["userId", "UserId"]);
  const startAt = readDateText(source, ["startAt", "StartAt"]);
  const endAt = readDateText(source, ["endAt", "EndAt"]);
  const createdAt = readDateText(source, ["createdAt", "CreatedAt"]);
  if (id == null || userId == null || !startAt || !endAt || !createdAt) {
    return null;
  }

  const observatii = readText(source, ["observatii", "Observatii"]);
  return {
    id,
    userId,
    numeConsultant: readText(source, ["numeConsultant", "NumeConsultant"]) ?? "",
    startAt,
    endAt,
    createdAt,
    observatii: observatii ?? undefined,
  };
}

export function parseSedintePage(raw: unknown, pageSizeDefault: number) {
  return parsePaged(raw, parseSedinta, { pageSizeDefault });
}

export function parseEditableSedinta(raw: unknown): CreateSedintaDto | null {
  const source = asRecord(raw);
  if (!source) return null;

  const userId = readNumber(source, ["userId", "UserId"]);
  const startAt = readDateText(source, ["startAt", "StartAt"]);
  const endAt = readDateText(source, ["endAt", "EndAt"]);
  if (userId == null || !startAt || !endAt) return null;

  return {
    userId,
    numeConsultant: readText(source, ["numeConsultant", "NumeConsultant"]) ?? "",
    startAt,
    endAt,
    observatii: readText(source, ["observatii", "Observatii"]),
  };
}
