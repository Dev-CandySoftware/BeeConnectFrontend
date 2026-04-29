import { Button } from "../Button";

type Props = {
  id: number;
  inviteCode: string;
  copyHint: string;
  onCopy: (code: string) => void;
  onRegisterAnother: () => void;
  onGoHome: () => void;
};

export default function RegisterSuccessCard({
  id,
  inviteCode,
  copyHint,
  onCopy,
  onRegisterAnother,
  onGoHome,
}: Props) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/90 p-8 shadow-sm">
      <p className="text-sm font-semibold text-emerald-900">
        Utilizator creat (id #{id})
      </p>
      <p className="mt-3 text-xs text-emerald-800">
        Cod de invitație — trimite-l persoanei (email, mesaj etc.):
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <code className="block flex-1 break-all rounded-xl border border-emerald-300 bg-white px-4 py-3 text-center text-lg font-bold tracking-widest text-emerald-950">
          {inviteCode}
        </code>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => onCopy(inviteCode)}
        >
          Copiază codul
        </Button>
      </div>
      {copyHint ? <p className="mt-2 text-xs text-emerald-800">{copyHint}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="primarySoft" size="md" onClick={onRegisterAnother}>
          Înregistrează alt utilizator
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onGoHome}>
          Acasă
        </Button>
      </div>
    </div>
  );
}
