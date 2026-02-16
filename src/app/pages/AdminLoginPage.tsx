import { useState } from "react";
import { motion } from "motion/react";
import { Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with password:", password);
      console.log("Calling URL:", `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/login`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Admin Login</h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your password to access the dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}