import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/work", label: "Work" },
    { path: "/thoughts", label: "Thoughts" },
    { path: "/contact", label: "Contact" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-colors"
    >
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-4 sm:py-6">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <Link to="/" className="relative group flex items-center" onClick={closeMobileMenu}>
            {settings?.logoLightUrl && settings?.logoDarkUrl ? (
              // Display theme-specific logo if both are available
              <>
                <motion.img
                  src={settings.logoLightUrl}
                  alt={settings.siteName || "Logo"}
                  className="h-7 sm:h-8 md:h-10 w-auto object-contain dark:hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.img
                  src={settings.logoDarkUrl}
                  alt={settings.siteName || "Logo"}
                  className="h-7 sm:h-8 md:h-10 w-auto object-contain hidden dark:block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </>
            ) : settings?.logoUrl ? (
              // Display single logo image if available
              <motion.img
                src={settings.logoUrl}
                alt={settings.siteName || "Logo"}
                className="h-7 sm:h-8 md:h-10 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              // Display text logo if no image
              <div className="text-lg sm:text-xl font-semibold">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {settings?.logoText || settings?.siteName || ""}
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}