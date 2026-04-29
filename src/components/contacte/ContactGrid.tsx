import { Button } from "../Button";
import type { Client } from "../../types/client";

type Props = {
  items: Client[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function ContactGrid({ items, onEdit, onDelete }: Props) {
  return (
    <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((contact) => (
        <li
          key={contact.id}
          className="group rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs text-amber-400">#{contact.id}</p>
              <p className="text-base font-semibold text-amber-900">
                {contact.nume} {contact.prenume}
              </p>
              <p className="text-xs text-amber-600">{contact.email}</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              {contact.status || "fără status"}
            </span>
          </div>

          <div className="border-t border-amber-100 pt-3 space-y-1.5">
            <p className="text-xs text-amber-500">
              Telefon:{" "}
              <span className="font-medium text-amber-800">
                {contact.phoneNumber}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Sursă: <span className="font-medium text-amber-800">{contact.sursa}</span>
            </p>
            <p className="text-xs text-amber-500">
              Venit: <span className="font-medium text-amber-800">{contact.venit}</span>
            </p>
            <p className="text-xs text-amber-500">
              Vârstă: <span className="font-medium text-amber-800">{contact.varsta}</span>
            </p>
            <p className="text-xs text-amber-500">
              Ocupație:{" "}
              <span className="font-medium text-amber-800">{contact.ocupatie}</span>
            </p>
            <p className="text-xs text-amber-500">
              Stare civilă:{" "}
              <span className="font-medium text-amber-800">{contact.stareCivila}</span>
            </p>
            <p className="text-xs text-amber-500">
              Nr. copii:{" "}
              <span className="font-medium text-amber-800">{contact.numarCopii}</span>
            </p>
            <p className="text-xs text-amber-500">
              De când:{" "}
              <span className="font-medium text-amber-800">
                {contact.deCandCunoscPersoana}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Cât de bine:{" "}
              <span className="font-medium text-amber-800">
                {contact.catDeBineCunoscPersoana}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Frecvență:{" "}
              <span className="font-medium text-amber-800">
                {contact.frecventaIntalniriAnuala}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Contact:{" "}
              <span className="font-medium text-amber-800">{contact.infoContact}</span>
            </p>
            <p className="text-xs text-amber-500">
              Referințe:{" "}
              <span className="font-medium text-amber-800">
                {contact.esteFurnizorReferinte}
              </span>
            </p>
            <p className="text-xs text-amber-500">
              Observații:{" "}
              <span className="font-medium text-amber-800">{contact.observatii}</span>
            </p>
            <p className="text-xs text-amber-500">
              Data contract:{" "}
              <span className="font-medium text-amber-800">
                {contact.dataContract
                  ? new Date(contact.dataContract).toLocaleDateString("ro-RO")
                  : "—"}
              </span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              className="flex-1"
              onClick={() => onEdit(contact.id)}
            >
              Editează
            </Button>
            <Button
              type="button"
              variant="danger"
              size="xs"
              className="flex-1"
              onClick={() => onDelete(contact.id)}
            >
              Șterge
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
