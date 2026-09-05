import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Home,
  Mail,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clearAdminSession, getAdminSession } from "./AdminAuthGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { path: "/admin/homepage",     label: "Home Page",    icon: Home },
  { path: "/admin/case-studies", label: "Case Studies", icon: FolderOpen },
  { path: "/admin/blog",         label: "Blog Posts",   icon: FileText },
  { path: "/admin/contact",      label: "Contact Page", icon: Mail },
  { path: "/admin/settings",     label: "Settings",     icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const session = getAdminSession();
      if (!session) { setTimeLeft("Expired"); return; }
      const ms = session.expiresAt - Date.now();
      if (ms <= 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#1c1c1e] select-none">

      {/* Wordmark */}
      <div className="px-5 pt-7 pb-6">
        <p className="text-white text-sm font-semibold tracking-tight">Admin Panel</p>
        <p className="text-white/30 text-xs mt-0.5">Portfolio CMS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white/[0.12] text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/40"}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}

        {/* Live site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150 mt-2 border-t border-white/[0.06] pt-4"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Live Site
        </a>
      </nav>

      {/* Footer: session + logout */}
      <div className="px-3 pb-6 pt-4 border-t border-white/[0.06] space-y-1">
        {/* Session timer */}
        <div className="flex items-center gap-2 px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
          <div>
            <p className="text-white/25 text-[10px] leading-none mb-0.5">Session expires in</p>
            <p className={`text-xs font-medium ${timeLeft === "Expired" ? "text-red-400" : "text-white/40"}`}>
              {timeLeft || "…"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] light flex">

      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#1c1c1e]">
        <p className="text-white text-sm font-semibold">Admin Panel</p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile sidebar drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full w-56 z-50"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-56 min-h-screen pt-14 lg:pt-0 text-[#1d1d1f]">
        {children}
      </main>
    </div>
  );
}
