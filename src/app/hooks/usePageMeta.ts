import { useEffect } from "react";
import { useSiteSettings } from "./useSiteSettings";

export function usePageMeta(pageTitle?: string) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    // Update page title
    const siteName = settings?.siteName || "Portfolio";
    const siteTitle = settings?.siteTitle || siteName;
    
    if (pageTitle) {
      document.title = `${pageTitle} | ${siteTitle}`;
    } else {
      document.title = siteTitle;
    }

    // Update favicon
    if (settings?.faviconUrl) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach(link => link.remove());

      // Add new favicon
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/x-icon";
      link.href = settings.faviconUrl;
      document.head.appendChild(link);

      // Also add apple-touch-icon
      const appleTouchIcon = document.createElement("link");
      appleTouchIcon.rel = "apple-touch-icon";
      appleTouchIcon.href = settings.faviconUrl;
      document.head.appendChild(appleTouchIcon);
    }
  }, [pageTitle, settings]);
}
