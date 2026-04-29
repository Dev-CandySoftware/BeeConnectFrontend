import { asRecord, readArray, readNumber } from "./core";

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

type ItemParser<T> = (raw: unknown) => T | null;

type ParsePagedOptions = {
  pageSizeDefault: number;
  itemKeys?: readonly string[];
  totalKeys?: readonly string[];
  pageKeys?: readonly string[];
  pageSizeKeys?: readonly string[];
};

const DEFAULT_ITEM_KEYS = ["items", "Items", "data", "Data"] as const;
const DEFAULT_TOTAL_KEYS = ["totalCount", "TotalCount", "count", "Count"] as const;
const DEFAULT_PAGE_KEYS = ["page", "Page"] as const;
const DEFAULT_PAGE_SIZE_KEYS = ["pageSize", "PageSize"] as const;

export function parsePaged<T>(
  raw: unknown,
  parseItem: ItemParser<T>,
  options: ParsePagedOptions,
): PagedResult<T> | null {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    const items = raw.map(parseItem).filter((x): x is T => x != null);
    return {
      items,
      totalCount: items.length,
      page: 1,
      pageSize: options.pageSizeDefault,
    };
  }

  const source = asRecord(raw);
  if (!source) return null;

  const itemsRaw = readArray(source, options.itemKeys ?? DEFAULT_ITEM_KEYS);
  if (!itemsRaw) return null;

  const items = itemsRaw.map(parseItem).filter((x): x is T => x != null);
  const fallbackTotal = items.length;
  const totalCount =
    readNumber(source, options.totalKeys ?? DEFAULT_TOTAL_KEYS) ?? fallbackTotal;
  const page = readNumber(source, options.pageKeys ?? DEFAULT_PAGE_KEYS) ?? 1;
  const pageSize =
    readNumber(source, options.pageSizeKeys ?? DEFAULT_PAGE_SIZE_KEYS) ??
    options.pageSizeDefault;

  return { items, totalCount, page, pageSize };
}
