import type { CreateSedintaDto } from "../../types/sedinta";
import LabeledField from "../../components/LabeledField";
import { getSessionUserNume, getSessionUserPrenume } from "../../auth/session";
import { useEffect } from "react";

type Props = {
  form: CreateSedintaDto;
  onChange: (next: CreateSedintaDto) => void;
  dense?: boolean;
};

const denseLabelClass =
  "block text-xs font-semibold uppercase tracking-wide text-amber-600";
const denseInputClass =
  "mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300";

export default function SedintaFormFields({ form, onChange, dense }: Props) {
  const labelClassName = dense ? denseLabelClass : undefined;
  const inputClassName = dense ? denseInputClass : undefined;

  const numeConsultant = getSessionUserNume() ?? "";
  const prenumeConsultant = getSessionUserPrenume() ?? "";
  const numeCompletConsultant = `${numeConsultant} ${prenumeConsultant}`.trim();

  useEffect(() => {
    if (!form.numeConsultant && numeCompletConsultant) {
      onChange({ ...form, numeConsultant: numeCompletConsultant });
    }
  }, [numeCompletConsultant]);


  return (
    <div className="grid grid-cols-1 gap-4">
      <LabeledField
        label="Nume consultant"
        value={numeCompletConsultant}
        onChange={(e) => onChange({ ...form, numeConsultant: e.target.value })}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
      />

      <LabeledField
        label="Început"
        type="datetime-local"
        value={form.startAt}
        onChange={(e) => onChange({ ...form, startAt: e.target.value })}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
      />

      <LabeledField
        label="Sfârșit"
        type="datetime-local"
        value={form.endAt}
        onChange={(e) => onChange({ ...form, endAt: e.target.value })}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
      />

      <LabeledField
        label="Observații"
        multiline
        rows={4}
        value={form.observatii ?? ""}
        onChange={(e) => onChange({ ...form, observatii: e.target.value })}
        labelClassName={labelClassName}
        inputClassName={dense ? `${denseInputClass} resize-none` : undefined}
      />
    </div>
  );
}
