import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Lock } from "lucide-react";

const SESSION_KEY = "adminSession";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export interface AdminSession {
  token: string;
  expiresAt: number; // Unix ms
}

/** Read and validate the current session. Returns null if missing or expired. */
export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (!session.token || !session.expiresAt) return null;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Persist a new session (called from the login page). */
export function createAdminSession(token: string) {
  const session: AdminSession = {
    token,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Keep the legacy key so existing X-Admin-Password headers still work
  localStorage.setItem("adminToken", token);
}

/** Clear the session (logout). */
export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("adminToken");
}

/**
 * Route-level auth guard.
 * Place this as a pathless parent of all protected admin routes.
 * Unauthenticated visitors are redirected to /admin/login?redirect=<current path>.
 */
export function AdminAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setAuthed(true);
    } else {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/admin/login?redirect=${redirect}`, { replace: true });
    }
    setChecked(true);
  }, []);

  if (!checked) {
    // Tiny flash-free loading state while we check localStorage
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center animate-pulse">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500 text-sm">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return <Outlet />;
}
