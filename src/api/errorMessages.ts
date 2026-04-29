export const NETWORK_ERROR_MESSAGE =
  "Nu s-a putut contacta serverul. Verifică conexiunea la internet și că API-ul rulează.";

const STATUS_FALLBACK: Record<number, string> = {
  400: "Cererea nu este validă.",
  401: "Nu ești autentificat sau sesiunea a expirat.",
  403: "Nu ai dreptul să execi această acțiune.",
  404: "Resursa nu a fost găsită.",
  409: "Conflict — datele nu pot fi aplicate în starea curentă.",
  422: "Datele nu au putut fi validate.",
  429: "Prea multe cereri. Încearcă din nou peste câteva momente.",
  500: "Eroare pe server. Încearcă mai târziu.",
  502: "Serverul nu răspunde corect (bad gateway).",
  503: "Serverul este temporar indisponibil.",
};

function pickJsonMessage(parsed: unknown): string {
  if (!parsed || typeof parsed !== "object") return "";
  const o = parsed as Record<string, unknown>;
  const candidates = [o.message, o.title, o.error, o.detail];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  if (Array.isArray(o.errors) && typeof o.errors[0] === "string") {
    return o.errors[0].trim();
  }
  return "";
}

export async function getResponseErrorMessage(
  response: Response,
  fallback?: string,
): Promise<string> {
  const status = response.status;
  const statusFallback =
    STATUS_FALLBACK[status] ??
    (status ? `Cererea a eșuat (cod ${status}).` : "Cererea a eșuat.");

  try {
    const text = await response.text();
    if (!text.trim()) return fallback ?? statusFallback;
    try {
      const json: unknown = JSON.parse(text);
      const fromJson = pickJsonMessage(json);
      if (fromJson) return fromJson;
    } catch {
      if (text.length <= 280) return text.trim();
    }
  } catch {
    // Corpul răspunsului nu a putut fi citit.
  }
  return fallback ?? statusFallback;
}

export function getFetchErrorMessage(err: unknown, fallback?: string): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "";
  }
  if (err instanceof TypeError) {
    if (/fetch|network|failed/i.test(err.message)) {
      return NETWORK_ERROR_MESSAGE;
    }
  }
  if (err instanceof Error && err.message.trim()) {
    return err.message.trim();
  }
  return fallback ?? NETWORK_ERROR_MESSAGE;
}
