import { getSessionRole } from "../auth/session";
import { Button } from "../components/Button";

function CursuriPage() {
  const role = getSessionRole();
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
        <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Modul nou
        </p>
        <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-amber-900">Cursuri</h1>
        {(role === "SuperAdmin" || role === "Manager") &&(
          <Button
            variant="primary"
            size="md"
            shadow={true}
            className="ml-auto"
          >
            Adauga curs(in curs de implementare)
          </Button>
        )}
        </div>
      </div>
    </div>
  );
}

export default CursuriPage;
