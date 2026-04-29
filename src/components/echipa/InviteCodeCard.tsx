import { Button } from "../Button";

type Props = {
  forName: string;
  code: string;
  copyHint: string;
  onCopy: () => void;
  onClose: () => void;
};

export default function InviteCodeCard({
  forName,
  code,
  copyHint,
  onCopy,
  onClose,
}: Props) {
  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
      <p className="text-sm font-semibold text-amber-900">
        Cod de invitație pentru {forName}
      </p>
      <p className="mt-2 font-mono text-lg font-bold tracking-wide text-amber-950">
        {code}
      </p>
      <p className="mt-2 text-xs text-amber-700">
        Contul este acum inactiv până la activare. Utilizatorul deschide pagina
        de activare, introduce codul și setează o parolă nouă.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onCopy}>
          Copiază codul
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Închide
        </Button>
      </div>
      {copyHint ? <p className="mt-2 text-xs text-amber-600">{copyHint}</p> : null}
    </div>
  );
}
