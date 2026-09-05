import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Save, Plus, X, ArrowLeft, Globe, Link2, EyeOff } from "lucide-react";
import type { CaseStudy } from "@/app/data/caseStudies";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useNavigate, useParams } from "react-router";

export function AdminCaseStudyEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id !== "new");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "process" | "results">("basic");

  console.log("🎯 AdminCaseStudyEditorPage loaded with id:", id);
  console.log("📊 Initial loading state:", id !== "new");

  const [formData, setFormData] = useState<CaseStudy>({
    id: "",
    title: "",
    subtitle: "",
    tagline: "",
    category: "",
    year: new Date().getFullYear().toString(),
    heroImage: "",
    overview: {
      role: "",
      duration: "",
      tools: [],
      description: "",
    },
    problem: "",
    solution: "",
    process: [],
    images: [],
    results: [],
    visibility: "public",
  });

  useEffect(() => {
    if (id && id !== "new") {
      fetchCaseStudy();
    }
  }, [id]);

  const fetchCaseStudy = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/case-studies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Error fetching case study:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/case-studies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Case study saved successfully! Changes will appear on the home page.");
        navigate("/admin/case-studies");
      } else {
        const error = await response.json();
        alert(`Failed to save case study: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving case study:", error);
      alert("Failed to save case study");
    } finally {
      setSaving(false);
    }
  };

  const addProcessStep = () => {
    setFormData({
      ...formData,
      process: [...formData.process, { title: "", description: "" }],
    });
  };

  const removeProcessStep = (index: number) => {
    setFormData({
      ...formData,
      process: formData.process.filter((_, i) => i !== index),
    });
  };

  const addResult = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { metric: "", value: "" }],
    });
  };

  const removeResult = (index: number) => {
    setFormData({
      ...formData,
      results: formData.results.filter((_, i) => i !== index),
    });
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Details" },
    { id: "process", label: "Process" },
    { id: "results", label: "Results" },
  ];

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
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/case-studies")}
            className="flex items-center gap-1.5 text-[#6e6e73] hover:text-[#1d1d1f] mb-5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Case Studies
          </button>
          <h1 className="text-2xl font-bold text-[#1d1d1f] mb-1">
            {id === "new" ? "New Case Study" : "Edit Case Study"}
          </h1>
          <p className="text-[#6e6e73] text-sm">
            {id === "new" ? "Create a new portfolio project" : "Update your portfolio project"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Tabs */}
          <div className="bg-white rounded-t-2xl border border-black/[0.06] border-b-0">
            <div className="flex border-b border-black/[0.06] px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#1d1d1f]"
                      : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1d1d1f]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-2xl border border-black/[0.06] p-8 mb-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID (URL slug) *
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm ${id !== 'new' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="e.g., fintech-dashboard"
                      required
                      disabled={id !== 'new'}
                      readOnly={id !== 'new'}
                    />
                    {id !== 'new' && (
                      <p className="text-sm text-gray-500 mt-1">
                        ⚠️ ID cannot be changed after creation (it's used in the URL)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                      placeholder="2025"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="Project Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="A brief description of the project"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="Short punchy line shown on the hero, e.g. 'Designed for me. Built for anyone.'"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Shown beneath the title on the case study hero section.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="e.g., Product Design, Mobile App Design"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hero Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                  {formData.heroImage && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={formData.heroImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Visibility Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">👁 Visibility</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Controls where this case study appears. Unlisted studies are hidden from all public listings but accessible via a direct link — perfect for sharing with specific clients.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { value: "public",   icon: Globe,   label: "Public",   desc: "Listed on /work and homepage featured section", bg: "from-green-50 to-emerald-50", border: "border-green-300", ring: "ring-green-500", text: "text-green-700" },
                      { value: "unlisted", icon: Link2,   label: "Unlisted", desc: "Hidden from all listings. Share via direct link only.", bg: "from-amber-50 to-yellow-50", border: "border-amber-300", ring: "ring-amber-500", text: "text-amber-700" },
                      { value: "private",  icon: EyeOff,  label: "Private",  desc: "Completely inaccessible, even via direct link.", bg: "from-red-50 to-rose-50", border: "border-red-300", ring: "ring-red-500", text: "text-red-700" },
                    ] as const).map((opt) => {
                      const selected = (formData.visibility ?? "public") === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, visibility: opt.value })}
                          className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                            selected
                              ? `bg-gradient-to-br ${opt.bg} ${opt.border} ring-2 ${opt.ring}`
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className={`flex items-center gap-2 font-semibold text-sm ${selected ? opt.text : "text-gray-700"}`}>
                            <Icon className="w-4 h-4" />
                            {opt.label}
                          </div>
                          <p className="text-xs text-gray-500 leading-snug">{opt.desc}</p>
                          {selected && (
                            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br ${opt.bg.replace("from-", "").split(" ")[0]} ${opt.text}`}>
                              <div className={`w-2 h-2 rounded-full ${selected ? opt.text.replace("text-", "bg-") : ""}`} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Shareable link preview for unlisted */}
                  {(formData.visibility === "unlisted") && formData.id && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <Link2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-amber-800 font-mono break-all">
                        {window.location.origin}/work/{formData.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/work/${formData.id}`);
                          alert("Link copied!");
                        }}
                        className="ml-auto px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors flex-shrink-0"
                      >
                        Copy link
                      </button>
                    </div>
                  )}
                </div>

                {/* Password Protection Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Password Protection</h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPasswordProtected || false}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          isPasswordProtected: e.target.checked,
                          password: e.target.checked ? formData.password : undefined
                        })}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Password protect this case study
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1 ml-8">
                      Visitors will need to enter a password before viewing this case study
                    </p>
                  </div>

                  {formData.isPasswordProtected && (
                    <div className="ml-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="text"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                        placeholder="Enter password for this case study"
                        required={formData.isPasswordProtected}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        💡 Tip: Share this password privately with clients or stakeholders
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.overview.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overview: { ...formData.overview, role: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="Lead Product Designer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.overview.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overview: { ...formData.overview, duration: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="4 months"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tools (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={formData.overview.tools.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overview: {
                          ...formData.overview,
                          tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all text-sm"
                    placeholder="Figma, Principle, Maze"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Overview Description *
                  </label>
                  <textarea
                    value={formData.overview.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overview: { ...formData.overview, description: e.target.value },
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all resize-none text-sm"
                    placeholder="Brief overview of the project..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Statement *
                  </label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all resize-none text-sm"
                    placeholder="Describe the problem you were solving..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Solution *
                  </label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all resize-none text-sm"
                    placeholder="Describe your solution..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Images (comma-separated URLs)
                  </label>
                  <textarea
                    value={formData.images.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: e.target.value.split(",").map((url) => url.trim()).filter(Boolean),
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all resize-none text-sm"
                    placeholder="https://image1.jpg, https://image2.jpg"
                  />
                </div>
              </div>
            )}

            {/* Process Tab */}
            {activeTab === "process" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Design Process Steps</h3>
                  <button
                    type="button"
                    onClick={addProcessStep}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg hover:bg-[#e8e8ed] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </button>
                </div>

                {formData.process.map((step, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">
                        Step {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProcessStep(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const newProcess = [...formData.process];
                        newProcess[index].title = e.target.value;
                        setFormData({ ...formData, process: newProcess });
                      }}
                      className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl mb-3 focus:ring-2 focus:ring-[#0071e3] outline-none text-sm"
                      placeholder="Step title"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => {
                        const newProcess = [...formData.process];
                        newProcess[index].description = e.target.value;
                        setFormData({ ...formData, process: newProcess });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none resize-none text-sm"
                      placeholder="Step description"
                    />
                  </div>
                ))}

                {formData.process.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No process steps yet. Click "Add Step" to create one.
                  </div>
                )}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Project Results</h3>
                  <button
                    type="button"
                    onClick={addResult}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg hover:bg-[#e8e8ed] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Result
                  </button>
                </div>

                {formData.results.map((result, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">
                        Result {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeResult(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={result.value}
                        onChange={(e) => {
                          const newResults = [...formData.results];
                          newResults[index].value = e.target.value;
                          setFormData({ ...formData, results: newResults });
                        }}
                        className="px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none text-sm"
                        placeholder="e.g., +42%"
                      />
                      <input
                        type="text"
                        value={result.metric}
                        onChange={(e) => {
                          const newResults = [...formData.results];
                          newResults[index].metric = e.target.value;
                          setFormData({ ...formData, results: newResults });
                        }}
                        className="px-4 py-3 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none text-sm"
                        placeholder="e.g., User Satisfaction"
                      />
                    </div>
                  </div>
                ))}

                {formData.results.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No results yet. Click "Add Result" to create one.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/case-studies")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Case Study
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}