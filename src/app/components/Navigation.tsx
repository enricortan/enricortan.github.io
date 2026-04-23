import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoSymbol } from "./LogoSymbol";

export function Navigation() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "About" },
    { path: "/work", label: "Work" },
    { path: "/thoughts", label: "Thoughts" },
    { path: "/contact", label: "Contact" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black/80 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors"
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 h-[52px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center">
          {settings?.logoLightUrl && settings?.logoDarkUrl ? (
            <>
              <img src={settings.logoLightUrl} alt={settings.siteName || "Logo"} className="h-6 w-auto object-contain dark:hidden" />
              <img src={settings.logoDarkUrl}  alt={settings.siteName || "Logo"} className="h-6 w-auto object-contain hidden dark:block" />
            </>
          ) : settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName || "Logo"} className="h-6 w-auto object-contain" />
          ) : settings?.logoText ? (
            <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {settings.logoText}
            </span>
          ) : (
            <LogoSymbol height={28} />
          )}
        </Link>

        {/* Desktop nav — centred like Apple */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path === "/work" && location.pathname.startsWith("/work"));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1 text-xs rounded-md transition-colors ${
                  isActive
                    ? "text-[#1d1d1f] dark:text-[#f5f5f7]"
                    : "text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-black/[0.06] dark:bg-white/[0.08] rounded-md -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
          >
            {isDarkMode
              ? <Sun  className="w-4 h-4 text-[#6e6e73] dark:text-[#98989d]" />
              : <Moon className="w-4 h-4 text-[#6e6e73]" />
            }
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
          >
            {isMobileMenuOpen
              ? <X    className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
              : <Menu className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-black/95 backdrop-blur-2xl"
          >
            <div className="px-6 sm:px-10 py-3 space-y-0.5">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path === "/work" && location.pathname.startsWith("/work"));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-black/[0.06] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]"
                        : "text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}