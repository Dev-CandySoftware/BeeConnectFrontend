import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import LabeledField from "../components/LabeledField";
import { loginUser } from "../api/auth";
import { setSessionAuth, setSessionProfile } from "./session";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Email-ul este obligatoriu.");
      return;
    }
    if (!password) {
      setError("Parola este obligatorie.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await loginUser(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const data = result.data;
    setSessionAuth({
      token: data.token,
      role: data.role,
      userId: data.id,
      branchId: data.branchId,
      licenseType: data.licenseType,
      isLicenseActive: data.isLicenseActive,
      licenseExpiryDate: data.licenseExpiryDate,
    });
    setSessionProfile({
      nume: data.nume,
      prenume: data.prenume,
      email: data.email,
    });
    if (!data.isLicenseActive || data.licenseType === "expired") {
      navigate("/license-expired");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐝</div>
          <h1 className="text-2xl font-bold text-amber-900">BeeConnect</h1>
          <p className="text-sm text-amber-600 mt-1">
            Loghează-te în contul tău
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <LabeledField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <LabeledField
            label="Parolă"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="primarySoft"
            size="md"
            className="w-full mt-2"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Se loghează..." : "Loghează-te"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/activate")}
            className="text-xs text-amber-600 hover:text-amber-900 transition"
          >
            Ai un cod de invitație? → Activează cont
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
