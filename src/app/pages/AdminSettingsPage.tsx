import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Save, CheckCircle2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";

interface SiteSettings {
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

export function AdminSettingsPage() {
  const { toast, showToast, hideToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "",
    siteTitle: "",
    faviconUrl: "",
    logoUrl: "",
    logoLightUrl: "",
    logoDarkUrl: "",
    logoText: "",
    profileImageUrl: "",
    heroGreeting: "",
    heroTypingTexts: [],
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        }
      );
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        showToast("Settings saved successfully!", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Site Settings</h1>
          <p className="text-gray-600 text-lg">
            Update your portfolio content and information
          </p>
        </div>

        <form onSubmit={handleSave} className="max-w-4xl">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">General Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site Name / Your Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, siteTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Portfolio"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, faviconUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to your favicon image. If provided, this will be displayed in the browser tab.
                </p>
                {settings.faviconUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Favicon Preview:</p>
                    <img
                      src={settings.faviconUrl}
                      alt="Favicon preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-600 mt-2 hidden">Failed to load favicon image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, logoUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to your logo image. If provided, this will be displayed instead of text.
                </p>
                {settings.logoUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Logo Preview:</p>
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-600 mt-2 hidden">Failed to load logo image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Light Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logoLightUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, logoLightUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://example.com/logo-light.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to your light logo image. If provided, this will be displayed in light themes.
                </p>
                {settings.logoLightUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Light Logo Preview:</p>
                    <img
                      src={settings.logoLightUrl}
                      alt="Light logo preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-600 mt-2 hidden">Failed to load light logo image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dark Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logoDarkUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, logoDarkUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://example.com/logo-dark.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to your dark logo image. If provided, this will be displayed in dark themes.
                </p>
                {settings.logoDarkUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Dark Logo Preview:</p>
                    <img
                      src={settings.logoDarkUrl}
                      alt="Dark logo preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-600 mt-2 hidden">Failed to load dark logo image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo Text (Fallback)
                </label>
                <input
                  type="text"
                  value={settings.logoText}
                  onChange={(e) =>
                    setSettings({ ...settings, logoText: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Portfolio"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Text to display if no logo URL is provided. Falls back to "Site Name" if empty.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={settings.profileImageUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, profileImageUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://example.com/profile.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to your profile image. If provided, this will be displayed in the about section.
                </p>
                {settings.profileImageUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Profile Image Preview:</p>
                    <img
                      src={settings.profileImageUrl}
                      alt="Profile image preview"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                    />
                    <p className="text-xs text-red-600 mt-2 hidden">Failed to load profile image</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Homepage Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Homepage Hero Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Greeting
                </label>
                <input
                  type="text"
                  value={settings.heroGreeting}
                  onChange={(e) =>
                    setSettings({ ...settings, heroGreeting: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Hi"
                />
                <p className="text-sm text-gray-500 mt-2">
                  The greeting that appears before your name (e.g., "Hi", "Hello", "Hey there")
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Typing Animation Texts
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Add multiple text statements that will appear in the typing animation. Each text will rotate automatically.
                </p>
                <div className="space-y-3">
                  {settings.heroTypingTexts && settings.heroTypingTexts.length > 0 ? (
                    settings.heroTypingTexts.map((text, index) => (
                      <div key={index} className="flex gap-2">
                        <textarea
                          value={text}
                          onChange={(e) => {
                            const newTexts = [...(settings.heroTypingTexts || [])];
                            newTexts[index] = e.target.value;
                            setSettings({ ...settings, heroTypingTexts: newTexts });
                          }}
                          rows={2}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                          placeholder="I transform complex challenges into intuitive experiences..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newTexts = settings.heroTypingTexts?.filter((_, i) => i !== index) || [];
                            setSettings({ ...settings, heroTypingTexts: newTexts });
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors h-fit"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No typing texts added yet. Click "Add Text" to create one.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const newTexts = [...(settings.heroTypingTexts || []), ""];
                      setSettings({ ...settings, heroTypingTexts: newTexts });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    + Add Text
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Crafting meaningful digital experiences"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={settings.heroSubtitle}
                  onChange={(e) =>
                    setSettings({ ...settings, heroSubtitle: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                  placeholder="I'm a product designer focused on creating user-centered solutions..."
                />
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">About Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Title
                </label>
                <input
                  type="text"
                  value={settings.aboutTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Let's work together"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Description
                </label>
                <textarea
                  value={settings.aboutDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutDescription: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                  placeholder="I'm passionate about solving complex problems through thoughtful design..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Areas of Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.aboutExpertise?.join(", ") || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      aboutExpertise: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Product Design, UX Research, Design Systems"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="hello@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Social Media Links</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinkedIn}
                    onChange={(e) =>
                      setSettings({ ...settings, socialLinkedIn: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter/X URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialTwitter}
                    onChange={(e) =>
                      setSettings({ ...settings, socialTwitter: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dribbble URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialDribbble}
                    onChange={(e) =>
                      setSettings({ ...settings, socialDribbble: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="https://dribbble.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Behance URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialBehance}
                    onChange={(e) =>
                      setSettings({ ...settings, socialBehance: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="https://behance.net/..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-600 font-medium"
              >
                <CheckCircle2 className="w-5 h-5" />
                Saved successfully!
              </motion.div>
            )}
          </motion.div>
        </form>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}