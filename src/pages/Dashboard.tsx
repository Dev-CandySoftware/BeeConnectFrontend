import StatCard from "../components/StatCard";
import { type DistributionField } from "../api/clients";

const chartConfigs: Array<{ field: DistributionField; title: string }> = [
  { field: "income_distribution", title: "Venit" },
  { field: "age_distribution", title: "Vârstă" },
  { field: "Ocupation_distribution", title: "Ocupație" },
  { field: "marital_status_distribution", title: "Stare civilă" },
  { field: "number_of_children", title: "Număr copii" },
  { field: "since_i_knew_distribution", title: "De când cunosc persoana" },
  {
    field: "how_well_i_knew_distribution",
    title: "Cât de bine cunosc persoana",
  },
  { field: "meeting_frequency_distribution", title: "Frecvența întâlnirilor" },
  { field: "contact_info_distribution", title: "Posibilități de contact" },
  { field: "reference_provider_distribution", title: "Furnizori de referințe" },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Analiză contacte
              </p>
              <h1 className="text-4xl font-extrabold text-amber-900 sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-amber-700">
                Statistici vizuale pentru distribuția contactelor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-2">
        {chartConfigs.map(({ field, title }) => (
          <div
            key={field}
            className="group rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
              Distribuție
            </p>
            <h2 className="mb-4 text-base font-semibold text-amber-900">
              {title}
            </h2>
            <StatCard field={field} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
