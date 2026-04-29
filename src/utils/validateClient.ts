import { type CreateClientDto } from "../types/client";
import { dropdownConfigs } from "./DropDown_Config";

export const validateClient = (form: CreateClientDto): string | null => {
  if (!form.nume) return "Numele este obligatoriu.";
  if (!form.prenume) return "Prenumele este obligatoriu.";
  if (!form.email) return "Email-ul este obligatoriu.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Email-ul este invalid.";
  if (!/^(\+40|0)[0-9]{9}$/.test(form.phoneNumber))
    return "Numărul de telefon este invalid.";
  if (!form.sursa || !dropdownConfigs.sursa.includes(form.sursa))
    return "Sursa este invalidă.";
  if (!form.venit || !dropdownConfigs.venit.includes(form.venit))
    return "Venitul este invalid.";
  if (!form.varsta || !dropdownConfigs.varsta.includes(form.varsta))
    return "Vârsta este invalidă.";
  if (!form.ocupatie || !dropdownConfigs.ocupatie.includes(form.ocupatie))
    return "Ocupația este invalidă.";
  if (
    !form.stareCivila ||
    !dropdownConfigs.stareCivila.includes(form.stareCivila)
  )
    return "Starea civilă este invalidă.";
  if (!form.numarCopii || !dropdownConfigs.numarCopii.includes(form.numarCopii))
    return "Numărul de copii trebuie să fie un număr.";
  if (
    !form.deCandCunoscPersoana ||
    !dropdownConfigs.deCandCunoscPersoana.includes(form.deCandCunoscPersoana)
  )
    return "De când cunosc persoana este invalidă.";
  if (
    !form.catDeBineCunoscPersoana ||
    !dropdownConfigs.catDeBineCunoscPersoana.includes(
      form.catDeBineCunoscPersoana,
    )
  )
    return "Cât de bine cunosc persoana este invalidă.";
  if (
    !form.frecventaIntalniriAnuala ||
    !dropdownConfigs.frecventaIntalniriAnuala.includes(
      form.frecventaIntalniriAnuala,
    )
  )
    return "Frecvența întâlnirilor anuale este invalidă.";
  if (!form.infoContact) return "Informațiile de contact sunt obligatorii.";
  if (
    !form.esteFurnizorReferinte ||
    !dropdownConfigs.esteFurnizorReferinte.includes(form.esteFurnizorReferinte)
  )
    return "Este furnizor de referințe este invalid.";
  if (!form.status || !dropdownConfigs.status.includes(form.status))
    return "Statusul este invalid.";
  if (form.dataContract && new Date(form.dataContract) > new Date())
    return "Data contractului nu poate fi în viitor.";
  return null;
};
