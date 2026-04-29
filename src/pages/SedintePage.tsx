import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Sedinta } from "../types/sedinta";
import { AsyncListStatus, ErrorBanner } from "../components/AsyncPageFeedback";
import { Button } from "../components/Button";
import { ListPagination } from "../components/ListPagination";
import { deleteSedintaData, getSedintePagedData } from "../api/sedinte";
import { usePagedList } from "../hooks/usePagedList";
import { getSessionUserId } from "../auth/session";
import SedinteGrid from "../components/sedinte/SedinteGrid";

const PAGE_SIZE = 9;

function SedintePage() {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState("");

  const myUserId = getSessionUserId();
  const canManageSedinta = (s: Sedinta) =>
    myUserId != null && s.userId === myUserId;

  const fetchPage = useCallback(
    (page: number, pageSize: number) => getSedintePagedData(page, pageSize),
    [],
  );

  const {
    page,
    setPage,
    items,
    totalCount,
    isLoading,
    error: loadError,
    reload: load,
  } = usePagedList<Sedinta>({
    pageSize: PAGE_SIZE,
    fetchPage,
  });

  const handleDelete = async (id: number) => {
    setActionError("");
    const result = await deleteSedintaData(id);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    void load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Organizare ședințe
              </p>
              <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
                Ședințe
              </h1>
              <p className="mt-2 text-sm text-amber-700">
                Vezi consultantul, intervalul rezervat și observațiile fiecărei
                ședințe.
              </p>
            </div>
            <Button shadow size="sm" onClick={() => navigate("/sedinte/add")}>
              Adaugă ședință
            </Button>
          </div>
        </div>
      </div>

      <ErrorBanner message={actionError} />

      <div className="mx-auto w-full max-w-7xl">
        <ListPagination
          className="mb-4"
          page={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          isLoading={isLoading}
          onPageChange={setPage}
          entityLabel="ședințe"
        />
      </div>

      <AsyncListStatus
        isLoading={isLoading}
        error={loadError}
        isEmpty={!isLoading && !loadError && items.length === 0}
        onRetry={load}
        loadingLabel="Se încarcă ședințele..."
        empty={{
          title: "Nicio ședință disponibilă",
        }}
      >
        <SedinteGrid
          items={items}
          canManageSedinta={canManageSedinta}
          onEdit={(id) => navigate(`/sedinte/edit/${id}`)}
          onDelete={handleDelete}
        />
      </AsyncListStatus>
    </div>
  );
}

export default SedintePage;
