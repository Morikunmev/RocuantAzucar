import { Link } from "react-router-dom";
import { Card } from "../components/ui";

function NotFound() {
  return (
    <div className="h-[calc(100vh-88px)] flex items-center justify-center">
      <Card>
        <div className="text-center space-y-6">
          <h3 className="text-7xl font-bold text-amber-500">404</h3>
          <h1 className="text-3xl font-semibold text-amber-700">
            Page Not Found
          </h1>
          <p className="text-amber-600">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Go back to home
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default NotFound;
