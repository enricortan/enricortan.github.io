import { Link } from "react-router";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600">
            © {new Date().getFullYear()} {settings?.siteName || "Your Name"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Work
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}