import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import LabeledField from "../components/LabeledField";
import { createTeamMeetingData } from "../api/sedinte";
import type { TeamMeetingDto } from "../types/sedinta";
import { getMyTeam } from "../api/users";
import { getSessionUserId } from "../auth/session";
import type { TeamMember } from "../api/parsers/entities/team";

function AddTeamMeetingPage() {
  const navigate = useNavigate();
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [observatii, setObservatii] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      const result = await getMyTeam();
      if (result.ok) setTeam(await result.json());
    };
    fetchTeam();
  }, []);

  const toggleParticipant = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startAt || !endAt) {
      setErrorMessage("Intervalul ședinței este obligatoriu.");
      return;
    }
    if (new Date(endAt) <= new Date(startAt)) {
      setErrorMessage("Ora de sfârșit trebuie să fie după ora de început.");
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMessage("Selectează cel puțin un participant.");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    const dto: TeamMeetingDto = {
      startAt: `${startAt}:00`,
      endAt: `${endAt}:00`,
      observatii: observatii || null,
      participantIds: selectedIds,
    };

    const result = await createTeamMeetingData(dto);
    setIsSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    navigate("/sedinte");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Ședință echipă
          </p>
          <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
            Crează ședință de echipă
          </h1>
          <p className="mt-2 text-sm text-amber-700">
            Intervalul va fi blocat pentru toți participanții selectați.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm"
        >
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
            <LabeledField
              label="Început"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
            <LabeledField
              label="Sfârșit"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>

          <LabeledField
            label="Observații"
            multiline
            rows={3}
            value={observatii}
            onChange={(e) => setObservatii(e.target.value)}
            inputClassName="mt-1 w-full resize-none rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />

          <div className="mt-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3">
              Participanți
            </p>
            {team.length === 0 ? (
              <p className="text-sm text-amber-600">Nu ai membri în echipă.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {team.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                      selectedIds.includes(m.id)
                        ? "border-amber-400 bg-amber-50"
                        : "border-amber-200 bg-white hover:bg-amber-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(m.id)}
                      onChange={() => toggleParticipant(m.id)}
                      className="accent-amber-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-amber-900">{m.numeComplet}</p>
                      <p className="text-xs text-amber-600">{m.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving} variant="primary" size="md">
              {isSaving ? "Se salvează..." : "Crează ședință"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Anulează
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeamMeetingPage;