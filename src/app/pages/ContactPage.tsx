import { useState } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Mail, Copy, CheckCheck } from "lucide-react";
import { useContactSettings } from "../hooks/useContactSettings";
import { XIcon } from "../components/XIcon";

function getIcon(name: string) {
  // "Twitter" icon name maps to the X brand logo
  if (name === "Twitter") return XIcon;
  const Icon = (LucideIcons as any)[name];
  return Icon ?? LucideIcons.Globe;
}

export function ContactPage() {
  const { settings, loading } = useContactSettings();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[52px] flex items-center justify-center bg-white dark:bg-black">
        <div className="w-6 h-6 border-2 border-[#1d1d1f] dark:border-[#f5f5f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-[52px]">
      <div className="max-w-[620px] mx-auto px-5 sm:px-6 py-24">

        {/* ── CTA block ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-6">
            {settings.badge}
          </p>

          {/* Heading */}
          <h1 className="text-[2.4rem] sm:text-[3.2rem] leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
            {settings.heading}
          </h1>

          {/* Description */}
          <p className="text-base text-[#6e6e73] dark:text-[#98989d] leading-relaxed mb-10">
            {settings.description}
          </p>

          {/* Email address */}
          <a
            href={`mailto:${settings.email}`}
            className="block text-xl sm:text-2xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0071e3] dark:hover:text-[#0071e3] transition-colors tracking-tight mb-7 break-all"
          >
            {settings.email}
          </a>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={copyEmail}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all border ${
                copied
                  ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                  : "border-black/[0.1] dark:border-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e]"
              }`}
            >
              {copied ? (
                <><CheckCheck className="w-4 h-4" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy address</>
              )}
            </button>

            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              {settings.buttonLabel}
            </a>
          </div>
        </motion.div>

        {/* ── Social link cards ────────────────────────────────────── */}
        {settings.socialLinks.length > 0 && (
          <div className="space-y-3">
            {settings.socialLinks.map((link, index) => {
              const Icon = getIcon(link.icon);
              return (
                <motion.a
                  key={`${link.name}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.07 }}
                  className="group flex items-center gap-4 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-5 hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-colors"
                >
                  {/* Icon box */}
                  <div className="flex-shrink-0 w-11 h-11 bg-white dark:bg-[#2c2c2e] rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  </div>

                  {/* Name + label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">{link.name}</p>
                    <p className="text-xs text-[#6e6e73] dark:text-[#98989d] truncate">{link.label}</p>
                  </div>

                  {/* Chevron */}
                  <svg
                    className="w-4 h-4 text-[#6e6e73] group-hover:translate-x-0.5 transition-transform flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}