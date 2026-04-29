import { Button } from "../Button";
import type { TeamMember } from "../../api/parsers/entities/team";

type Props = {
  items: TeamMember[];
  myUserId: number | null;
  recoveringId: number | null;
  deletingId: number | null;
  onRecover: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
};

export default function TeamMembersTable({
  items,
  myUserId,
  recoveringId,
  deletingId,
  onRecover,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-amber-100 bg-amber-50/80 text-xs font-semibold uppercase tracking-wide text-amber-800">
          <tr>
            <th className="px-4 py-3">Nume</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Filială</th>
            <th className="px-4 py-3 text-right">Acțiuni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {items.map((m) => {
            const isSelf = myUserId != null && m.id === myUserId;
            const busy = recoveringId === m.id || deletingId === m.id;
            return (
              <tr key={m.id} className="text-amber-900">
                <td className="px-4 py-3 font-medium">{m.numeComplet}</td>
                <td className="px-4 py-3 text-amber-700">{m.email}</td>
                <td className="px-4 py-3">{m.role}</td>
                <td className="px-4 py-3 text-amber-600">{m.branchName}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      disabled={isSelf || busy}
                      title={
                        isSelf
                          ? "Nu poți reseta parola propriului cont de aici"
                          : undefined
                      }
                      onClick={() => onRecover(m)}
                    >
                      {recoveringId === m.id ? "Se generează…" : "Recuperează parola"}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="xs"
                      disabled={isSelf || busy}
                      title={
                        isSelf ? "Nu poți șterge propriul cont de aici" : undefined
                      }
                      onClick={() => onDelete(m)}
                    >
                      {deletingId === m.id ? "Se șterge…" : "Șterge"}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
