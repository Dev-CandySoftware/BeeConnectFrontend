import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import LabeledField from "../components/LabeledField";
import { activateAccount, validateInviteCodeData } from "../api";

function ActivateAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"code" | "password">("code");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleVerifyCode = async () => {
    if (!inviteCode.trim()) {
      setError("Codul de invitație este obligatoriu.");
      return;
    }

    const code = inviteCode.trim().toUpperCase();
    setLoading(true);
    setError("");

    const result = await validateInviteCodeData(code);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.data.valid) {
      setStep("password");
      return;
    }
    setError("Cod invalid sau contul este deja activat.");
  };

  const handleActivate = async () => {
    if (!password) {
      setError("Parola este obligatorie.");
      return;
    }
    if (password.length < 8) {
      setError("Parola trebuie să aibă cel puțin 8 caractere.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await activateAccount(inviteCode.trim(), password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setActivated(true);
    setTimeout(() => navigate("/login"), 2200);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🐝</div>
          <h1 className="text-2xl font-bold text-amber-900">BeeConnect</h1>
          <p className="text-sm text-amber-600 mt-1">
            {step === "code" ? "Activează-ți contul" : "Setează parola"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === "code"
                ? "bg-amber-400 text-amber-900"
                : "bg-amber-200 text-amber-700"
            }`}
          >
            1
          </div>
          <div className="w-12 h-0.5 bg-amber-200" />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === "password"
                ? "bg-amber-400 text-amber-900"
                : "bg-amber-100 text-amber-400"
            }`}
          >
            2
          </div>
        </div>

        {activated && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs text-emerald-800">
              Cont activat cu succes. Te redirecționăm spre autentificare…
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs leading-relaxed text-red-700">{error}</p>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <LabeledField
              label="Cod de invitație"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              inputClassName="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300 text-center tracking-widest uppercase"
            />
            <Button
              variant="primarySoft"
              size="md"
              className="w-full"
              disabled={loading || activated}
              onClick={handleVerifyCode}
            >
              {loading ? "Se verifică..." : "Continuă"}
            </Button>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-600">
                Cod:{" "}
                <span className="font-medium text-amber-900 tracking-widest">
                  {inviteCode}
                </span>
              </p>
            </div>

            <LabeledField
              label="Parolă nouă"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <LabeledField
              label="Confirmă parola"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex gap-3 pt-1">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep("code")}
              >
                Înapoi
              </Button>
              <Button
                variant="primarySoft"
                size="md"
                className="flex-1"
                disabled={loading || activated}
                onClick={handleActivate}
              >
                {loading ? "Se activează..." : "Activează cont"}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-xs text-amber-600 hover:text-amber-900 transition"
          >
            Am deja cont → Loghează-te
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivateAccount;
