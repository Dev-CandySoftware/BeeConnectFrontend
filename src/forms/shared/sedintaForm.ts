import type { CreateSedintaDto } from "../../types/sedinta";

export const toApiDateTime = (value: string) =>
  value.length === 16 ? `${value}:00` : value;

export function validateSedintaForm(form: CreateSedintaDto): string | null {
  if (!form.numeConsultant.trim()) {
    return "Numele consultantului este obligatoriu.";
  }

  if (!form.startAt || !form.endAt) {
    return "Intervalul ședinței este obligatoriu.";
  }

  if (new Date(form.endAt) <= new Date(form.startAt)) {
    return "Ora de sfârșit trebuie să fie după ora de început.";
  }

  if (!form.userId || form.userId <= 0) {
    return "Lipsește utilizatorul asociat ședinței. Reîncarcă pagina.";
  }

  return null;
}
