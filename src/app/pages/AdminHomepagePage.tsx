import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  useHomepageSections,
  HomepageSectionConfig,
  StatItem,
  ExperienceItem,
  SkillCategory,
  ValueItem,
  PhilosophyCard,
  CtaSocialLink,
} from "../hooks/useHomepageSections";
import {
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Layers,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const GRADIENT_OPTIONS = [
  { label: "Purple → Blue", value: "from-purple-600 to-blue-600" },
  { label: "Blue → Indigo", value: "from-blue-600 to-indigo-600" },
  { label: "Indigo → Purple", value: "from-indigo-600 to-purple-600" },
  { label: "Pink → Purple", value: "from-pink-600 to-purple-600" },
  { label: "Purple → Pink", value: "from-purple-600 to-pink-600" },
  { label: "Teal → Blue", value: "from-teal-600 to-blue-600" },
  { label: "Green → Teal", value: "from-green-600 to-teal-600" },
  { label: "Orange → Pink", value: "from-orange-500 to-pink-600" },
];

// Solid gradient options for philosophy cards
const PHILOSOPHY_GRADIENT_OPTIONS = [
  { label: "Purple → Blue",  value: "from-purple-500 to-blue-500" },
  { label: "Blue → Purple",  value: "from-blue-500 to-purple-500" },
  { label: "Pink → Purple",  value: "from-pink-500 to-purple-500" },
  { label: "Blue → Indigo",  value: "from-blue-500 to-indigo-500" },
  { label: "Teal → Blue",    value: "from-teal-500 to-blue-500" },
  { label: "Purple → Pink",  value: "from-purple-500 to-pink-500" },
  { label: "Indigo → Blue",  value: "from-indigo-500 to-blue-500" },
  { label: "Green → Teal",   value: "from-green-500 to-teal-500" },
];

// Color options for the skills cards (semi-transparent for dark background)
const SKILL_COLOR_OPTIONS = [
  { label: "Purple → Blue",   gradient: "from-purple-500/20 to-blue-500/20",   border: "border-purple-500/30" },
  { label: "Pink → Purple",   gradient: "from-pink-500/20 to-purple-500/20",   border: "border-pink-500/30" },
  { label: "Blue → Indigo",   gradient: "from-blue-500/20 to-indigo-500/20",   border: "border-blue-500/30" },
  { label: "Teal → Blue",     gradient: "from-teal-500/20 to-blue-500/20",     border: "border-teal-500/30" },
  { label: "Green → Teal",    gradient: "from-green-500/20 to-teal-500/20",    border: "border-green-500/30" },
  { label: "Orange → Pink",   gradient: "from-orange-500/20 to-pink-500/20",   border: "border-orange-500/30" },
  { label: "Indigo → Purple", gradient: "from-indigo-500/20 to-purple-500/20", border: "border-indigo-500/30" },
  { label: "Rose → Orange",   gradient: "from-rose-500/20 to-orange-500/20",   border: "border-rose-500/30" },
];

export function AdminHomepagePage() {
  const {
    sections: initialSections, loading, saveSections,
    DEFAULT_EXPERIENCE, DEFAULT_SKILLS, DEFAULT_VALUE_ITEMS, DEFAULT_PHILOSOPHY_CARDS,
  } = useHomepageSections();
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["stats", "experience", "skills"])
  );

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const toggleVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  // ─── Stats helpers ───────────────────────────────────────────────────────────
  const updateStatValue = (
    sectionId: string,
    statIndex: number,
    field: keyof StatItem,
    value: string
  ) => {
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

  // ─── Experience helpers ───────────────────────────────────────────────────────
  const updateExperienceValue = (
    expIndex: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "experience" && s.data?.experience) {
          const updated = [...s.data.experience];
          updated[expIndex] = { ...updated[expIndex], [field]: value };
          return { ...s, data: { ...s.data, experience: updated } };
        }
        return s;
      })
    );
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      year: "2024 - Present",
      role: "New Role",
      company: "Company Name",
      description: "Describe your responsibilities and achievements here.",
      gradient: "from-purple-600 to-blue-600",
    };
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "experience") {
          const experience = s.data?.experience || [];
          return { ...s, data: { ...s.data, experience: [newExp, ...experience] } };
        }
        return s;
      })
    );
  };

  const removeExperience = (expIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "experience" && s.data?.experience) {
          const updated = s.data.experience.filter((_, i) => i !== expIndex);
          return { ...s, data: { ...s.data, experience: updated } };
        }
        return s;
      })
    );
  };

  const moveExperience = (expIndex: number, direction: "up" | "down") => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "experience" && s.data?.experience) {
          const arr = [...s.data.experience];
          const targetIndex = direction === "up" ? expIndex - 1 : expIndex + 1;
          if (targetIndex < 0 || targetIndex >= arr.length) return s;
          [arr[expIndex], arr[targetIndex]] = [arr[targetIndex], arr[expIndex]];
          return { ...s, data: { ...s.data, experience: arr } };
        }
        return s;
      })
    );
  };

  const resetExperienceToDefaults = () => {
    if (!confirm("Reset experience to default placeholder data?")) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "experience") {
          return { ...s, data: { ...s.data, experience: DEFAULT_EXPERIENCE } };
        }
        return s;
      })
    );
  };

  // ─── CTA helpers ────────────────────────────────────────────────────────────
  const updateCtaField = (field: "ctaHeading" | "ctaDescription" | "ctaEmail" | "ctaButtonLabel", value: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === "cta" ? { ...s, data: { ...s.data, [field]: value } } : s)
    );
  };

  const getCtaLinks = (): CtaSocialLink[] =>
    sections.find(s => s.id === "cta")?.data?.ctaSocialLinks || [
      { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" },
      { name: "X",        icon: "Twitter",  url: "https://x.com" },
      { name: "GitHub",   icon: "Github",   url: "https://github.com" },
      { name: "Dribbble", icon: "Dribbble", url: "https://dribbble.com" },
    ];

  const updateCtaLink = (index: number, field: keyof CtaSocialLink, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "cta") {
          const links = [...getCtaLinks()];
          links[index] = { ...links[index], [field]: value };
          return { ...s, data: { ...s.data, ctaSocialLinks: links } };
        }
        return s;
      })
    );
  };

  const addCtaLink = () => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "cta") {
          const links = [...getCtaLinks(), { name: "New Link", icon: "Globe", url: "https://" }];
          return { ...s, data: { ...s.data, ctaSocialLinks: links } };
        }
        return s;
      })
    );
  };

  const removeCtaLink = (index: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "cta") {
          const links = getCtaLinks().filter((_, i) => i !== index);
          return { ...s, data: { ...s.data, ctaSocialLinks: links } };
        }
        return s;
      })
    );
  };

  const resetCtaToDefaults = () => {
    if (!confirm("Reset CTA section to default data?")) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === "cta"
          ? { ...s, data: { ...s.data, ctaHeading: "Let's work together", ctaDescription: "I'm currently available for freelance projects and full-time opportunities. Whether you have a question or just want to say hi, feel free to reach out!", ctaEmail: "hello@yourname.com", ctaButtonLabel: "Send me a message", ctaSocialLinks: [{ name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" }, { name: "X", icon: "Twitter", url: "https://x.com" }, { name: "GitHub", icon: "Github", url: "https://github.com" }, { name: "Dribbble", icon: "Dribbble", url: "https://dribbble.com" }] } }
          : s
      )
    );
  };

  // ─── Values helpers ────────────────────────────────────────────────────────
  const updateValuesBio = (field: "bioTitle" | "bioDescription", value: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === "values" ? { ...s, data: { ...s.data, [field]: value } } : s)
    );
  };

  const updateValueItem = (index: number, field: keyof ValueItem, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "values") {
          const items = [...(s.data?.valueItems || DEFAULT_VALUE_ITEMS)];
          items[index] = { ...items[index], [field]: value };
          return { ...s, data: { ...s.data, valueItems: items } };
        }
        return s;
      })
    );
  };

  const addValueItem = () => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "values") {
          const items = [...(s.data?.valueItems || DEFAULT_VALUE_ITEMS), { icon: "Star", title: "New Value", description: "Describe this value." }];
          return { ...s, data: { ...s.data, valueItems: items } };
        }
        return s;
      })
    );
  };

  const removeValueItem = (index: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "values") {
          const items = (s.data?.valueItems || DEFAULT_VALUE_ITEMS).filter((_, i) => i !== index);
          return { ...s, data: { ...s.data, valueItems: items } };
        }
        return s;
      })
    );
  };

  const moveValueItem = (index: number, direction: "up" | "down") => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "values") {
          const arr = [...(s.data?.valueItems || DEFAULT_VALUE_ITEMS)];
          const target = direction === "up" ? index - 1 : index + 1;
          if (target < 0 || target >= arr.length) return s;
          [arr[index], arr[target]] = [arr[target], arr[index]];
          return { ...s, data: { ...s.data, valueItems: arr } };
        }
        return s;
      })
    );
  };

  const resetValuesToDefaults = () => {
    if (!confirm("Reset About Me / Values to default data?")) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === "values"
          ? { ...s, data: { ...s.data, bioTitle: "I create digital products that make a difference", bioDescription: "I'm a product designer based in San Francisco with a passion for crafting intuitive, accessible, and beautiful digital experiences. My approach combines user empathy with business strategy to create solutions that truly work.", valueItems: DEFAULT_VALUE_ITEMS } }
          : s
      )
    );
  };

  // ─── Philosophy helpers ─────────────────────────────────────────────────────
  const updatePhilosophyCard = (cardIndex: number, field: keyof PhilosophyCard, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "philosophy") {
          const cards = [...(s.data?.philosophyCards || DEFAULT_PHILOSOPHY_CARDS)];
          cards[cardIndex] = { ...cards[cardIndex], [field]: value };
          return { ...s, data: { ...s.data, philosophyCards: cards } };
        }
        return s;
      })
    );
  };

  const resetPhilosophyToDefaults = () => {
    if (!confirm("Reset Philosophy section to default data?")) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === "philosophy"
          ? { ...s, data: { ...s.data, philosophyCards: DEFAULT_PHILOSOPHY_CARDS } }
          : s
      )
    );
  };

  // ─── Skills helpers ────────────────────────────────────────────────────────
  const getSkillsItems = (): SkillCategory[] => {
    const section = sections.find((s) => s.id === "skills");
    return section?.data?.skills || DEFAULT_SKILLS;
  };

  const updateSkillCategory = (
    catIndex: number,
    field: keyof Omit<SkillCategory, "skills">,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS)];
          cats[catIndex] = { ...cats[catIndex], [field]: value };
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const updateSkillColorTheme = (catIndex: number, gradient: string, border: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS)];
          cats[catIndex] = { ...cats[catIndex], gradient, border };
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const updateSkillItem = (catIndex: number, skillIndex: number, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS)];
          const skills = [...cats[catIndex].skills];
          skills[skillIndex] = value;
          cats[catIndex] = { ...cats[catIndex], skills };
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const addSkillItem = (catIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS)];
          const skills = [...cats[catIndex].skills, "New Skill"];
          cats[catIndex] = { ...cats[catIndex], skills };
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const removeSkillItem = (catIndex: number, skillIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS)];
          const skills = cats[catIndex].skills.filter((_, i) => i !== skillIndex);
          cats[catIndex] = { ...cats[catIndex], skills };
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      emoji: "⭐",
      title: "New Category",
      skills: ["New Skill"],
      gradient: "from-purple-500/20 to-blue-500/20",
      border: "border-purple-500/30",
    };
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = [...(s.data?.skills || DEFAULT_SKILLS), newCat];
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const removeSkillCategory = (catIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const cats = (s.data?.skills || DEFAULT_SKILLS).filter((_, i) => i !== catIndex);
          return { ...s, data: { ...s.data, skills: cats } };
        }
        return s;
      })
    );
  };

  const moveSkillCategory = (catIndex: number, direction: "up" | "down") => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          const arr = [...(s.data?.skills || DEFAULT_SKILLS)];
          const targetIndex = direction === "up" ? catIndex - 1 : catIndex + 1;
          if (targetIndex < 0 || targetIndex >= arr.length) return s;
          [arr[catIndex], arr[targetIndex]] = [arr[targetIndex], arr[catIndex]];
          return { ...s, data: { ...s.data, skills: arr } };
        }
        return s;
      })
    );
  };

  const resetSkillsToDefaults = () => {
    if (!confirm("Reset skills to default data?")) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === "skills") {
          return { ...s, data: { ...s.data, skills: DEFAULT_SKILLS } };
        }
        return s;
      })
    );
  };

  // ─── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const success = saveSections(sections);
      if (success) {
        setMessage({ type: "success", text: "Homepage sections saved successfully!" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        throw new Error("Failed to save sections");
      }
    } catch (err) {
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
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const experienceSection = sections.find((s) => s.id === "experience");
  const experienceItems: ExperienceItem[] =
    experienceSection?.data?.experience || DEFAULT_EXPERIENCE;

  const skillsItems: SkillCategory[] = getSkillsItems();

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Homepage Sections</h1>
            <p className="text-gray-600">Manage visibility and content of homepage sections</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 shrink-0"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Toast message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Cards */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const hasEditor =
              section.id === "stats" ||
              section.id === "values" ||
              section.id === "philosophy" ||
              section.id === "experience" ||
              section.id === "skills" ||
              section.id === "cta";

            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Section header row */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-5 h-5 text-gray-300 shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {section.name}
                      </h3>
                      {!hasEditor && (
                        <p className="text-xs text-gray-400 mt-0.5">Visibility only</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Visibility toggle */}
                    <button
                      onClick={() => toggleVisibility(section.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        section.isVisible
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {section.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </button>

                    {/* Expand/collapse toggle for sections with editors */}
                    {hasEditor && (
                      <button
                        onClick={() => toggleExpanded(section.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        title={isExpanded ? "Collapse editor" : "Expand editor"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Stats Editor ──────────────────���──────────────────────── */}
                <AnimatePresence initial={false}>
                  {section.id === "stats" && isExpanded && section.data?.stats && (
                    <motion.div
                      key="stats-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-gray-500">
                            Configure the stat counters shown below the hero
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
                              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                  Stat {index + 1}
                                </span>
                                <button
                                  onClick={() => removeStat(section.id, index)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Icon{" "}
                                    <a
                                      href="https://lucide.dev/icons"
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-purple-500 hover:underline"
                                    >
                                      (Lucide name)
                                    </a>
                                  </label>
                                  <input
                                    type="text"
                                    value={stat.icon}
                                    onChange={(e) =>
                                      updateStatValue(section.id, index, "icon", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Users"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Value
                                  </label>
                                  <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) =>
                                      updateStatValue(section.id, index, "value", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="50+"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Label
                                  </label>
                                  <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) =>
                                      updateStatValue(section.id, index, "label", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Happy Clients"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── CTA Editor ────────────────────────────────────────── */}
                  {section.id === "cta" && isExpanded && (
                    <motion.div
                      key="cta-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-6">
                        {/* Text fields */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">Content</p>
                            <button onClick={resetCtaToDefaults} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Reset defaults</button>
                          </div>
                          <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Heading</label>
                              <input type="text" value={sections.find(s => s.id === "cta")?.data?.ctaHeading || ""} onChange={(e) => updateCtaField("ctaHeading", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Let's work together" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                              <textarea rows={2} value={sections.find(s => s.id === "cta")?.data?.ctaDescription || ""} onChange={(e) => updateCtaField("ctaDescription", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" placeholder="I'm currently available..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
                                <input type="email" value={sections.find(s => s.id === "cta")?.data?.ctaEmail || ""} onChange={(e) => updateCtaField("ctaEmail", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="hello@yourname.com" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Button label</label>
                                <input type="text" value={sections.find(s => s.id === "cta")?.data?.ctaButtonLabel || ""} onChange={(e) => updateCtaField("ctaButtonLabel", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Send me a message" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Social links */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">Social Links</p>
                            <button onClick={addCtaLink} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                              <Plus className="w-4 h-4" /> Add Link
                            </button>
                          </div>
                          <div className="space-y-2">
                            {getCtaLinks().map((link, index) => (
                              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end bg-gray-50 rounded-xl p-3 border border-gray-200">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                                  <input type="text" value={link.name} onChange={(e) => updateCtaLink(index, "name", e.target.value)} className="w-full px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="LinkedIn" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Icon <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">(Lucide)</a>
                                  </label>
                                  <input type="text" value={link.icon} onChange={(e) => updateCtaLink(index, "icon", e.target.value)} className="w-full px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Linkedin" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                                  <input type="url" value={link.url} onChange={(e) => updateCtaLink(index, "url", e.target.value)} className="w-full px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://..." />
                                </div>
                                <button onClick={() => removeCtaLink(index)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors self-end mb-0.5">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Values Editor ─────────────────────────────────────── */}
                  {section.id === "values" && isExpanded && (
                    <motion.div
                      key="values-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-6">
                        {/* Bio fields */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">Bio / Introduction</p>
                            <button
                              onClick={resetValuesToDefaults}
                              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Reset defaults
                            </button>
                          </div>
                          <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Heading</label>
                              <input
                                type="text"
                                value={sections.find(s => s.id === "values")?.data?.bioTitle || ""}
                                onChange={(e) => updateValuesBio("bioTitle", e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="I create digital products that make a difference"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                              <textarea
                                rows={3}
                                value={sections.find(s => s.id === "values")?.data?.bioDescription || ""}
                                onChange={(e) => updateValuesBio("bioDescription", e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                placeholder="Brief bio description..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Value cards */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">Value Cards</p>
                            <button
                              onClick={addValueItem}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Card
                            </button>
                          </div>
                          <div className="space-y-3">
                            {(sections.find(s => s.id === "values")?.data?.valueItems || DEFAULT_VALUE_ITEMS).map((item, index, arr) => (
                              <div key={index} className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Card {index + 1}</span>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => moveValueItem(index, "up")} disabled={index === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"><ChevronUp className="w-4 h-4" /></button>
                                    <button onClick={() => moveValueItem(index, "down")} disabled={index === arr.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"><ChevronDown className="w-4 h-4" /></button>
                                    <button onClick={() => removeValueItem(index)} className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Icon{" "}
                                      <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">(Lucide name)</a>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.icon}
                                      onChange={(e) => updateValueItem(index, "icon", e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                      placeholder="Heart"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateValueItem(index, "title", e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                      placeholder="Empathy First"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                    <input
                                      type="text"
                                      value={item.description}
                                      onChange={(e) => updateValueItem(index, "description", e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                      placeholder="Short description..."
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Philosophy Editor ──────────────────────────────────── */}
                  {section.id === "philosophy" && isExpanded && (
                    <motion.div
                      key="philosophy-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-gray-500">Edit the two philosophy / approach cards</p>
                          <button
                            onClick={resetPhilosophyToDefaults}
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Reset defaults
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(sections.find(s => s.id === "philosophy")?.data?.philosophyCards || DEFAULT_PHILOSOPHY_CARDS).map((card, ci) => (
                            <div key={ci} className="border border-gray-200 rounded-xl bg-gray-50 p-4 space-y-3">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${card.gradient}`} />
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Card {ci + 1}</span>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Icon{" "}
                                  <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">(Lucide name)</a>
                                </label>
                                <input
                                  type="text"
                                  value={card.icon}
                                  onChange={(e) => updatePhilosophyCard(ci, "icon", e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                  placeholder="Target"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Label (small uppercase)</label>
                                <input
                                  type="text"
                                  value={card.label}
                                  onChange={(e) => updatePhilosophyCard(ci, "label", e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                  placeholder="My Approach"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => updatePhilosophyCard(ci, "title", e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                  placeholder="User-centered, data-informed"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                  rows={3}
                                  value={card.description}
                                  onChange={(e) => updatePhilosophyCard(ci, "description", e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                  placeholder="Card body text..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Accent Color</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {PHILOSOPHY_GRADIENT_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      onClick={() => updatePhilosophyCard(ci, "gradient", opt.value)}
                                      className={`h-7 rounded-lg bg-gradient-to-r ${opt.value} transition-all ${card.gradient === opt.value ? "ring-2 ring-offset-1 ring-purple-500 scale-105" : "opacity-70 hover:opacity-100"}`}
                                      title={opt.label}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Experience Editor ──────────────────────────────────── */}
                  {section.id === "experience" && isExpanded && (
                    <motion.div
                      key="experience-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-sm text-gray-500">
                            Add and edit your professional experience entries
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={resetExperienceToDefaults}
                              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Reset defaults
                            </button>
                            <button
                              onClick={addExperience}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Entry
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {experienceItems.map((exp, index) => (
                            <ExperienceCard
                              key={index}
                              exp={exp}
                              index={index}
                              total={experienceItems.length}
                              onUpdate={(field, value) =>
                                updateExperienceValue(index, field, value)
                              }
                              onRemove={() => removeExperience(index)}
                              onMove={(dir) => moveExperience(index, dir)}
                            />
                          ))}

                          {experienceItems.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                              <p className="text-sm">No experience entries yet.</p>
                              <button
                                onClick={addExperience}
                                className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                              >
                                Add your first entry
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Skills Editor ──────────────────────────────────────── */}
                  {section.id === "skills" && isExpanded && (
                    <motion.div
                      key="skills-editor"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-sm text-gray-500">
                            Manage skill categories and individual skills
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={resetSkillsToDefaults}
                              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Reset defaults
                            </button>
                            <button
                              onClick={addSkillCategory}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Category
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {skillsItems.map((cat, catIndex) => (
                            <SkillCategoryCard
                              key={catIndex}
                              cat={cat}
                              catIndex={catIndex}
                              total={skillsItems.length}
                              onUpdateField={(field, value) =>
                                updateSkillCategory(catIndex, field, value)
                              }
                              onUpdateColor={(gradient, border) =>
                                updateSkillColorTheme(catIndex, gradient, border)
                              }
                              onUpdateSkill={(skillIndex, value) =>
                                updateSkillItem(catIndex, skillIndex, value)
                              }
                              onAddSkill={() => addSkillItem(catIndex)}
                              onRemoveSkill={(skillIndex) =>
                                removeSkillItem(catIndex, skillIndex)
                              }
                              onRemove={() => removeSkillCategory(catIndex)}
                              onMove={(dir) => moveSkillCategory(catIndex, dir)}
                            />
                          ))}

                          {skillsItems.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                              <Layers className="w-10 h-10 mx-auto mb-3 opacity-40" />
                              <p className="text-sm">No skill categories yet.</p>
                              <button
                                onClick={addSkillCategory}
                                className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                              >
                                Add your first category
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Experience Card sub-component
───────────────────────────────────────────────────────────────────────────── */
interface ExperienceCardProps {
  exp: ExperienceItem;
  index: number;
  total: number;
  onUpdate: (field: keyof ExperienceItem, value: string) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

function ExperienceCard({ exp, index, total, onUpdate, onRemove, onMove }: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${exp.gradient} shrink-0`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {exp.role || "Untitled Role"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {exp.company} · {exp.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMove("up"); }}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove("down"); }}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-gray-400 pl-1">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Period</label>
                <input
                  type="text"
                  value={exp.year}
                  onChange={(e) => onUpdate("year", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="2022 - Present"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => onUpdate("role", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Senior Product Designer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => onUpdate("company", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Tech Company Inc."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Accent Color</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {GRADIENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUpdate("gradient", opt.value)}
                      title={opt.label}
                      className={`h-7 rounded-lg bg-gradient-to-r ${opt.value} transition-all ${
                        exp.gradient === opt.value
                          ? "ring-2 ring-offset-1 ring-purple-500 scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => onUpdate("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your key responsibilities and achievements…"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Skill Category Card sub-component
───────────────────────────────────────────────────────────────────────────── */
interface SkillCategoryCardProps {
  cat: SkillCategory;
  catIndex: number;
  total: number;
  onUpdateField: (field: keyof Omit<SkillCategory, "skills">, value: string) => void;
  onUpdateColor: (gradient: string, border: string) => void;
  onUpdateSkill: (skillIndex: number, value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skillIndex: number) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

function SkillCategoryCard({
  cat,
  catIndex,
  total,
  onUpdateField,
  onUpdateColor,
  onUpdateSkill,
  onAddSkill,
  onRemoveSkill,
  onRemove,
  onMove,
}: SkillCategoryCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeColor = SKILL_COLOR_OPTIONS.find((o) => o.gradient === cat.gradient);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Color preview dot */}
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br ${cat.gradient
              .replace("/20", "")
              .replace("500", "600")} shrink-0`}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              <span className="mr-1.5">{cat.emoji}</span>
              {cat.title || "Untitled Category"}
            </p>
            <p className="text-xs text-gray-400">
              {cat.skills.length} skill{cat.skills.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onMove("up"); }}
            disabled={catIndex === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove("down"); }}
            disabled={catIndex === total - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-500"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-gray-400 pl-1">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-4">
              {/* Top row: emoji + title */}
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={cat.emoji}
                    onChange={(e) => onUpdateField("emoji", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="🛠"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category Title</label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => onUpdateField("title", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Product Ownership & Strategy"
                  />
                </div>
              </div>

              {/* Color theme picker */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Card Color Theme</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {SKILL_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.gradient}
                      onClick={() => onUpdateColor(opt.gradient, opt.border)}
                      title={opt.label}
                      className={`h-8 rounded-lg bg-gradient-to-r ${opt.gradient
                        .replace("/20", "")
                        .replace("500", "600")} transition-all ${
                        cat.gradient === opt.gradient
                          ? "ring-2 ring-offset-1 ring-purple-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
                {activeColor && (
                  <p className="text-xs text-gray-400 mt-1.5">Selected: {activeColor.label}</p>
                )}
              </div>

              {/* Skills list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-600">Skills</label>
                  <button
                    onClick={onAddSkill}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {cat.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => onUpdateSkill(skillIndex, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="Skill name"
                      />
                      <button
                        onClick={() => onRemoveSkill(skillIndex)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors shrink-0"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {cat.skills.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No skills yet.{" "}
                      <button onClick={onAddSkill} className="text-purple-500 hover:underline">
                        Add one
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
