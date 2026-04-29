import { useCallback, useEffect, useState } from "react";
import type { ApiResult } from "../api/request";

type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

type UsePagedListOptions<T> = {
  pageSize: number;
  enabled?: boolean;
  fetchPage: (page: number, pageSize: number) => Promise<ApiResult<PagedResult<T>>>;
};

export function usePagedList<T>({
  pageSize,
  enabled = true,
  fetchPage,
}: UsePagedListOptions<T>) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError("");

    const result = await fetchPage(page, pageSize);
    if (!result.ok) {
      setError(result.error);
      setItems([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    const parsed = result.data;
    if (parsed.items.length === 0 && parsed.totalCount > 0 && page > 1) {
      setPage((current) => Math.max(1, current - 1));
      setIsLoading(false);
      return;
    }

    setItems(parsed.items);
    setTotalCount(parsed.totalCount);
    setIsLoading(false);
  }, [
    enabled,
    fetchPage,
    page,
    pageSize,
  ]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    page,
    setPage,
    items,
    totalCount,
    isLoading,
    error,
    setError,
    reload,
  };
}
