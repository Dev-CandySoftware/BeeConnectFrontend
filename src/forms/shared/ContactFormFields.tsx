import type { CreateClientDto } from "../../types/client";
import FormDropdown from "../../components/DropdownComponent";
import { dropdownConfigs } from "../../utils/DropDown_Config";
import LabeledField from "../../components/LabeledField";

type ContactFormData = Omit<CreateClientDto, "userId" | "branchId">;

type Props = {
  form: ContactFormData;
  onChange: (next: ContactFormData) => void;
  compact?: boolean;
};

const dropdownLabels: Record<string, string> = {
  sursa: "Sursă",
  venit: "Venit",
  varsta: "Vârstă",
  ocupatie: "Ocupație",
  stareCivila: "Stare civilă",
  numarCopii: "Număr copii",
  deCandCunoscPersoana: "De când cunosc persoana",
  catDeBineCunoscPersoana: "Cât de bine cunosc persoana",
  frecventaIntalniriAnuala: "Frecvența întâlnirilor",
  infoContact: "Posibilități de contact",
  esteFurnizorReferinte: "Furnizor de referințe",
  status: "Status",
};

const compactLabelClass = "block text-xs font-medium text-amber-600";
const compactInputClass =
  "mt-1 w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300";

export default function ContactFormFields({ form, onChange, compact }: Props) {
  const labelClassName = compact ? compactLabelClass : undefined;
  const inputClassName = compact ? compactInputClass : undefined;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <LabeledField
          label="Nume"
          value={form.nume}
          onChange={(e) => onChange({ ...form, nume: e.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
        <LabeledField
          label="Prenume"
          value={form.prenume}
          onChange={(e) => onChange({ ...form, prenume: e.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
        <LabeledField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
        <LabeledField
          label="Număr de telefon"
          type="tel"
          value={form.phoneNumber}
          onChange={(e) => onChange({ ...form, phoneNumber: e.target.value })}
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
      </div>

      <div className="mb-6 border-t border-amber-100 pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500">
          Informații suplimentare
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(dropdownConfigs).map(([key, optionsList]) => (
            <FormDropdown
              key={key}
              label={dropdownLabels[key] ?? key}
              name={key}
              value={form[key as keyof ContactFormData] as string}
              options={optionsList}
              onSelect={(name, val) =>
                onChange({ ...form, [name]: val } as ContactFormData)
              }
            />
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-amber-100 pt-5">
        <LabeledField
          label="Observații"
          multiline
          rows={4}
          wrapperClassName="mb-4 block text-xs font-semibold uppercase tracking-wide text-amber-600"
          inputClassName={
            compact
              ? `${compactInputClass} resize-none`
              : "mt-1 w-full resize-none rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
          }
          value={form.observatii}
          onChange={(e) => onChange({ ...form, observatii: e.target.value })}
        />
        <LabeledField
          label="Data contract"
          type="date"
          value={form.dataContract ?? ""}
          onChange={(e) =>
            onChange({ ...form, dataContract: e.target.value || undefined })
          }
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
      </div>
    </>
  );
}
