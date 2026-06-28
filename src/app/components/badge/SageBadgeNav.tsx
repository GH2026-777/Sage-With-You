import { Link, useLocation } from "react-router";
import { Award } from "lucide-react";

const links = [
  { name: "About Sage Badge", href: "/sage-badge" },
  { name: "Verified companies", href: "/sage-badge/companies" },
  { name: "For organizations", href: "/sage-badge/for-companies" },
  { name: "Share your experience", href: "/sage-badge/experience" },
];

export function SageBadgeNav() {
  const location = useLocation();

  return (
    <div className="border-b border-sage-200 bg-sage-50/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/sage-badge"
            className="inline-flex items-center gap-2 font-semibold text-sage-900 hover:text-sage-700"
          >
            <Award className="h-5 w-5 text-sage-600" aria-hidden />
            Sage Badge
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {links.map((link) => {
              const active =
                location.pathname === link.href ||
                (link.href !== "/sage-badge" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={
                    active
                      ? "font-medium text-sage-800 underline underline-offset-4"
                      : "text-gray-600 hover:text-sage-700"
                  }
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
