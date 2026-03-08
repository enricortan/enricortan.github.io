import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type View = "form" | "success" | "invalid-token";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains uppercase", ok: /[A-Z]/.test(password) },
    { label: "Contains a symbol", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const bar = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-500"];

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < score ? bar[score] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <div key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-green-500" : "bg-gray-300"}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const [view, setView] = useState<View>(token ? "form" : "invalid-token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate token exists
  useEffect(() => {
    if (!token) setView("invalid-token");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setView("success");
      } else if (data.message?.toLowerCase().includes("token") || data.message?.toLowerCase().includes("expired")) {
        setView("invalid-token");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 light">
      <div className="w-full max-w-md">

        {/* ── Form ── */}
        {view === "form" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Set new password</h1>
              <p className="text-gray-600 text-center mb-8">
                Choose a strong password for your admin account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                      placeholder="Enter new password"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {newPassword && <PasswordStrength password={newPassword} />}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                      placeholder="Repeat new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                    </p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? "Saving…" : <><ShieldCheck className="w-5 h-5" /> Set new password</>}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── Success ── */}
        {view === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-3 text-gray-900">Password updated!</h1>
              <p className="text-gray-600 mb-8">
                Your admin password has been changed successfully. You can now log in with your new password.
              </p>

              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Go to login
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Invalid / missing token ── */}
        {view === "invalid-token" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <XCircle className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold mb-3 text-gray-900">Link invalid or expired</h1>
              <p className="text-gray-600 mb-8">
                This password reset link is invalid or has expired. Reset links are valid for 1 hour. Please request a new one.
              </p>

              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Back to login
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
