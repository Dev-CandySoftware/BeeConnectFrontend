import type { AuditLogEntry, AuditLogPageDto } from "../../../types/auditLog";
import { asRecord, readNumber, readText, readValue } from "../core";
import { parsePaged } from "../paged";

export function parseAuditLogEntry(raw: unknown): AuditLogEntry | null {
  const source = asRecord(raw);
  if (!source) return null;

  const id = readNumber(source, ["id", "Id"]);
  const createdAt = readText(source, ["createdAt", "CreatedAt", "createdAtUtc"]);
  const action = readText(source, ["action", "Action"]);
  const entityType = readText(source, ["entityType", "EntityType"]);
  if (id == null || !createdAt || !action || !entityType) {
    return null;
  }

  const user = asRecord(readValue(source, ["user"])) ?? {};
  return {
    id,
    createdAt,
    action,
    entityType,
    entityId: readNumber(source, ["entityId"]),
    details: readText(source, ["details"]),
    actorUserId: readNumber(user, ["id"]),
    actorEmail: readText(user, ["email"]),
  };
}

export function parseAuditLogPage(
  raw: unknown,
  pageSizeDefault: number,
): AuditLogPageDto | null {
  return parsePaged(raw, parseAuditLogEntry, { pageSizeDefault });
}
