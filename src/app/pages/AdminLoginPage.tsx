import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, LogIn, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams, Navigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { createAdminSession, getAdminSession } from "@/app/components/AdminAuthGuard";

// Shared input class — Apple-style: filled bg, no border, blue focus ring
const INPUT =
  "w-full px-4 py-3 bg-[#f5f5f7] rounded-xl text-[#1d1d1f] placeholder-[#6e6e73] outline-none focus:ring-2 focus:ring-[#0071e3] transition-all text-sm";

type View = "login" | "forgot" | "forgot-sent";

export function AdminLoginPage() {
  const [view, setView] = useState<View>("login");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if (getAdminSession()) {
    const dest = searchParams.get("redirect") || "/admin/dashboard";
    return <Navigate to={dest} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();
      if (data.success) {
        createAdminSession(data.token);
        navigate(searchParams.get("redirect") || "/admin/dashboard", { replace: true });
      } else {
        setError(data.message || "Incorrect password.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ email: "enrico.sag@gmail.com" }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setView("forgot-sent");
      } else {
        setError(data.message || "Could not send reset email.");
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirected = !!searchParams.get("redirect");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-6 light">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* ── Login ── */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-14 h-14 bg-[#1d1d1f] rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-[#1d1d1f] mb-1">
                Admin Login
              </h1>
              <p className="text-[#6e6e73] text-sm text-center mb-8">
                Enter your password to access the dashboard
              </p>

              {redirected && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Your session has expired. Please log in again.
                </motion.div>
              )}

              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6e6e73] mb-1.5 uppercase tracking-wide">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={INPUT}
                      placeholder="Enter admin password"
                      autoFocus
                      required
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {loading ? "Signing in…" : <><LogIn className="w-4 h-4" /> Sign In</>}
                  </button>
                </form>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => { setView("forgot"); setError(""); }}
                  className="text-sm text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Forgot password ── */}
          {view === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                onClick={() => { setView("login"); setError(""); }}
                className="flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#1d1d1f] font-medium mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex justify-center mb-8">
                <div className="w-14 h-14 bg-[#1d1d1f] rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-[#1d1d1f] mb-1">
                Reset Password
              </h1>
              <p className="text-[#6e6e73] text-sm text-center mb-2">
                A reset link will be sent to:
              </p>
              <p className="text-center text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] px-4 py-2 rounded-xl mb-8">
                enrico.sag@gmail.com
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-5"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full py-3 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? "Sending…" : <><Mail className="w-4 h-4" /> Send Reset Link</>}
              </button>
            </motion.div>
          )}

          {/* ── Sent ── */}
          {view === "forgot-sent" && (
            <motion.div
              key="forgot-sent"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
                className="w-14 h-14 bg-[#1d1d1f] rounded-2xl flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>

              <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Check your inbox</h1>
              <p className="text-[#6e6e73] text-sm mb-2">A reset link has been sent to</p>
              <p className="text-sm font-medium text-[#1d1d1f] bg-[#f5f5f7] inline-block px-4 py-2 rounded-xl mb-6">
                enrico.sag@gmail.com
              </p>
              <p className="text-sm text-[#6e6e73] mb-8">
                The link expires in <span className="font-semibold text-[#1d1d1f]">1 hour</span>.
              </p>

              <button
                onClick={() => { setView("login"); setError(""); }}
                className="text-sm text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors"
              >
                ← Back to login
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
