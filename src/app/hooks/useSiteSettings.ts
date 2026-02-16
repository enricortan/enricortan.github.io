import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export interface SiteSettings {
  siteName: string;
  siteTitle?: string;
  faviconUrl?: string;
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  logoText?: string;
  profileImageUrl?: string;
  heroGreeting?: string;
  heroTypingTexts?: string[];
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutExpertise: string[];
  contactEmail: string;
  contactPhone: string;
  socialLinkedIn: string;
  socialTwitter: string;
  socialDribbble: string;
  socialBehance: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Enrico R Tan",
    logoUrl: "",
    logoText: "",
    profileImageUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutExpertise: [],
    contactEmail: "",
    contactPhone: "",
    socialLinkedIn: "",
    socialTwitter: "",
    socialDribbble: "",
    socialBehance: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/settings`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSettings(data.data);
      } else {
        throw new Error(
          data.error || "Failed to fetch settings",
        );
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch settings",
      );
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refetch: fetchSettings };
}