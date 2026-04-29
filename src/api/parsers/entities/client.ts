import type { Client, CreateClientDto } from "../../../types/client";
import { asRecord, readDateText, readNumber, readText } from "../core";
import { parsePaged } from "../paged";

export function parseClient(raw: unknown): Client | null {
  const source = asRecord(raw);
  if (!source) return null;

  const id = readNumber(source, ["id", "Id"]);
  const userId = readNumber(source, ["userId", "UserId"]);
  const branchId = readNumber(source, ["branchId", "BranchId"]);
  if (id == null || userId == null || branchId == null) return null;

  return {
    id,
    userId,
    branchId,
    nume: readText(source, ["nume", "Nume"]) ?? "",
    prenume: readText(source, ["prenume", "Prenume"]) ?? "",
    email: readText(source, ["email", "Email"]) ?? "",
    phoneNumber: readText(source, ["phoneNumber", "PhoneNumber"]) ?? "",
    sursa: readText(source, ["sursa", "Sursa"]) ?? "",
    venit: readText(source, ["venit", "Venit"]) ?? "",
    varsta: readText(source, ["varsta", "Varsta"]) ?? "",
    ocupatie: readText(source, ["ocupatie", "Ocupatie"]) ?? "",
    stareCivila: readText(source, ["stareCivila", "StareCivila"]) ?? "",
    numarCopii: readText(source, ["numarCopii", "NumarCopii"]) ?? "",
    deCandCunoscPersoana:
      readText(source, ["deCandCunoscPersoana", "DeCandCunoscPersoana"]) ?? "",
    catDeBineCunoscPersoana:
      readText(source, ["catDeBineCunoscPersoana", "CatDeBineCunoscPersoana"]) ??
      "",
    frecventaIntalniriAnuala:
      readText(source, ["frecventaIntalniriAnuala", "FrecventaIntalniriAnuala"]) ??
      "",
    infoContact: readText(source, ["infoContact", "InfoContact"]) ?? "",
    esteFurnizorReferinte:
      readText(source, ["esteFurnizorReferinte", "EsteFurnizorReferinte"]) ?? "",
    status: readText(source, ["status", "Status"]) ?? "",
    observatii: readText(source, ["observatii", "Observatii"]) ?? "",
    createdAt: readDateText(source, ["createdAt", "CreatedAt"]) ?? "",
    dataContract: readDateText(source, ["dataContract", "DataContract"]),
  };
}

export function parseClientPage(raw: unknown, pageSizeDefault: number) {
  return parsePaged(raw, parseClient, { pageSizeDefault });
}

export function parseEditableClient(raw: unknown): CreateClientDto | null {
  const source = asRecord(raw);
  if (!source) return null;

  const userId = readNumber(source, ["userId", "UserId"]);
  const branchId = readNumber(source, ["branchId", "BranchId"]);
  if (userId == null || branchId == null) return null;

  return {
    nume: readText(source, ["nume", "Nume"]) ?? "",
    prenume: readText(source, ["prenume", "Prenume"]) ?? "",
    email: readText(source, ["email", "Email"]) ?? "",
    phoneNumber: readText(source, ["phoneNumber", "PhoneNumber"]) ?? "",
    sursa: readText(source, ["sursa", "Sursa"]) ?? "",
    venit: readText(source, ["venit", "Venit"]) ?? "",
    varsta: readText(source, ["varsta", "Varsta"]) ?? "",
    ocupatie: readText(source, ["ocupatie", "Ocupatie"]) ?? "",
    stareCivila: readText(source, ["stareCivila", "StareCivila"]) ?? "",
    numarCopii: readText(source, ["numarCopii", "NumarCopii"]) ?? "",
    deCandCunoscPersoana:
      readText(source, ["deCandCunoscPersoana", "DeCandCunoscPersoana"]) ?? "",
    catDeBineCunoscPersoana:
      readText(source, ["catDeBineCunoscPersoana", "CatDeBineCunoscPersoana"]) ??
      "",
    frecventaIntalniriAnuala:
      readText(source, ["frecventaIntalniriAnuala", "FrecventaIntalniriAnuala"]) ??
      "",
    infoContact: readText(source, ["infoContact", "InfoContact"]) ?? "",
    esteFurnizorReferinte:
      readText(source, ["esteFurnizorReferinte", "EsteFurnizorReferinte"]) ?? "",
    status: readText(source, ["status", "Status"]) ?? "",
    observatii: readText(source, ["observatii", "Observatii"]) ?? "",
    dataContract: readDateText(source, ["dataContract", "DataContract"]),
    userId,
    branchId,
  };
}
