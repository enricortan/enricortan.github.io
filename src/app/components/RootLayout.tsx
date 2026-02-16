import { Outlet } from "react-router";
import { Navigation } from "@/app/components/Navigation";
import { Footer } from "@/app/components/Footer";
import { AdminQuickEdit } from "@/app/components/AdminQuickEdit";

export function RootLayout() {
  const isAdmin = !!localStorage.getItem("adminToken");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />
      <Outlet />
      <Footer />
      <AdminQuickEdit show={isAdmin} />
    </div>
  );
}