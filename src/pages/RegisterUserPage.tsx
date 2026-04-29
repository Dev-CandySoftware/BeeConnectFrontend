import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

import { getBranchesData } from "../api";
import { registerUser } from "../api/auth";
import {
  getSessionBranchId,
  getSessionRole,
  getSessionToken,
  getSessionUserId,
} from "../auth/session";
import type { CreateUserDto } from "../types/user";
import RegisterSuccessCard from "../components/register/RegisterSuccessCard";
import RegisterUserFields from "../components/register/RegisterUserFields";
import {
  type Branch,
} from "../types/branch";

function buildCreateUserPayload(input: {
  nume: string;
  prenume: string;
  email: string;
  role: string;
  branchId: number;
  managerId: number | null;
  includeManager: boolean;
}): CreateUserDto {
  const payload: CreateUserDto = {
    nume: input.nume,
    prenume: input.prenume,
    email: input.email,
    role: input.role,
    branchId: input.branchId,
  };

  if (input.includeManager && input.managerId != null) {
    payload.managerId = input.managerId;
  }

  return payload;
}

const ROLES_MANAGER = [{ value: "Consultant", label: "Consultant" }] as const;

const ROLES_SUPER = [
  ...ROLES_MANAGER,
  { value: "Manager", label: "Manager" },
  { value: "SuperAdmin", label: "SuperAdmin" },
] as const;

function RegisterUserPage() {
  const navigate = useNavigate();
  const token = getSessionToken();
  const myRole = getSessionRole();
  const myUserId = getSessionUserId();
  const canAccess = Boolean(
    token && (myRole === "Manager" || myRole === "SuperAdmin"),
  );

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState("");

  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Consultant");
  const [branchId, setBranchId] = useState(() => {
    const branch = getSessionBranchId();
    return branch == null ? "" : String(branch);
  });
  const [subMe, setSubMe] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState<{
    id: number;
    inviteCode: string;
  } | null>(null);
  const [copyHint, setCopyHint] = useState("");

  const roleOptions = myRole === "SuperAdmin" ? ROLES_SUPER : ROLES_MANAGER;

  const loadBranches = useCallback(async () => {
    if (!canAccess) return;
    setBranchesLoading(true);
    setBranchesError("");
    const result = await getBranchesData();
    if (!result.ok) {
      setBranches([]);
      setBranchesError(result.error);
      setBranchesLoading(false);
      return;
    }
    const parsed = result.data;
    setBranches(parsed);
    if (parsed.length === 0) {
      setBranchesError("Nu există filiale în sistem.");
    }
    setBranchesLoading(false);
  }, [canAccess]);

  useEffect(() => {
    void loadBranches();
  }, [loadBranches]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyHint("Cod copiat în clipboard.");
      setTimeout(() => setCopyHint(""), 2500);
    } catch {
      setCopyHint("Nu s-a putut copia automat — selectează și copiază manual.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setErrorMessage("");
    setSuccess(null);

    const n = nume.trim();
    const p = prenume.trim();
    const em = email.trim().toLowerCase();
    const bid = Number(branchId);

    if (n.length < 2) {
      setErrorMessage("Numele trebuie să aibă cel puțin 2 caractere.");
      return;
    }
    if (p.length < 2) {
      setErrorMessage("Prenumele trebuie să aibă cel puțin 2 caractere.");
      return;
    }
    if (!em || !em.includes("@")) {
      setErrorMessage("Introdu un email valid.");
      return;
    }
    if (!Number.isFinite(bid) || bid <= 0) {
      setErrorMessage("Alege o filială din listă (încărcată de pe server).");
      return;
    }

    const payload = buildCreateUserPayload({
      nume: n,
      prenume: p,
      email: em,
      role,
      branchId: bid,
      managerId: myUserId,
      includeManager: subMe,
    });

    setIsSaving(true);
    const result = await registerUser(payload);
    setIsSaving(false);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setSuccess({ id: result.data.id, inviteCode: result.data.inviteCode });
    setNume("");
    setPrenume("");
    setEmail("");
    setRole("Consultant");
    setSubMe(true);
  };

  const resetSuccess = () => {
    setSuccess(null);
    setCopyHint("");
  };

  if (!token) {
    return (
      <div className="min-h-[50vh] px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-amber-800">
            Autentifică-te pentru a continua.
          </p>
          <Button
            variant="primarySoft"
            size="md"
            className="mt-4"
            onClick={() => navigate("/login")}
          >
            La autentificare
          </Button>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-[50vh] px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-amber-800">
            Doar managerii și super-adminii pot înregistra utilizatori noi.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Înapoi acasă
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Invitație cont nou
          </p>
          <h1 className="text-3xl font-extrabold text-amber-900">
            Înregistrare utilizator
          </h1>
          <p className="mt-2 text-sm text-amber-700">
            După salvare primești un cod de invitație. Persoana îl folosește la
            „Activează cont” ca să își seteze parola.
          </p>
        </div>

        {success ? (
          <RegisterSuccessCard
            id={success.id}
            inviteCode={success.inviteCode}
            copyHint={copyHint}
            onCopy={handleCopyCode}
            onRegisterAnother={resetSuccess}
            onGoHome={() => navigate("/")}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm"
          >
            {branchesError ? (
              <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                <span>{branchesError}</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  disabled={branchesLoading}
                  onClick={() => void loadBranches()}
                >
                  {branchesLoading ? "Se încarcă…" : "Reîncarcă filialele"}
                </Button>
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <RegisterUserFields
              nume={nume}
              prenume={prenume}
              email={email}
              role={role}
              branchId={branchId}
              subMe={subMe}
              roleOptions={roleOptions}
              branches={branches}
              branchesLoading={branchesLoading}
              onNumeChange={setNume}
              onPrenumeChange={setPrenume}
              onEmailChange={setEmail}
              onRoleChange={setRole}
              onBranchIdChange={setBranchId}
              onSubMeChange={setSubMe}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSaving || branchesLoading || branches.length === 0}
              >
                {isSaving ? "Se creează…" : "Creează și obține codul"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isSaving}
                onClick={() => navigate("/")}
              >
                Anulează
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterUserPage;
