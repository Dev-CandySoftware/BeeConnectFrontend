import LabeledField from "../LabeledField";
import type { Branch } from "../../types/branch";

type Props = {
  nume: string;
  prenume: string;
  email: string;
  role: string;
  branchId: string;
  subMe: boolean;
  roleOptions: ReadonlyArray<{ value: string; label: string }>;
  branches: Branch[];
  branchesLoading: boolean;
  onNumeChange: (value: string) => void;
  onPrenumeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onBranchIdChange: (value: string) => void;
  onSubMeChange: (value: boolean) => void;
};

export default function RegisterUserFields({
  nume,
  prenume,
  email,
  role,
  branchId,
  subMe,
  roleOptions,
  branches,
  branchesLoading,
  onNumeChange,
  onPrenumeChange,
  onEmailChange,
  onRoleChange,
  onBranchIdChange,
  onSubMeChange,
}: Props) {
  return (
    <div className="space-y-4">
      <LabeledField label="Nume" value={nume} onChange={(e) => onNumeChange(e.target.value)} />
      <LabeledField
        label="Prenume"
        value={prenume}
        onChange={(e) => onPrenumeChange(e.target.value)}
      />
      <LabeledField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />

      <label className="block text-xs font-semibold uppercase tracking-wide text-amber-600">
        Filială
        <select
          className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
          value={branchId}
          onChange={(e) => onBranchIdChange(e.target.value)}
          required
          disabled={branchesLoading || branches.length === 0}
        >
          <option value="">
            {branchesLoading
              ? "Se încarcă filialele…"
              : branches.length === 0
                ? "Nicio filială disponibilă"
                : "Selectează filiala"}
          </option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nume} ({b.oras})
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-semibold uppercase tracking-wide text-amber-600">
        Rol în aplicație
        <select
          className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-3 text-sm text-amber-900">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={subMe}
          onChange={(e) => onSubMeChange(e.target.checked)}
        />
        <span>Utilizatorul raportează la mine în ierarhie (manager direct)</span>
      </label>
    </div>
  );
}
