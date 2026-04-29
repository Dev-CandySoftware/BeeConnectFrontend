import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { clearSession, getSessionLicense } from "../auth/session";

function LicenseExpiredPage() {
  const navigate = useNavigate();
  const { licenseExpiryDate } = getSessionLicense();

  const handleLogout = () => {
    clearSession({ includeProfile: true });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-amber-900">Licenta expirata</h1>
        <p className="mt-3 text-sm text-amber-700">
          Contul tau nu mai are acces la endpoint-urile protejate.
        </p>
        {licenseExpiryDate ? (
          <p className="mt-2 text-xs text-amber-600">
            Data expirarii: {new Date(licenseExpiryDate).toLocaleString("ro-RO")}
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" size="md" onClick={handleLogout}>
            Delogare
          </Button>
          <Button variant="primarySoft" size="md" onClick={() => navigate("/login")}>
            Inapoi la login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LicenseExpiredPage;
