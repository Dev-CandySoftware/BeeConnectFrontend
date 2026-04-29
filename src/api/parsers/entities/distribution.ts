import { asRecord } from "../core";

export type DistributionSlice = { name: string; value: number };

export function parseDistributionSlices(raw: unknown): DistributionSlice[] {
  const source = asRecord(raw);
  if (!source) return [];

  return Object.entries(source)
    .map(([name, value]) => {
      const numericValue =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? Number(value)
            : NaN;
      if (!Number.isFinite(numericValue)) return null;
      return { name: name || "Necunoscut", value: numericValue };
    })
    .filter((slice): slice is DistributionSlice => slice != null);
}
