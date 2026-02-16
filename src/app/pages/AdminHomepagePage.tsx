import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { useHomepageSections, HomepageSectionConfig, StatItem } from "../hooks/useHomepageSections";
import { Eye, EyeOff, Save, Plus, Trash2, GripVertical } from "lucide-react";

export function AdminHomepagePage() {
  const { sections: initialSections, loading, saveSections } = useHomepageSections();
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingStatSection, setEditingStatSection] = useState<string | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const toggleVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  const updateStatValue = (sectionId: string, statIndex: number, field: keyof StatItem, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId && s.data?.stats) {
          const newStats = [...s.data.stats];
          newStats[statIndex] = { ...newStats[statIndex], [field]: value };
          return { ...s, data: { ...s.data, stats: newStats } };
        }
        return s;
      })
    );
  };

  const addStat = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const newStat: StatItem = { icon: "Star", value: "0", label: "New Stat" };
          const stats = s.data?.stats || [];
          return { ...s, data: { ...s.data, stats: [...stats, newStat] } };
        }
        return s;
      })
    );
  };

  const removeStat = (sectionId: string, statIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId && s.data?.stats) {
          const newStats = s.data.stats.filter((_, i) => i !== statIndex);
          return { ...s, data: { ...s.data, stats: newStats } };
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const success = saveSections(sections);
      
      if (success) {
        setMessage({ type: "success", text: "Homepage sections saved successfully!" });
      } else {
        throw new Error("Failed to save sections");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save sections",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Homepage Sections</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage visibility and content of homepage sections
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.name}
                  </h3>
                </div>
                <button
                  onClick={() => toggleVisibility(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    section.isVisible
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {section.isVisible ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hidden
                    </>
                  )}
                </button>
              </div>

              {/* Stats Section Configuration */}
              {section.id === "stats" && section.data?.stats && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure stats that appear on the homepage
                    </p>
                    <button
                      onClick={() => addStat(section.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stat
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.data.stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Stat {index + 1}
                          </span>
                          <button
                            onClick={() => removeStat(section.id, index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Icon (Lucide name)
                            </label>
                            <input
                              type="text"
                              value={stat.icon}
                              onChange={(e) =>
                                updateStatValue(section.id, index, "icon", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:text-white"
                              placeholder="Users"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Value
                            </label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) =>
                                updateStatValue(section.id, index, "value", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:text-white"
                              placeholder="50+"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) =>
                                updateStatValue(section.id, index, "label", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 dark:text-white"
                              placeholder="Happy Clients"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.id !== "stats" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Section visibility can be toggled. Content editing coming soon.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}