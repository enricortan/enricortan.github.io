import { useState, useEffect } from "react";

export interface ContactSocialLink {
  name: string;   // Display name e.g. "X", "LinkedIn"
  icon: string;   // Lucide icon name e.g. "Twitter", "Linkedin"
  url: string;    // Full URL
  label: string;  // Subtitle shown under name, e.g. "@handle"
}

export interface ContactSettings {
  // Eyebrow badge
  badge: string;
  // Main heading
  heading: string;
  // Paragraph below heading
  description: string;
  // Email address displayed + used in mailto
  email: string;
  // "Send me an email" button label
  buttonLabel: string;
  // Social link cards listed below the CTA
  socialLinks: ContactSocialLink[];
}

const DEFAULT_SETTINGS: ContactSettings = {
  badge: "Get In Touch",
  heading: "Ready to start your project?",
  description:
    "Let's discuss how we can work together to bring your ideas to life.",
  email: "hello@yourname.com",
  buttonLabel: "Send me an email",
  socialLinks: [
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com",   label: "linkedin.com/in/yourname" },
    { name: "X",        icon: "Twitter",  url: "https://x.com",          label: "@yourname" },
    { name: "GitHub",   icon: "Github",   url: "https://github.com",     label: "github.com/yourname" },
    { name: "Dribbble", icon: "Dribbble", url: "https://dribbble.com",   label: "yourname" },
  ],
};

const STORAGE_KEY = "contact_settings_v2";

/** Migrate old contact_settings shape → new shape */
function migrate(raw: any): ContactSettings {
  return {
    badge:       raw.badge       ?? raw.heroBadge         ?? DEFAULT_SETTINGS.badge,
    heading:     raw.heading     ?? raw.ctaHeading         ?? DEFAULT_SETTINGS.heading,
    description: raw.description ?? raw.ctaDescription     ?? DEFAULT_SETTINGS.description,
    email:       raw.email       ?? raw.primaryEmail       ?? raw.ctaEmail ?? DEFAULT_SETTINGS.email,
    buttonLabel: raw.buttonLabel ?? raw.ctaButtonLabel     ?? DEFAULT_SETTINGS.buttonLabel,
    socialLinks: (raw.socialLinks ?? DEFAULT_SETTINGS.socialLinks).map(
      (l: any): ContactSocialLink => ({
        name:  l.name  ?? "",
        icon:  l.icon  ?? "Globe",
        url:   l.url   ?? "https://",
        label: l.label ?? "",
      })
    ),
  };
}

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    try {
      // Try new key first, fall back to old key
      const raw =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("contact_settings");
      if (raw) {
        setSettings(migrate(JSON.parse(raw)));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const save = (next: ContactSettings): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSettings(next);
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("contact_settings");
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, loading, save, reset, refetch: load, DEFAULT_SETTINGS };
}
