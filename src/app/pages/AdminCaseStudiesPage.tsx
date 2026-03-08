import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Plus, Edit, Trash2, BookOpen, Globe, Link2, EyeOff, Lock } from "lucide-react";
import type { CaseStudy } from "@/app/data/caseStudies";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useNavigate } from "react-router";

const VISIBILITY_META = {
  public:   { label: "Public",   color: "bg-green-100 text-green-700",  icon: Globe  },
  unlisted: { label: "Unlisted", color: "bg-amber-100 text-amber-700",  icon: Link2  },
  private:  { label: "Private",  color: "bg-red-100 text-red-700",      icon: EyeOff },
};

export function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/case-studies`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setCaseStudies(data.data);
      }
    } catch (error) {
      console.error("Error fetching case studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/case-studies/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
        }
      );
      if (response.ok) fetchCaseStudies();
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Failed to delete case study");
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/work/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleEdit = (id: string) => navigate(`/admin/case-studies/${id}`);
  const handleNew  = () => navigate("/admin/case-studies/new");

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const publicCount   = caseStudies.filter(s => (s.visibility ?? "public") === "public").length;
  const unlistedCount = caseStudies.filter(s => s.visibility === "unlisted").length;
  const privateCount  = caseStudies.filter(s => s.visibility === "private").length;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Case Studies</h1>
            <p className="text-gray-600 text-lg">
              Manage your portfolio projects ({caseStudies.length} total)
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Case Study
          </button>
        </div>

        {/* Visibility summary pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {([["public", publicCount], ["unlisted", unlistedCount], ["private", privateCount]] as const).map(([vis, count]) => {
            const meta = VISIBILITY_META[vis];
            const Icon = meta.icon;
            return (
              <div key={vis} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${meta.color}`}>
                <Icon className="w-3.5 h-3.5" />
                {count} {meta.label}
              </div>
            );
          })}
        </div>

        {/* Case Studies Grid */}
        {caseStudies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-black/[0.06]">
            <BookOpen className="w-12 h-12 text-[#6e6e73]/30 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">No case studies yet</h3>
            <p className="text-[#6e6e73] text-sm">Click "New Case Study" to create your first one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.map((study, index) => {
              const vis = (study.visibility ?? "public") as "public" | "unlisted" | "private";
              const meta = VISIBILITY_META[vis];
              const VisIcon = meta.icon;
              return (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden group hover:border-black/[0.12] hover:shadow-md transition-all flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-[#f5f5f7] overflow-hidden flex-shrink-0">
                    {study.heroImage ? (
                      <img
                        src={study.heroImage}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6e6e73] text-sm">No image</div>
                    )}
                    <div className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                      <VisIcon className="w-3 h-3" />
                      {meta.label}
                    </div>
                    {study.isPasswordProtected && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        <Lock className="w-3 h-3" />
                        Password
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] text-[#6e6e73] uppercase tracking-widest font-medium mb-1">
                      {study.category} · {study.year}
                    </p>
                    <h3 className="text-sm font-semibold text-[#1d1d1f] mb-1 line-clamp-2 flex-1">{study.title}</h3>
                    <p className="text-[#6e6e73] text-xs line-clamp-2 mb-3">{study.subtitle}</p>

                    <div className="text-[10px] text-[#6e6e73] font-mono bg-[#f5f5f7] px-2 py-1 rounded mb-3">
                      /work/{study.id}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(study.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg hover:bg-[#e8e8ed] transition-colors text-xs font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleCopyLink(study.id)}
                        title="Copy shareable link"
                        className={`px-3 py-2 rounded-lg transition-colors text-xs ${
                          copiedId === study.id
                            ? "bg-green-100 text-green-700"
                            : "bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed]"
                        }`}
                      >
                        {copiedId === study.id ? "✓" : <Link2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(study.id)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}