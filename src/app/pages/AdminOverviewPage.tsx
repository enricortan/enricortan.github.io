import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { FolderOpen, Settings as SettingsIcon, TrendingUp, Eye, Database } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Link } from "react-router";
import { useDataInitializer } from "@/app/hooks/useDataInitializer";
import { caseStudies as defaultCaseStudies } from "@/app/data/caseStudies";

export function AdminOverviewPage() {
  const [stats, setStats] = useState({
    caseStudies: 0,
    loading: true,
  });
  const [manualInitializing, setManualInitializing] = useState(false);

  // Initialize data on first load
  const { initialized, isInitializing } = useDataInitializer();

  useEffect(() => {
    if (initialized) {
      fetchStats();
    }
  }, [initialized]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/case-studies`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStats({
          caseStudies: data.data.length,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleManualInitialize = async () => {
    if (!confirm("This will add 4 sample case studies to your database. Continue?")) {
      return;
    }

    setManualInitializing(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
          body: JSON.stringify({ caseStudies: defaultCaseStudies }),
        }
      );

      if (response.ok) {
        alert("✅ Sample case studies added successfully!");
        // Refresh the stats
        await fetchStats();
        // Reload the page to see the data
        window.location.reload();
      } else {
        const error = await response.json();
        console.error("❌ Failed to initialize:", error);
        alert(`❌ Failed to initialize: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
      alert("❌ Error initializing data. Check console for details.");
    } finally {
      setManualInitializing(false);
    }
  };

  const cards = [
    {
      title: "Case Studies",
      value: stats.caseStudies,
      icon: FolderOpen,
      color: "from-purple-500 to-blue-500",
      link: "/admin/case-studies",
    },
    {
      title: "Site Settings",
      value: "Configure",
      icon: SettingsIcon,
      color: "from-blue-500 to-cyan-500",
      link: "/admin/settings",
    },
    {
      title: "View Live Site",
      value: "Preview",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
      link: "/",
    },
  ];

  // Show initialization message
  if (isInitializing) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Setting up your portfolio...</h2>
            <p className="text-gray-600">
              Populating database with sample case studies
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Manage your portfolio content from here
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={card.link}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.loading && typeof card.value === "number" ? "..." : card.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/case-studies"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Case Studies</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove projects</p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Update Site Settings</h3>
                <p className="text-sm text-gray-600">Change site content and info</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Manual Initialize Button */}
        <div className="mt-8">
          <button
            onClick={handleManualInitialize}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
            disabled={manualInitializing}
          >
            {manualInitializing ? "Initializing..." : "Add Sample Case Studies"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}