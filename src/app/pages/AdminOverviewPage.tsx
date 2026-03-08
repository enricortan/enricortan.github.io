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
      link: "/admin/case-studies",
    },
    {
      title: "Site Settings",
      value: "Configure",
      icon: SettingsIcon,
      link: "/admin/settings",
    },
    {
      title: "View Live Site",
      value: "Preview",
      icon: Eye,
      link: "/",
    },
  ];

  // Show initialization message
  if (isInitializing) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#1d1d1f] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#1d1d1f]">Setting up your portfolio…</h2>
            <p className="text-[#6e6e73] text-sm">Populating database with sample case studies</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-[#1d1d1f] mb-1">Welcome back</h1>
          <p className="text-[#6e6e73] text-sm">Manage your portfolio content from here.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <Link to={card.link}>
                <div className="bg-white rounded-2xl p-6 border border-black/[0.06] hover:border-black/[0.12] hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#e8e8ed] transition-colors">
                    <card.icon className="w-5 h-5 text-[#1d1d1f]" />
                  </div>
                  <p className="text-xs text-[#6e6e73] font-medium mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-[#1d1d1f]">
                    {stats.loading && typeof card.value === "number" ? "—" : card.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-8"
        >
          <h2 className="text-base font-semibold text-[#1d1d1f] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              to="/admin/case-studies"
              className="flex items-center gap-3 p-4 bg-[#f5f5f7] rounded-xl hover:bg-[#e8e8ed] transition-colors group"
            >
              <div className="w-9 h-9 bg-[#1d1d1f] rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1d1d1f]">Manage Case Studies</p>
                <p className="text-xs text-[#6e6e73]">Add, edit, or remove projects</p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-3 p-4 bg-[#f5f5f7] rounded-xl hover:bg-[#e8e8ed] transition-colors group"
            >
              <div className="w-9 h-9 bg-[#1d1d1f] rounded-lg flex items-center justify-center flex-shrink-0">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1d1d1f]">Update Site Settings</p>
                <p className="text-xs text-[#6e6e73]">Change site content and info</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Manual Initialize */}
        <div>
          <button
            onClick={handleManualInitialize}
            disabled={manualInitializing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-black/[0.08] text-[#1d1d1f] text-sm font-medium rounded-xl hover:bg-[#f5f5f7] transition-colors disabled:opacity-40"
          >
            <Database className="w-4 h-4 text-[#6e6e73]" />
            {manualInitializing ? "Initializing…" : "Add Sample Case Studies"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}