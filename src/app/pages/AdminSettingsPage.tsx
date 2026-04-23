import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Save, CheckCircle2, ShieldCheck, Eye, EyeOff, AlertCircle, XCircle, KeyRound } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { getAdminSession } from "@/app/components/AdminAuthGuard";

interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  logoText?: string;
  profileImageUrl?: string;
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
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "",
    logoUrl: "",
    logoLightUrl: "",
    logoDarkUrl: "",
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Change password state ─────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [passwordSaving, setPasswordSaving]   = useState(false);
  const [passwordSaved, setPasswordSaved]     = useState(false);
  const [passwordError, setPasswordError]     = useState("");

  const passwordChecks = [
    { label: "8+ characters",   ok: newPassword.length >= 8 },
    { label: "Number",          ok: /\d/.test(newPassword) },
    { label: "Uppercase",       ok: /[A-Z]/.test(newPassword) },
    { label: "Symbol",          ok: /[^A-Za-z0-9]/.test(newPassword) },
  ];
  const passwordScore = passwordChecks.filter(c => c.ok).length;
  const strengthBar   = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-500"];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("New passwords do not match."); return; }
    setPasswordSaving(true);
    try {
      const session = getAdminSession();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": session?.token || "",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setPasswordSaved(true);
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => setPasswordSaved(false), 4000);
      } else {
        setPasswordError(data.message || "Failed to change password. Check your current password and try again.");
      }
    } catch {
      setPasswordError("Request failed. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

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
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
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
                    X (formerly Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialTwitter}
                    onChange={(e) =>
                      setSettings({ ...settings, socialTwitter: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="https://x.com/..."
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
            className="flex items-center gap-4 mb-10"
          >
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <>Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
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

        {/* ── Security / Change Password ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl pb-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">Change your admin panel password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
              {/* Current password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="Enter current password"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="Enter new password"
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[0,1,2,3].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordScore ? strengthBar[passwordScore] : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <span className={`text-xs font-semibold w-12 text-right ${
                        passwordScore <= 1 ? "text-red-500" : passwordScore === 2 ? "text-yellow-600" : "text-green-600"
                      }`}>{strengthLabel[passwordScore]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {passwordChecks.map(c => (
                        <div key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.ok ? "bg-green-500" : "bg-gray-300"}`} />
                          {c.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="Repeat new password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Passwords do not match</p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</p>
                )}
              </div>

              {/* Error */}
              {passwordError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {passwordError}
                </motion.div>
              )}

              {/* Submit row */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={passwordSaving || !currentPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? "Saving…" : <><ShieldCheck className="w-5 h-5" /> Update password</>}
                </button>
                {passwordSaved && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-green-600 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Password updated!
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </AdminLayout>
  );
}