import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CreateSedintaDto } from "../types/sedinta";
import { Button } from "../components/Button";
import { getEditableSedintaByIdData, updateSedintaData } from "../api";
import { getSessionUserId } from "../auth/session";
import SedintaFormFields from "./shared/SedintaFormFields";
import { toApiDateTime, validateSedintaForm } from "./shared/sedintaForm";

const toLocalDateTimeInput = (value: string) => {
  const date = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function EditSedintaPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<CreateSedintaDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setErrorMessage("Lipsește identificatorul ședinței din adresă.");
      return;
    }

    const fetchSedinta = async () => {
      setIsLoading(true);
      setErrorMessage("");
      const result = await getEditableSedintaByIdData(Number(id));
      if (!result.ok) {
        setErrorMessage(result.error);
        setForm(null);
        setIsLoading(false);
        return;
      }
      const sedinta = result.data;
      const myId = getSessionUserId();
      if (myId == null || sedinta.userId !== myId) {
        setForm(null);
        setErrorMessage("Nu poți edita o ședință creată de alt utilizator.");
        setIsLoading(false);
        return;
      }
      setForm({
        userId: sedinta.userId,
        numeConsultant: sedinta.numeConsultant,
        startAt: toLocalDateTimeInput(sedinta.startAt),
        endAt: toLocalDateTimeInput(sedinta.endAt),
        observatii: sedinta.observatii ?? "",
      });
      setIsLoading(false);
    };

    fetchSedinta();
  }, [id]);

  const handleSave = async () => {
    if (!form || !id || isSaving) return;

    const validationError = validateSedintaForm(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsSaving(true);
    const result = await updateSedintaData(Number(id), {
      ...form,
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

  if (isLoading) {
    return <p className="mt-10 text-center text-amber-700">Se încarcă...</p>;
  }

  if (!form) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white px-4 py-12">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50/90 p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-red-900">
            {errorMessage || "Nu am putut încărca ședința."}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/sedinte")}
          >
            Înapoi la ședințe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
        <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Editare
        </p>
        <h1 className="text-3xl font-extrabold text-amber-900">
          Editează ședința
        </h1>
        <p className="mt-2 text-sm text-amber-700">
          Modifică datele ședinței și salvează schimbările.
        </p>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6">
          <SedintaFormFields
            form={form}
            onChange={setForm}
            dense
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
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
      </div>
    </div>
  );
}

export default EditSedintaPage;
