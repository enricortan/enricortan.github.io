import { Link } from "react-router";
import { Edit } from "lucide-react";
import { motion } from "motion/react";

export function AdminQuickEdit({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        to="/admin/dashboard"
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-2xl hover:scale-110 transition-transform"
      >
        <Edit className="w-5 h-5" />
        Admin Dashboard
      </Link>
    </motion.div>
  );
}
