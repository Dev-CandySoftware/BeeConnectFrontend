import { useParams, useLocation } from "react-router-dom";
import ContactPage from "./ContactPage";

function ContacteUserPage() {
  const { userId } = useParams();
  const location = useLocation();
  const userName = location.state?.userName ?? "";

  return <ContactPage overrideUserId={Number(userId)} overrideName={userName} />;
}

export default ContacteUserPage;