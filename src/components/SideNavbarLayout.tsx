import { useEffect, useReducer } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PROFILE_UPDATED_EVENT } from "../profileEvents";
import {
  clearSession,
  getSessionLicense,
  getSessionProfile,
  getSessionRole,
  getSessionToken,
} from "../auth/session";

function SideNavbarLayout() {
  const navigate = useNavigate();
  const [, refreshProfile] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const onProfile = () => refreshProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfile);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onProfile);
  }, []);

  const token = getSessionToken();
  const license = getSessionLicense();
  const { nume, prenume } = getSessionProfile();
  const role = getSessionRole();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-amber-500 text-white shadow-sm"
        : "text-amber-800 hover:bg-amber-100"
    }`;

  const handleLogout = () => {
    clearSession({ includeProfile: true });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white md:flex">
      <aside className="flex flex-col border-b border-amber-200 bg-white/80 p-4 backdrop-blur md:sticky md:top-0 md:h-screen md:min-h-0 md:w-72 md:border-b-0 md:border-r md:p-6">
        <div className="shrink-0 space-y-4">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              BeeConnect
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-amber-900">
              Navigare
            </h2>
          </div>

          {token ? (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-amber-950">
                    {nume} {prenume}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-amber-600">{role}</p>
                  <p className="mt-1 truncate text-[11px] text-amber-700">
                    Licenta: {license.licenseType}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 text-[11px] font-medium text-amber-700 hover:text-amber-950"
                  >
                    Delogare
                  </button>
                </div>
                <NavLink
                  to="/setari"
                  title="Setări"
                  className={({ isActive }) =>
                    `shrink-0 rounded-lg p-2 text-lg leading-none transition md:text-base ${
                      isActive
                        ? "bg-amber-200 text-amber-900"
                        : "text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                    }`
                  }
                >
                  <span aria-hidden="true">⚙️</span>
                  <span className="sr-only">Setări</span>
                </NavLink>
              </div>
            </div>
          ) : null}
        </div>

        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:mt-6">
          <NavLink to="/" end className={navItemClass}>
            <span aria-hidden="true">🏠</span>
            <span>Acasă</span>
          </NavLink>
          <NavLink to="/contacte" className={navItemClass}>
            <span aria-hidden="true">👥</span>
            <span>Contacte</span>
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            <span aria-hidden="true">📊</span>
            <span>Grafice</span>
          </NavLink>
          <NavLink to="/sedinte" className={navItemClass}>
            <span aria-hidden="true">🗓️</span>
            <span>Ședințe</span>
          </NavLink>
          <NavLink to="/cursuri" className={navItemClass}>
            <span aria-hidden="true">📚</span>
            <span>Cursuri</span>
          </NavLink>
          {role === "SuperAdmin" && (
            <NavLink to="/jurnal-audit" className={navItemClass}>
              <span aria-hidden="true">📜</span>
              <span>Jurnal audit</span>
            </NavLink>
          )}
          {(role === "Manager" || role === "SuperAdmin") && (
            <>
              <NavLink to="/echipa" className={navItemClass}>
                <span aria-hidden="true">👤</span>
                <span>Echipa mea</span>
              </NavLink>
              <NavLink to="/inregistrare-utilizator" className={navItemClass}>
                <span aria-hidden="true">➕</span>
                <span>Înregistrare utilizator</span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default SideNavbarLayout;
