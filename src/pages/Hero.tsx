import { useNavigate } from "react-router-dom";
import { getSessionToken } from "../auth/session";

function Hero() {
  const navigate = useNavigate();
  const token = getSessionToken();

  if (!token) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="text-center max-w-xl space-y-6">
          <div className="text-6xl mb-2">🐝</div>
          <h1 className="text-6xl font-bold text-amber-900 tracking-tight leading-tight">
            BeeConnect
          </h1>
          <p className="text-base font-light text-amber-700">
            Intră în aplicație pentru a continua.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 text-sm font-medium px-6 py-2.5 rounded-full transition"
            >
              Loghează-te
            </button>
            <button
              onClick={() => navigate("/activate")}
              className="border border-amber-300 text-amber-700 hover:bg-amber-100 text-sm font-medium px-6 py-2.5 rounded-full transition"
            >
              Activează cont
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xl space-y-6">
        <div className="text-6xl mb-2">🐝</div>
        <h1 className="text-6xl font-bold text-amber-900 tracking-tight leading-tight">
          BeeConnect
        </h1>
        <p className="text-base font-light text-amber-700">
          Intră în aplicație și folosește meniul lateral pentru navigare rapidă.
          <br />
          Până fac o bară de navigare te descurci de aici ❤️
        </p>
      </div>
    </div>
  );
}

export default Hero;
