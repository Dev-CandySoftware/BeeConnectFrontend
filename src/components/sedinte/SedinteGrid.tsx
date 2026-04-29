import { Button } from "../Button";
import type { Sedinta } from "../../types/sedinta";

type Props = {
  items: Sedinta[];
  canManageSedinta: (sedinta: Sedinta) => boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function SedinteGrid({
  items,
  canManageSedinta,
  onEdit,
  onDelete,
}: Props) {
  return (
    <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((sedinta) => (
        <li
          key={sedinta.id}
          className="group rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3">
            <p className="mb-1 text-xs text-amber-400">#{sedinta.id}</p>
            <p className="text-base font-semibold text-amber-900">
              {sedinta.numeConsultant}
            </p>
          </div>

          <div className="border-t border-amber-100 pt-3 space-y-1.5">
            <p className="text-xs text-amber-500">
              Început:{" "}
              <span className="font-medium text-amber-800">
                {new Date(sedinta.startAt).toLocaleString("ro-RO")}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Sfârșit:{" "}
              <span className="font-medium text-amber-800">
                {new Date(sedinta.endAt).toLocaleString("ro-RO")}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Observații:{" "}
              <span className="font-medium text-amber-800">
                {sedinta.observatii || "—"}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Creată la:{" "}
              <span className="font-medium text-amber-800">
                {new Date(sedinta.createdAt).toLocaleString("ro-RO")}
              </span>
            </p>
          </div>

          {canManageSedinta(sedinta) ? (
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="xs"
                className="flex-1"
                onClick={() => onEdit(sedinta.id)}
              >
                Editează
              </Button>
              <Button
                type="button"
                variant="danger"
                size="xs"
                className="flex-1"
                onClick={() => onDelete(sedinta.id)}
              >
                Șterge
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-center text-[11px] text-amber-500">
              Doar creatorul ședinței poate edita sau șterge.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
