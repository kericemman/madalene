import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpenText,
  BookMarked,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Image,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Settings,
  SlidersHorizontal,
  Users,
  X
} from "lucide-react";
import BrandLogo from "../components/BrandLogo.jsx";
import { clearAdminAccessToken, getCurrentAdmin, logoutAdmin } from "../services/api.js";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Results", href: "/admin/results", icon: FileText },
  { label: "Assessment", href: "/admin/assessment", icon: SlidersHorizontal },
  { label: "Offers", href: "/admin/offers", icon: BriefcaseBusiness },
  { label: "Resources", href: "/admin/resources", icon: BookMarked },
  { label: "Applications", href: "/admin/applications", icon: ClipboardCheck },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarClock },
  { label: "Code of Resonance", href: "/admin/code-of-resonance", icon: BookOpenText },
  { label: "Code Automation", href: "/admin/code-automation", icon: Mail },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings }
];

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("loading");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getCurrentAdmin()
      .then((response) => {
        if (!active) return;
        setAdmin(response.data.admin);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        clearAdminAccessToken();
        setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-charcoal text-mistWhite">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mutedMint">Trust Hub Console</p>
          <p className="mt-4 font-serif text-3xl">Loading admin session...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-mistWhite text-charcoal lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-sage bg-charcoal text-mistWhite lg:block">
        <div className="sticky top-0 flex max-h-screen min-h-screen flex-col overflow-y-auto p-6">
          <BrandLogo variant="footer" />
          <nav className="mt-10 grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded border px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-mutedMint/35 bg-mistWhite/[0.08] text-mutedMint"
                      : "border-transparent text-mistWhite/70 hover:border-mutedMint/25 hover:bg-mistWhite/[0.06] hover:text-mutedMint"
                  }`
                }
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto border-t border-mistWhite/12 pt-5">
            <p className="text-sm font-semibold">{admin?.name}</p>
            <p className="mt-1 text-xs text-mistWhite/55">{admin?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-mistWhite/20 px-4 py-2.5 text-sm font-bold text-mistWhite transition hover:border-mutedMint hover:text-mutedMint"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-sage bg-mistWhite/95 backdrop-blur lg:hidden">
          <div className="container-shell flex min-h-[76px] items-center justify-between py-3">
            <BrandLogo />
            <button
              type="button"
              className="inline-grid size-11 place-items-center rounded-full border border-charcoal/10 bg-charcoal text-mistWhite"
              aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
              onClick={() => setMobileOpen((isOpen) => !isOpen)}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="border-t border-sage bg-charcoal text-mistWhite">
              <nav className="container-shell grid gap-1 py-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    end={item.href === "/admin"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded px-3 py-3 text-sm font-semibold ${
                        isActive ? "bg-mistWhite/[0.08] text-mutedMint" : "text-mistWhite/72"
                      }`
                    }
                  >
                    <item.icon size={18} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-3 rounded px-3 py-3 text-sm font-semibold text-mutedMint"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Sign out
                </button>
              </nav>
            </div>
          )}
        </header>

        <main className="container-shell py-8 lg:py-10">
          <Outlet context={{ admin }} />
        </main>
      </div>
    </div>
  );
}
