import { useState } from "react";
import { type CreateClientDto } from "../types/client";
import { useNavigate } from "react-router-dom";
import { validateClient } from "../utils/validateClient";
import { Button } from "../components/Button";
import { createClientData } from "../api/clients";
import { getSessionBranchId, getSessionUserId } from "../auth/session";
import ContactFormFields from "./shared/ContactFormFields";
const initialForm: CreateClientDto = {
  nume: "",
  prenume: "",
  email: "",
  phoneNumber: "",
  sursa: "",
  venit: "",
  varsta: "",
  ocupatie: "",
  stareCivila: "",
  numarCopii: "",
  deCandCunoscPersoana: "",
  catDeBineCunoscPersoana: "",
  frecventaIntalniriAnuala: "",
  infoContact: "",
  esteFurnizorReferinte: "",
  status: "",
  observatii: "",
  dataContract: undefined,
  userId: 0,
  branchId: 0,
};

function AddContactForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateClientDto>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    const validationError = validateClient(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    const userId = getSessionUserId();
    const branchId = getSessionBranchId();
    if (userId == null || branchId == null) {
      setErrorMessage(
        "Lipsesc datele de sesiune (utilizator sau filială). Autentifică-te din nou.",
      );
      return;
    }

    setIsSaving(true);
    const result = await createClientData({
      ...form,
      userId,
      branchId,
    });
    setIsSaving(false);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }
    setForm(initialForm);
    navigate("/contacte");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Contact nou
          </p>
          <h2 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
            Adaugă contact
          </h2>
          <p className="mt-2 text-sm text-amber-700">
            Completează datele de bază și informațiile suplimentare.
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

          <ContactFormFields
            form={form}
            onChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
          />

          <div className="flex flex-wrap gap-3">
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
              onClick={() => navigate("/contacte")}
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
export default AddContactForm;
