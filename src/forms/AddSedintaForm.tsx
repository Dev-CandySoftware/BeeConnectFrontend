import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { createSedintaData } from "../api/sedinte";
import type { CreateSedintaDto } from "../types/sedinta";
import { getSessionUserId } from "../auth/session";
import SedintaFormFields from "./shared/SedintaFormFields";
import { toApiDateTime, validateSedintaForm } from "./shared/sedintaForm";

function AddSedintaForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateSedintaDto>({
    userId: 0,
    numeConsultant: "",
    startAt: "",
    endAt: "",
    observatii: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setErrorMessage("");
    const userId = getSessionUserId();
    if (userId == null) {
      setErrorMessage(
        "Nu ești autentificat sau lipsește userId. Reautentifică-te.",
      );
      return;
    }

    const validationError = validateSedintaForm({ ...form, userId });
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(true);
    const result = await createSedintaData({
      userId,
      numeConsultant: form.numeConsultant.trim(),
      startAt: toApiDateTime(form.startAt),
      endAt: toApiDateTime(form.endAt),
      observatii: form.observatii?.trim() || undefined,
    });
    setIsSaving(false);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }
    navigate("/sedinte");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
        <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Nou
        </p>
        <h1 className="text-3xl font-extrabold text-amber-900">
          Adaugă ședință
        </h1>
        <p className="mt-2 text-sm text-amber-700">
          Completează detaliile și salvează ședința.
        </p>

        <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-4">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <SedintaFormFields form={form} onChange={setForm} />

          <div className="mt-2 flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isSaving}
              variant="primary"
              size="md"
            >
              {isSaving ? "Se salvează..." : "Salvează"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate("/sedinte")}
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

export default AddSedintaForm;
function getSessionUserPrenume() {
  throw new Error("Function not implemented.");
}

