import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateClient } from "../utils/validateClient";
import { Button } from "../components/Button";
import { getEditableClientByIdData, updateClientData } from "../api/clients";
import type { CreateClientDto } from "../types/client";
import ContactFormFields from "./shared/ContactFormFields";

function EditContactForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateClientDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setErrorMessage("Lipsește identificatorul contactului din adresă.");
      return;
    }

    const fetchClient = async () => {
      setIsLoading(true);
      setErrorMessage("");
      const result = await getEditableClientByIdData(Number(id));
      if (!result.ok) {
        setErrorMessage(result.error);
        setForm(null);
        setIsLoading(false);
        return;
      }
      setForm(result.data);
      setIsLoading(false);
    };

    fetchClient();
  }, [id]);

  const handleSave = async () => {
    if (!form || isSaving) return;

    const validationError = validateClient(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsSaving(true);
    const result = await updateClientData(Number(id), form);
    setIsSaving(false);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }
    navigate("/contacte");
  };

  if (isLoading)
    return <p className="text-center text-amber-600 mt-10">Se încarcă...</p>;

  if (!form) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-amber-50 px-4 py-12">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50/90 p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-red-900">
            {errorMessage || "Nu am putut încărca contactul."}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/contacte")}
          >
            Înapoi la contacte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-amber-900">Editează client</h2>
          <p className="text-sm text-amber-600 mt-1">
            Modifică datele clientului
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <ContactFormFields
            form={form}
            onChange={(next) => setForm((prev) => ({ ...prev!, ...next }))}
            compact
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="primarySoft"
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
              onClick={() => navigate("/contacte")}
              disabled={isSaving}
            >
              Anulează
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditContactForm;
