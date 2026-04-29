import { getFetchErrorMessage, getResponseErrorMessage } from "./errorMessages";
import { clearSession } from "../auth/session";

async function isLicenseExpiredResponse(response: Response): Promise<boolean> {
  if (response.status !== 403) return false;
  try {
    const payload = (await response.clone().json()) as { code?: unknown };
    return payload?.code === "license_expired";
  } catch {
    return false;
  }
}

async function handleLicenseExpired(response: Response) {
  if (!(await isLicenseExpiredResponse(response))) return;
  clearSession({ includeProfile: true });
  if (window.location.hash !== "#/license-expired") {
    window.location.hash = "/license-expired";
  }
}

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  response: Response;
};

export type ApiFailure = {
  ok: false;
  error: string;
  response?: Response;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export async function requestJson<T>(
  request: () => Promise<Response>,
  options?: {
    parse?: (raw: unknown) => T | null;
    fallbackError?: string;
  },
): Promise<ApiResult<T>> {
  try {
    const response = await request();
    if (!response.ok) {
      await handleLicenseExpired(response);
      return {
        ok: false,
        response,
        error: await getResponseErrorMessage(response, options?.fallbackError),
      };
    }

    const raw: unknown = await response.json();
    const data = options?.parse ? options.parse(raw) : (raw as T);
    if (options?.parse && data == null) {
      return {
        ok: false,
        response,
        error: options.fallbackError ?? "Răspuns neașteptat de la server.",
      };
    }

    return { ok: true, data: data as T, response };
  } catch (error) {
    return {
      ok: false,
      error: getFetchErrorMessage(error, options?.fallbackError),
    };
  }
}

export async function requestVoid(
  request: () => Promise<Response>,
  fallbackError?: string,
): Promise<ApiResult<null>> {
  try {
    const response = await request();
    if (!response.ok) {
      await handleLicenseExpired(response);
      return {
        ok: false,
        response,
        error: await getResponseErrorMessage(response, fallbackError),
      };
    }
    return { ok: true, data: null, response };
  } catch (error) {
    return {
      ok: false,
      error: getFetchErrorMessage(error, fallbackError),
    };
  }
}
