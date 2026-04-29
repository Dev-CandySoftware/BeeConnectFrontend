export function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

export function readValue(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    if (key in source) return source[key];
  }
  return undefined;
}

export function readArray(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown[] | undefined {
  const value = readValue(source, keys);
  return Array.isArray(value) ? value : undefined;
}

export function readNumber(
  source: Record<string, unknown>,
  keys: readonly string[],
): number | undefined {
  const value = readValue(source, keys);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function readText(
  source: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  const value = readValue(source, keys);
  if (typeof value === "string") return value;
  if (value == null) return undefined;
  return String(value);
}

export function readDateText(
  source: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  const value = readValue(source, keys);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (value instanceof Date) return value.toISOString();
  if (value == null) return undefined;
  const parsed = String(value);
  return parsed.trim() ? parsed : undefined;
}
