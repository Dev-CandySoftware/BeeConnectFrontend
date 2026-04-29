import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSessionLicense, getSessionToken } from "./session";

function RequireAuth() {
  const location = useLocation();
  const token = getSessionToken();
  const license = getSessionLicense();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!license.isLicenseActive || license.licenseType === "expired") {
    return <Navigate to="/license-expired" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
