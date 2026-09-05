import { Link } from "react-router";
import { motion } from "motion/react";
import { Mail, Linkedin, Github, Dribbble } from "lucide-react";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";
import { XIcon } from "@/app/components/XIcon";

const NAV = [
  { to: "/",         label: "About"    },
  { to: "/work",     label: "Work"     },
  { to: "/thoughts", label: "Thoughts" },
  { to: "/contact",  label: "Contact"  },
];

export function Footer() {
  const { settings } = useSiteSettings();

  const socials = [
    settings?.socialLinkedIn && { href: settings.socialLinkedIn,           Icon: Linkedin, label: "LinkedIn" },
    settings?.socialTwitter  && { href: settings.socialTwitter,            Icon: XIcon,    label: "X"        },
    settings?.socialDribbble && { href: settings.socialDribbble,           Icon: Dribbble, label: "Dribbble" },
    settings?.socialBehance  && { href: settings.socialBehance,            Icon: Github,   label: "Behance"  },
    settings?.contactEmail   && { href: `mailto:${settings.contactEmail}`, Icon: Mail,     label: "Email"    },
  ].filter(Boolean) as { href: string; Icon: any; label: string }[];

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.07] bg-[#f5f5f7] dark:bg-[#0a0a0a]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left: name + copyright */}
        <p className="text-xs text-[#98989d] order-3 sm:order-1 shrink-0">
          © {new Date().getFullYear()} {settings?.siteName || "Portfolio"}
        </p>

        {/* Centre: social icons */}
        {socials.length > 0 && (
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            {socials.map(({ href, Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        )}

        {/* Right: nav links */}
        <nav className="flex items-center gap-5 order-2 sm:order-3">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}