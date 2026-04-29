import { asRecord, readNumber, readText } from "../core";
import { parsePaged } from "../paged";

export type TeamMember = {
  id: number;
  numeComplet: string;
  email: string;
  role: string;
  managerName: string;
  branchName: string;
};

export function parseTeamMember(raw: unknown): TeamMember | null {
  const source = asRecord(raw);
  if (!source) return null;

  const id = readNumber(source, ["id", "Id"]);
  if (id == null || id <= 0) return null;

  const numeComplet = readText(source, ["numeComplet", "NumeComplet"]) ?? "";
  const email = readText(source, ["email", "Email"]) ?? "";
  if (!numeComplet || !email) return null;

  return {
    id,
    numeComplet,
    email,
    role: readText(source, ["role", "Role"]) ?? "",
    managerName: readText(source, ["managerName", "ManagerName"]) ?? "",
    branchName: readText(source, ["branchName", "BranchName"]) ?? "",
  };
}

export function parseTeamPage(raw: unknown, pageSizeDefault: number) {
  return parsePaged(raw, parseTeamMember, { pageSizeDefault });
}
