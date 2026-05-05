import { Routes, Route, HashRouter } from "react-router-dom";
import Hero from "./pages/Hero";
import NoPage from "./pages/NoPage";
import AddContactForm from "./forms/AddContactForm";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import EditContactForm from "./forms/EditContactForm";
import SideNavbarLayout from "./components/SideNavbarLayout";
import SedintePage from "./pages/SedintePage";
import EditSedintaPage from "./forms/EditSedintaForm";
import AddSedintaForm from "./forms/AddSedintaForm";
import CursuriPage from "./pages/CursuriPage";
import ActivateAccount from "./auth/ActivateAccount";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import SetariPage from "./pages/SetariPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import EchipaPage from "./pages/EchipaPage";
import AuditLogPage from "./pages/AuditLogPage";
import LicenseExpiredPage from "./pages/LicenseExpiredPage";
import ContacteUserPage from "./pages/ContacteUserPage";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/license-expired" element={<LicenseExpiredPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<SideNavbarLayout />}>
            <Route path="/" element={<Hero />} />
            <Route path="/contact/add" element={<AddContactForm />} />
            <Route path="/contact/add/:userId" element={<AddContactForm />} />
            <Route path="/contact/edit/:id" element={<EditContactForm />} />
            <Route path="/contacte" element={<ContactPage />} />
            <Route path="/contacte/user/:userId" element={<ContacteUserPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sedinte" element={<SedintePage />} />
            <Route path="/sedinte/add" element={<AddSedintaForm />} />
            <Route path="/sedinte/edit/:id" element={<EditSedintaPage />} />
            <Route path="/cursuri" element={<CursuriPage />} />
            <Route path="/setari" element={<SetariPage />} />
            <Route
              path="/inregistrare-utilizator"
              element={<RegisterUserPage />}
            />
            <Route path="/echipa" element={<EchipaPage />} />
            <Route path="/jurnal-audit" element={<AuditLogPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
