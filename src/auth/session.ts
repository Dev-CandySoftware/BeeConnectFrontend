const SESSION_KEYS = {
  token: "token",
  role: "Role",
  userId: "userId",
  branchId: "branchId",
  licenseType: "licenseType",
  licenseExpiryDate: "licenseExpiryDate",
  isLicenseActive: "isLicenseActive",
} as const;

const PROFILE_KEYS = {
  nume: "nume",
  prenume: "prenume",
  email: "email",
} as const;

export type SessionProfile = {
  nume: string;
  prenume: string;
  email: string;
};

export type SessionLicense = {
  licenseType: "trial" | "paid" | "expired";
  isLicenseActive: boolean;
  licenseExpiryDate: string | null;
};

function parsePositiveNumber(raw: string | null): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function getSessionToken(): string | null {
  const token = localStorage.getItem(SESSION_KEYS.token);
  return token && token.trim() ? token : null;
}

export function getSessionRole(): string {
  return localStorage.getItem(SESSION_KEYS.role) ?? "";
}

export function getSessionUserId(): number | null {
  return parsePositiveNumber(localStorage.getItem(SESSION_KEYS.userId));
}

export function getSessionUserNume(): string | null {
  return localStorage.getItem(PROFILE_KEYS.nume);
}

export function getSessionUserPrenume(): string | null {
  return localStorage.getItem(PROFILE_KEYS.prenume);
}

export function getSessionBranchId(): number | null {
  return parsePositiveNumber(localStorage.getItem(SESSION_KEYS.branchId));
}

export function getSessionProfile(): SessionProfile {
  return {
    nume: localStorage.getItem(PROFILE_KEYS.nume) ?? "",
    prenume: localStorage.getItem(PROFILE_KEYS.prenume) ?? "",
    email: localStorage.getItem(PROFILE_KEYS.email) ?? "",
  };
}

export function getSessionLicense(): SessionLicense {
  const rawType = localStorage.getItem(SESSION_KEYS.licenseType);
  const licenseType =
    rawType === "trial" || rawType === "paid" || rawType === "expired"
      ? rawType
      : "expired";
  return {
    licenseType,
    isLicenseActive: localStorage.getItem(SESSION_KEYS.isLicenseActive) === "true",
    licenseExpiryDate: localStorage.getItem(SESSION_KEYS.licenseExpiryDate),
  };
}

export function setSessionAuth(input: {
  token: string;
  role: string;
  userId: number;
  branchId: number;
  licenseType: "trial" | "paid" | "expired";
  isLicenseActive: boolean;
  licenseExpiryDate: string | null;
}) {
  localStorage.setItem(SESSION_KEYS.token, input.token);
  localStorage.setItem(SESSION_KEYS.role, input.role);
  localStorage.setItem(SESSION_KEYS.userId, String(input.userId));
  localStorage.setItem(SESSION_KEYS.branchId, String(input.branchId));
  localStorage.setItem(SESSION_KEYS.licenseType, input.licenseType);
  localStorage.setItem(
    SESSION_KEYS.isLicenseActive,
    String(input.isLicenseActive),
  );
  if (input.licenseExpiryDate) {
    localStorage.setItem(SESSION_KEYS.licenseExpiryDate, input.licenseExpiryDate);
  } else {
    localStorage.removeItem(SESSION_KEYS.licenseExpiryDate);
  }
}

export function setSessionProfile(profile: Partial<SessionProfile>) {
  if (profile.nume != null) {
    localStorage.setItem(PROFILE_KEYS.nume, profile.nume);
  }
  if (profile.prenume != null) {
    localStorage.setItem(PROFILE_KEYS.prenume, profile.prenume);
  }
  if (profile.email != null) {
    localStorage.setItem(PROFILE_KEYS.email, profile.email);
  }
}

export function clearSession(options?: { includeProfile?: boolean }) {
  localStorage.removeItem(SESSION_KEYS.token);
  localStorage.removeItem(SESSION_KEYS.role);
  localStorage.removeItem(SESSION_KEYS.userId);
  localStorage.removeItem(SESSION_KEYS.branchId);
  localStorage.removeItem(SESSION_KEYS.licenseType);
  localStorage.removeItem(SESSION_KEYS.isLicenseActive);
  localStorage.removeItem(SESSION_KEYS.licenseExpiryDate);

  if (options?.includeProfile) {
    localStorage.removeItem(PROFILE_KEYS.nume);
    localStorage.removeItem(PROFILE_KEYS.prenume);
    localStorage.removeItem(PROFILE_KEYS.email);
  }
}
