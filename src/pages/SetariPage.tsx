import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import LabeledField from "../components/LabeledField";
import { notifyProfileUpdated } from "../profileEvents";
import { updateMeData } from "../api";
import { getSessionProfile, getSessionToken, setSessionProfile } from "../auth/session";

const sectionClass =
  "rounded-2xl border border-amber-200 bg-white/90 p-6 shadow-sm";

function SetariPage() {
  const navigate = useNavigate();
  const token = getSessionToken();
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    const profile = getSessionProfile();
    setNume(profile.nume);
    setPrenume(profile.prenume);
    setEmail(profile.email);
  }, [token]);

  const handleSaveProfile = async () => {
    setFeedback(null);
    const n = nume.trim();
    const p = prenume.trim();
    const e = email.trim();
    if (!n) {
      setFeedback({ type: "err", text: "Numele este obligatoriu." });
      return;
    }
    if (!p) {
      setFeedback({ type: "err", text: "Prenumele este obligatoriu." });
      return;
    }
    if (!e) {
      setFeedback({ type: "err", text: "Email-ul este obligatoriu." });
      return;
    }

    const authToken = getSessionToken();
    if (!authToken) {
      setFeedback({
        type: "err",
        text: "Sesiunea a expirat. Autentifică-te din nou.",
      });
      return;
    }

    setIsSaving(true);
    const result = await updateMeData({
      nume: n,
      prenume: p,
      email: e.toLowerCase(),
    });
    setIsSaving(false);
    if (!result.ok) {
      setFeedback({
        type: "err",
        text: result.error,
      });
      return;
    }

    setSessionProfile({
      nume: result.data.nume,
      prenume: result.data.prenume,
      email: result.data.email,
    });

    notifyProfileUpdated();
    setFeedback({
      type: "ok",
      text: "Profilul a fost actualizat cu succes.",
    });
  };

  if (!token) {
    return (
      <div className="min-h-[50vh] bg-gradient-to-b from-amber-50 to-white px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-white/90 p-8 text-center shadow-sm">
          <p className="text-sm text-amber-800">
            Trebuie să fii autentificat pentru a accesa setările.
          </p>
          <Button
            variant="primarySoft"
            size="md"
            className="mt-4"
            onClick={() => navigate("/login")}
          >
            Mergi la autentificare
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-bold text-amber-900">Setări</h1>
          <p className="mt-1 text-sm text-amber-700">
            Gestionează profilul și consultă informații despre BeeConnect.
          </p>
        </header>

        <section className={sectionClass} aria-labelledby="setari-profil">
          <h2
            id="setari-profil"
            className="text-lg font-semibold text-amber-900"
          >
            Informații personale
          </h2>
          <p className="mt-1 text-xs text-amber-600">
            Modificările sunt trimise la server și reflectate în contul tău.
          </p>

          <div className="mt-5 space-y-4">
            <LabeledField
              label="Nume"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
            />
            <LabeledField
              label="Prenume"
              value={prenume}
              onChange={(e) => setPrenume(e.target.value)}
            />
            <LabeledField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {feedback ? (
            <div
              className={`mt-4 rounded-xl border px-3 py-2.5 text-xs ${
                feedback.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.text}
            </div>
          ) : null}

          <Button
            variant="primarySoft"
            size="md"
            className="mt-5"
            disabled={isSaving}
            onClick={handleSaveProfile}
          >
            {isSaving ? "Se salvează…" : "Salvează modificările"}
          </Button>
        </section>

        <section className={sectionClass} aria-labelledby="setari-despre">
          <h2
            id="setari-despre"
            className="text-lg font-semibold text-amber-900"
          >
            Despre aplicație
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-amber-600">
                Denumire
              </dt>
              <dd className="font-medium text-amber-900">BeeConnect</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-amber-600">
                Versiune
              </dt>
              <dd className="font-mono text-amber-900">{__APP_VERSION__}</dd>
            </div>
          </dl>
          <ul className="mt-5 list-inside list-disc space-y-1.5 text-xs text-amber-700">
            <li>
              BeeConnect te ajută să gestionezi activitățile și comunicarea
              echipei într-un singur loc.
            </li>
            <li>
              Datele profilului tău pot fi actualizate oricând din această
              pagină de setări.
            </li>
            <li>
              Pentru siguranță, sesiunea se încheie la delogare pe acest
              dispozitiv.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default SetariPage;
