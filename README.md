# BeeConnect

Aplicație web/electron pentru gestionarea contactelor, ședințelor și vizualizarea statisticilor.

## Funcționalități principale

- gestionare contacte: adăugare, editare, ștergere, listare;
- gestionare ședințe: adăugare, editare, ștergere, listare;
- dashboard cu grafice de distribuție;
- navigare laterală persistentă (sidebar);
- interfață responsive, stilizată cu Tailwind CSS.

## Tehnologii

- frontend: React + TypeScript + Vite + Tailwind;
- charting: Recharts;
- routing: React Router;
- backend: ASP.NET Core Web API (C#);
- desktop build: Electron.

## Cerințe

- Node.js 20+;
- npm 10+;
- backend API pornit local (implicit la `http://localhost:5217`).

## Configurare variabile de mediu

Frontend-ul citește baza API din:

- `VITE_API_BASE_URL`

Exemplu `.env`:

```env
VITE_API_BASE_URL=http://localhost:5217
```

Dacă nu există variabila, aplicația folosește fallback `http://localhost:5217`.

## Pornire proiect

1. Instalează dependențele:

```bash
npm install
```

2. Pornește frontend-ul:

```bash
npm run dev
```

3. Deschide în browser:

- [http://localhost:5173](http://localhost:5173)

## Scripturi disponibile

- `npm run dev` - pornește aplicația în mod development;
- `npm run lint` - rulează verificările ESLint;
- `npm run build` - build de producție (Vite);
- `npm run electron:dev` - pornește frontend + Electron;
- `npm run electron:build` - build aplicație desktop Windows.

## Rute frontend

- `/` - Home;
- `/contacte` - listă contacte;
- `/contact/add` - adăugare contact;
- `/contact/edit/:id` - editare contact;
- `/dashboard` - dashboard grafice;
- `/sedinte` - listă ședințe;
- `/sedinte/add` - adăugare ședință;
- `/sedinte/edit/:id` - editare ședință;
- `/cursuri` - pagină cursuri (placeholder).

## API minim necesar

### Contacte

- `GET /api/Client`
- `GET /api/Client/{id}`
- `POST /api/Client`
- `PUT /api/Client/{id}`
- `DELETE /api/Client/{id}`

### Dashboard

- `GET /api/Client/income_distribution`
- `GET /api/Client/age_distribution`
- `GET /api/Client/Ocupation_distribution`
- `GET /api/Client/marital_status_distribution`
- `GET /api/Client/number_of_children`
- `GET /api/Client/since_i_knew_distribution`
- `GET /api/Client/how_well_i_knew_distribution`
- `GET /api/Client/meeting_frequency_distribution`
- `GET /api/Client/contact_info_distribution`
- `GET /api/Client/reference_provider_distribution`

### Ședințe

- `GET /api/Sedinte`
- `GET /api/Sedinte/{id}`
- `POST /api/Sedinte`
- `PUT /api/Sedinte/{id}`
- `DELETE /api/Sedinte/{id}`

Model așteptat pentru `Sedinte`:

```json
{
  "id": 1,
  "numeConsultant": "Nume Prenume",
  "startAt": "2026-04-07T10:00:00",
  "endAt": "2026-04-07T11:00:00",
  "observatii": "Detalii...",
  "createdAt": "2026-04-07T09:00:00"
}
```

## Ghid de utilizare

Pentru utilizarea aplicației, vezi documentul:

- `docs/GHID_UTILIZARE.md`

## Troubleshooting

- Dacă nu se încarcă datele, verifică dacă backend-ul rulează pe `http://localhost:5217`.
- Dacă ai erori CORS, configurează backend-ul să permită origin-ul frontend-ului.
- Dacă ora din ședințe pare deplasată, verifică formatul trimis de backend (`DateTime`) și timezone-ul serverului.
