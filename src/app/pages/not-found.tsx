import { Link, useNavigate } from "react-router";
import { Home, Heart } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Heart className="h-12 w-12 text-teal-600 fill-teal-600" aria-hidden />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <p className="text-6xl font-bold text-gray-200 mb-2">404</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            That link does not match any page on Sage With You. If you followed an old bookmark, try the home page or
            the menu above.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link to="/" className="inline-flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
