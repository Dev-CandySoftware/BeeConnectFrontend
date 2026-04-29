import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/AsyncPageFeedback";
import { getAuditLogsData } from "../api/auditLog";
import type { AuditLogEntry } from "../types/auditLog";
import { usePagedList } from "../hooks/usePagedList";
import { getSessionRole, getSessionToken } from "../auth/session";

const PAGE_SIZE = 25;

function AuditLogPage() {
  const navigate = useNavigate();
  const token = getSessionToken();
  const myRole = getSessionRole();
  const canAccess = Boolean(
    token && (myRole === "SuperAdmin" || myRole === "Manager"),
  );

  const fetchPage = useCallback(
    (page: number, pageSize: number) => getAuditLogsData(page, pageSize),
    [],
  );

  const {
    page,
    setPage,
    items,
    totalCount,
    isLoading,
    error,
    reload: load,
  } = usePagedList<AuditLogEntry>({
    pageSize: PAGE_SIZE,
    enabled: canAccess,
    fetchPage,
  });

  useEffect(() => {
    if (!canAccess) {
      navigate("/", { replace: true });
      return;
    }
  }, [canAccess, navigate]);

  if (!canAccess) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Administrare
          </p>
          <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
            Jurnal de audit
          </h1>
          <p className="mt-2 text-sm text-amber-700">
            Evenimente înregistrate automat (autentificări, modificări
            utilizatori, contacte, ședințe, filiale). Disponibil pentru
            SuperAdmin și Manager.
          </p>
        </div>

        <ErrorBanner message={error} onRetry={load} />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-amber-800">
            {totalCount === 0
              ? "Nicio înregistrare"
              : `${totalCount} înregistrări · pagina ${pageSafe} din ${totalPages}`}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Înapoi
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Înainte
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center text-sm text-amber-700 shadow-sm">
            Se încarcă jurnalul…
          </div>
        ) : items.length === 0 && !error ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-amber-800">
              Nicio intrare în jurnal
            </p>
            <p className="mt-2 text-sm text-amber-600">
              Evenimentele vor apărea aici după acțiuni în aplicație.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-amber-100 bg-amber-50/80 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <tr>
                  <th className="px-4 py-3">Data (UTC)</th>
                  <th className="px-4 py-3">Acțiune</th>
                  <th className="px-4 py-3">Entitate</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Detalii</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {items.map((row, index) => (
                  <tr
                    key={`${row.id}-${row.createdAt}-${index}`}
                    className="align-top text-amber-900"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-amber-700">
                      {new Date(row.createdAt).toLocaleString("ro-RO", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.action}
                    </td>
                    <td className="px-4 py-3">{row.entityType}</td>
                    <td className="px-4 py-3 text-amber-600">
                      {row.entityId ?? "—"}
                    </td>
                    <td className="max-w-[200px] px-4 py-3 break-words text-xs text-amber-700">
                      {row.actorEmail ??
                        (row.actorUserId != null ? `#${row.actorUserId}` : "—")}
                    </td>
                    <td className="max-w-xs px-4 py-3 break-words text-xs text-amber-600">
                      {row.details ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogPage;
