import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AsyncListStatus, ErrorBanner } from "../components/AsyncPageFeedback";
import { ListPagination } from "../components/ListPagination";
import { deleteUserData, getMyTeamPagedData } from "../api/users";
import { requestPasswordResetData } from "../api";
import { usePagedList } from "../hooks/usePagedList";
import {
  getSessionRole,
  getSessionToken,
  getSessionUserId,
} from "../auth/session";
import {
  type TeamMember,
} from "../api/parsers/entities/team";
import InviteCodeCard from "../components/echipa/InviteCodeCard";
import TeamMembersTable from "../components/echipa/TeamMembersTable";

const PAGE_SIZE = 10;

function EchipaPage() {
  const navigate = useNavigate();
  const token = getSessionToken();
  const myRole = getSessionRole();
  const myUserId = getSessionUserId();
  const canAccess = Boolean(
    token && (myRole === "Manager" || myRole === "SuperAdmin"),
  );

  const [actionError, setActionError] = useState("");
  const [recoveringId, setRecoveringId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [issuedInvite, setIssuedInvite] = useState<{
    forName: string;
    code: string;
  } | null>(null);
  const [copyHint, setCopyHint] = useState("");

  const fetchPage = useCallback(
    (page: number, pageSize: number) => getMyTeamPagedData(page, pageSize),
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
  } = usePagedList<TeamMember>({
    pageSize: PAGE_SIZE,
    enabled: canAccess,
    fetchPage,
  });

  useEffect(() => {
    if (!canAccess) {
      navigate("/login", { replace: true });
      return;
    }
  }, [canAccess, navigate]);

  const handleRecover = async (member: TeamMember) => {
    if (myUserId != null && member.id === myUserId) return;
    setActionError("");
    setIssuedInvite(null);
    setCopyHint("");
    setRecoveringId(member.id);
    const result = await requestPasswordResetData(member.id);
    if (!result.ok) {
      setActionError(result.error);
      setRecoveringId(null);
      return;
    }
    setIssuedInvite({ forName: member.numeComplet, code: result.data.inviteCode });
    setRecoveringId(null);
    void load();
  };

  const handleDelete = async (member: TeamMember) => {
    if (myUserId != null && member.id === myUserId) return;
    const ok = window.confirm(
      `Ștergi definitiv utilizatorul „${member.numeComplet}”? Această acțiune nu poate fi anulată.`,
    );
    if (!ok) return;
    setActionError("");
    setIssuedInvite(null);
    setDeletingId(member.id);
    const result = await deleteUserData(member.id);
    setDeletingId(null);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    void load();
  };

  const copyIssuedCode = async () => {
    if (!issuedInvite) return;
    try {
      await navigator.clipboard.writeText(issuedInvite.code);
      setCopyHint("Cod copiat în clipboard.");
      window.setTimeout(() => setCopyHint(""), 2500);
    } catch {
      setCopyHint("Nu s-a putut copia automat; copiază manual.");
      window.setTimeout(() => setCopyHint(""), 3500);
    }
  };

  if (!canAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Echipa mea
          </p>
          <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
            Utilizatori în subordine
          </h1>
          <p className="mt-2 text-sm text-amber-700">
            La resetare parolă, utilizatorul devine inactiv, primește un cod nou
            (ca la înregistrare) și se reactivează după ce își setează parola pe
            pagina de activare. Poți și șterge conturi din echipa ta.
          </p>
        </div>

        {issuedInvite ? (
          <InviteCodeCard
            forName={issuedInvite.forName}
            code={issuedInvite.code}
            copyHint={copyHint}
            onCopy={copyIssuedCode}
            onClose={() => {
              setIssuedInvite(null);
              setCopyHint("");
            }}
          />
        ) : null}

        <ErrorBanner message={actionError} />

        <ListPagination
          className="mb-4"
          page={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          isLoading={isLoading}
          onPageChange={setPage}
          entityLabel="membri"
        />

        <AsyncListStatus
          isLoading={isLoading}
          error={loadError}
          isEmpty={!isLoading && !loadError && items.length === 0}
          onRetry={load}
          loadingLabel="Se încarcă echipa..."
          empty={{
            title: "Niciun utilizator în subordine",
            description:
              "Utilizatorii pe care îi înregistrezi cu tine ca manager vor apărea aici.",
          }}
        >
          <TeamMembersTable
            items={items}
            myUserId={myUserId}
            recoveringId={recoveringId}
            deletingId={deletingId}
            onRecover={handleRecover}
            onDelete={handleDelete}
          />
        </AsyncListStatus>
      </div>
    </div>
  );
}

export default EchipaPage;
