import { Outlet, Link, ScrollRestoration, useLocation, useNavigate } from "react-router";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { FOOTER_HEADING_CLASS, SiteLogo } from "./SiteLogo";
import { useState, useEffect } from "react";
import { AccessibilityWidget } from "./accessibility-widget";
import { CookieConsentBanner } from "./CookieConsentBanner";
import { supabase } from "../../utils/supabase";
import { initSupabaseAuth, isInvalidRefreshTokenError, clearStaleSupabaseSession } from "../../utils/authSession";
import { Toaster } from "sonner";
import { SiteMeta } from "./SiteMeta";
import { initAnalyticsIfAllowed, trackPageView } from "../../utils/analytics";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initAnalyticsIfAllowed();
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    void checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user?.email || null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    await initSupabaseAuth();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error && isInvalidRefreshTokenError(error)) {
      await clearStaleSupabaseSession();
      return;
    }
    if (session) {
      setIsAuthenticated(true);
      setUserEmail(session.user?.email || null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate('/');
  };

  type NavChild = { name: string; href: string };
  type NavItem = { name: string; href: string; children?: NavChild[] };

  const navigation: NavItem[] = [
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Sage Badge", href: "/sage-badge" },
    {
      name: "Resources",
      href: "/resources",
      children: [{ name: "Library", href: "/library" }],
    },
    { name: "Assessments", href: "/assessments" },
  ];

  const footerExploreLinks = [
    { name: "About us", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Sage Badge", href: "/sage-badge" },
    { name: "Contact", href: "/contact" },
  ];

  const footerResourceLinks = [
    { name: "Assessments", href: "/assessments" },
    { name: "Library", href: "/library" },
    { name: "FAQs", href: "/resources#faq" },
    { name: "Support", href: "/contact" },
  ];

  const footerLinkClass =
    "text-sm text-white transition-colors hover:text-white/80";

  const legalLinks = [
    { name: "Privacy policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Accessibility", href: "/accessibility-features" },
  ];

  const isActive = (href: string, children?: NavChild[]) => {
    if (location.pathname.startsWith(href)) return true;
    return children?.some((child) => location.pathname.startsWith(child.href)) ?? false;
  };

  const navLinkClass = (href: string, children?: NavChild[]) =>
    isActive(href, children)
      ? "text-sage-600 font-medium"
      : "text-gray-700 hover:text-sage-600";

  useEffect(() => {
    const current = `${location.pathname}${location.search}`;
    const stored = sessionStorage.getItem("swy_path");
    if (stored !== current) {
      sessionStorage.setItem("swy_prev_path", stored ?? "");
      sessionStorage.setItem("swy_path", current);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <ScrollRestoration />
      <SiteMeta />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-2 min-h-[3.75rem] py-2 sm:min-h-[4.75rem] sm:py-2.5 md:min-h-[5.25rem] md:py-3">
            <SiteLogo variant="header" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) =>
                item.children?.length ? (
                  <div key={item.name} className="relative group">
                    <div className="flex items-center gap-0.5">
                      <Link
                        to={item.href}
                        className={`text-base transition-colors ${navLinkClass(item.href, item.children)}`}
                      >
                        {item.name}
                      </Link>
                      <ChevronDown
                        className={`h-4 w-4 transition-colors ${navLinkClass(item.href, item.children)}`}
                        aria-hidden
                      />
                    </div>
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all">
                      <div className="min-w-[10rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              location.pathname.startsWith(child.href)
                                ? "bg-sage-50 text-sage-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50 hover:text-sage-600"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-base transition-colors ${navLinkClass(item.href)}`}
                  >
                    {item.name}
                  </Link>
                ),
              )}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-1.5 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                  >
                    <User className="h-4 w-4 text-sage-600" />
                    <span className="text-sm text-sage-700">{userEmail?.split("@")[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors ml-2"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base transition-colors ${
                      isActive(item.href, item.children)
                        ? "text-sage-600 bg-sage-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 pl-8 pr-4 text-base transition-colors ${
                        location.pathname.startsWith(child.href)
                          ? "text-sage-600 bg-sage-50 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-sage-600" />
                    {userEmail?.split("@")[0] ?? "Account"}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 inline-block mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <CookieConsentBanner
        onConsentChange={() => {
          initAnalyticsIfAllowed();
          trackPageView(location.pathname);
        }}
      />

      <Toaster position="bottom-right" theme="light" richColors closeButton />

      {/* Accessibility Widget */}
      <AccessibilityWidget />

      {/* Footer */}
      <footer className="bg-sage-950 text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-y-10 gap-x-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14 items-start">
            {/* Brand */}
            <div className="w-max max-w-full sm:col-span-2 lg:col-span-4 lg:pr-6 xl:pr-10">
              <div className="mb-4 min-h-10 sm:min-h-11 flex items-center">
                <SiteLogo variant="footer" linkToHome={false} />
              </div>
              <p className="text-sm text-white leading-relaxed">
                <span className="block whitespace-nowrap">
                  Supporting individuals and caregivers
                </span>
                <span className="block whitespace-nowrap">
                  with evidence-informed guidance for
                </span>
                <span className="block whitespace-nowrap">
                  aging with dignity and confidence at home.
                </span>
              </p>
            </div>

            <div className="min-w-0 lg:col-span-2">
              <h3 className={`${FOOTER_HEADING_CLASS} mb-4`}>Explore</h3>
              <ul className="space-y-3">
                {footerExploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-2">
              <h3 className={`${FOOTER_HEADING_CLASS} mb-4`}>Resources</h3>
              <ul className="space-y-3">
                {footerResourceLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-2">
              <h3 className={`${FOOTER_HEADING_CLASS} mb-4`}>Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="w-max max-w-full sm:col-span-2 lg:col-span-2">
              <h3 className={`${FOOTER_HEADING_CLASS} mb-4`}>Get in Touch</h3>
              <ul className="space-y-3 mb-4">
                <li>
                  <Link to="/contact" className={footerLinkClass}>
                    Contact us
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@sageelan.org" className={footerLinkClass}>
                    info@sageelan.org
                  </a>
                </li>
              </ul>
              <p className="text-sm text-white mb-2">
                <a
                  href="https://sageelan.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap transition-colors hover:text-white/80 underline-offset-2 hover:underline"
                >
                  SageÉlan Foundation, Inc.
                </a>
              </p>
              <p className="mb-2">
                <a
                  href="https://donorbox.org/sageelan-foundation-impact-fund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/90 transition-colors hover:text-white underline-offset-2 hover:underline"
                >
                  Donate to the Impact Fund
                </a>
              </p>
              <p className="text-sm text-white leading-relaxed">
                <span className="block whitespace-nowrap">Committed to supporting</span>
                <span className="block whitespace-nowrap">wellbeing and confidence</span>
                <span className="block whitespace-nowrap">for those choosing to live</span>
                <span className="block whitespace-nowrap">in place.</span>
              </p>
            </div>
          </div>

          <div className="border-t border-sage-800 mt-8 pt-8 text-center text-sm text-white">
            <p>
              &copy; {new Date().getFullYear()} SageÉlan Foundation, Inc. All
              rights reserved.
            </p>
            <p className="mt-2">
              Part of the{' '}
              <a
                href="https://sageelan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-white underline-offset-2 hover:underline"
              >
                SageÉlan Network
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}