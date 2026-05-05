import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Client } from "../types/client";
import { getClientsByUserIdPagedData, deleteClientData } from "../api/clients";
import { AsyncListStatus, ErrorBanner } from "../components/AsyncPageFeedback";
import { Button } from "../components/Button";
import { ListPagination } from "../components/ListPagination";
import { getSessionUserId } from "../auth/session";
import ContactGrid from "../components/contacte/ContactGrid";
import { usePagedList } from "../hooks/usePagedList";

const PAGE_SIZE = 9;

function ContactPage({ overrideUserId, overrideName }: { 
  overrideUserId?: number;
  overrideName?: string;
}) {
  const navigate = useNavigate();
  const userId = overrideUserId ?? getSessionUserId();
  const [deleteError, setDeleteError] = useState("");
  const fetchPage = useCallback(
    (page: number, pageSize: number) => {
      if (userId == null) {
        return Promise.reject(new Error("User not authenticated."));
      }
      return getClientsByUserIdPagedData(userId, page, pageSize);
    },
    [userId],
  );

  const {
    page,
    setPage,
    items,
    totalCount,
    isLoading,
    error,
    reload: load,
  } = usePagedList<Client>({
    pageSize: PAGE_SIZE,
    enabled: userId != null,
    fetchPage,
  });

  if (userId == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-amber-800">
            Trebuie să fii autentificat pentru a vedea contactele.
          </p>
          <Button
            variant="primarySoft"
            size="md"
            className="mt-4"
            onClick={() => navigate("/login")}
          >
            Mergi la autentificare
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    setDeleteError("");
    const result = await deleteClientData(id);
    if (!result.ok) {
      setDeleteError(result.error);
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
                Administrare contacte
              </p>
              <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
                Contacte {overrideName ? `- ${overrideName}` : ""}
              </h1>
              <p className="mt-2 text-sm text-amber-700">
                Vezi rapid toate detaliile și gestionează fiecare contact.
              </p>
            </div>
            <Button shadow size="sm" onClick={() => navigate(
                    overrideUserId ? `/contact/add/${overrideUserId}` : "/contact/add"
            )}>
              Adaugă contact
            </Button>
          </div>
        </div>
      </div>

      <ErrorBanner message={deleteError} />

      <div className="mx-auto w-full max-w-7xl">
        <ListPagination
          className="mb-4"
          page={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          isLoading={isLoading}
          onPageChange={setPage}
          entityLabel="contacte"
        />
      </div>

      <AsyncListStatus
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && items.length === 0}
        onRetry={load}
        loadingLabel="Se încarcă contactele..."
        empty={{
          title: "Niciun contact disponibil",
          description: "Adaugă primul contact pentru a începe.",
          action: {
            label: "Adaugă contact",
            onClick: () => navigate(
                    overrideUserId ? `/contact/add/${overrideUserId}` : "/contact/add"
            ),
          },
        }}
      >
        <ContactGrid
          items={items}
          onEdit={(id) => navigate(`/contact/edit/${id}`)}
          onDelete={handleDelete}
        />
      </AsyncListStatus>
    </div>
  );
}

export default ContactPage;
