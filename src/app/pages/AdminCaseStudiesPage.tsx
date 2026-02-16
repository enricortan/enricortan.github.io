import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import type { CaseStudy } from "@/app/data/caseStudies";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useNavigate } from "react-router";

export function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
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

      if (response.ok) {
        fetchCaseStudies();
      }
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Failed to delete case study");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/case-studies/${id}`);
  };

  const handleNew = () => {
    navigate("/admin/case-studies/new");
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Case Studies</h1>
            <p className="text-gray-600 text-lg">
              Manage your portfolio projects ({caseStudies.length} total)
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Case Study
          </button>
        </div>

        {/* Case Studies Grid */}
        {caseStudies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No case studies yet
            </h3>
            <p className="text-gray-500 mb-6">
              Click "New Case Study" to create your first one
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                  {study.heroImage ? (
                    <img
                      src={study.heroImage}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-purple-600 font-semibold mb-2">
                    {study.category} • {study.year}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {study.subtitle}
                  </p>
                  <div className="text-xs text-gray-500 mb-3 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {study.id}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(study.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(study.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}