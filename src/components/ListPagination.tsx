import { Button } from "./Button";

type ListPaginationProps = {
  page: number;
  totalCount: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (nextPage: number) => void;
  entityLabel?: string;
  className?: string;
};

export function ListPagination({
  page,
  totalCount,
  pageSize,
  isLoading = false,
  onPageChange,
  entityLabel = "înregistrări",
  className = "",
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <p className="text-sm text-amber-800">
        {totalCount === 0
          ? `0 ${entityLabel}`
          : `${totalCount} ${entityLabel} · pagina ${safePage} din ${totalPages}`}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={safePage <= 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
        >
          Înapoi
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={safePage >= totalPages || isLoading || totalCount === 0}
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
        >
          Înainte
        </Button>
      </div>
    </div>
  );
}
