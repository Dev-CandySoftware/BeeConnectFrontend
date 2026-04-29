import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

function NoPage() {
  const navigate = useNavigate();
  return (
    <div className=" min-h-screen bg-red-500 flex items-center justify-center px-4">
      <div className="text-center max-w-xl text-white space-y-6">
        <h1 className="text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
          404 - Page Not Found
        </h1>
        <p className="text-lg md:text-xl font-light">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            type="button"
            size="md"
            onClick={() => navigate("/")}
            className="!rounded-lg !bg-yellow-600 !text-black shadow-lg transition-all duration-300 hover:!bg-yellow-900 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
export default NoPage;
