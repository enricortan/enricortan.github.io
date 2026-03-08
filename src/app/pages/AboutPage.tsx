import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Heart,
  Lightbulb,
  Target,
  Users,
  Sparkles,
  Layers,
  Zap,
  Filter,
  Lock,
  Briefcase,
} from "lucide-react";
import { useCaseStudies } from "../hooks/useCaseStudies";
import { useHomepageSections } from "../hooks/useHomepageSections";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";

type Tab = "work" | "about";

export function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: Tab = (searchParams.get("tab") as Tab) || "work";

  const { caseStudies, loading } = useCaseStudies();
  const { getSectionConfig } = useHomepageSections();
  const { settings } = useSiteSettings();
  const [selectedCategory, setSelectedCategory] = useState("All");

  usePageMeta("About");

  const setTab = (tab: Tab) => {
    setSearchParams(tab === "work" ? {} : { tab });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Work tab data ──────────────────────────────────────────────────────────
  const categories = ["All", ...Array.from(new Set(caseStudies.map((s) => s.category)))];
  const filteredCaseStudies =
    selectedCategory === "All"
      ? caseStudies
      : caseStudies.filter((s) => s.category === selectedCategory);

  // ── About tab data ─────────────────────────────────────────────────────────
  const experienceConfig = getSectionConfig("experience");
  const experienceData = experienceConfig?.data?.experience || [
    {
      year: "June 2021 - Present",
      role: "UI/UX Design Lead & Product Owner (Manager 1)",
      company: "CIMB Bank PH",
      gradient: "from-purple-600 to-blue-600",
      description:
        "Elevated to Product Owner with accountability for the strategic vision, roadmap, and delivery of key features within the digital banking platform.",
    },
    {
      year: "March 2017 - June 2021",
      role: "Product Designer",
      company: "Obelisk Security, Hong Kong",
      gradient: "from-blue-600 to-indigo-600",
      description:
        "Headed the redesign of cybersecurity product interfaces, enhancing user adoption rates.",
    },
    {
      year: "March 2017 - June 2021",
      role: "UI/UX Designer",
      company: "Futureworks PH (Outbound Asia INC)",
      gradient: "from-indigo-600 to-purple-600",
      description:
        "Served as Lead Designer for the full design lifecycle from conceptualization and branding through to production.",
    },
    {
      year: "March 2015 - 2016",
      role: "Frontend Designer, UI/UX",
      company: "ThousandMinds, Makati City",
      gradient: "from-pink-600 to-purple-600",
      description:
        "Supplied design assets for mobile and web applications, ensuring optimal user experience.",
    },
  ];

  const skillsConfig = getSectionConfig("skills");
  const skillsData = skillsConfig?.data?.skills || [
    { emoji: "🛠", title: "Product Ownership & Strategy", skills: ["Product Lifecycle Management", "Roadmapping & Prioritization", "Stakeholder Management", "Customer Discovery & Validation"], gradient: "from-purple-500/20 to-blue-500/20", border: "border-purple-500/30" },
    { emoji: "🎨", title: "UI/UX Design & Research", skills: ["UI Design & Prototyping", "Design Systems", "Interaction & Motion Design", "Accessibility Standards"], gradient: "from-pink-500/20 to-purple-500/20", border: "border-pink-500/30" },
    { emoji: "🧱", title: "Development & Handoff", skills: ["Frontend Fundamentals", "Design-to-Dev Handoff", "Version Control & Collaboration"], gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
    { emoji: "🧩", title: "Collaboration & Productivity", skills: ["Project & Task Management", "Cross-functional Team Leadership", "Agile / Scrum Workflows"], gradient: "from-teal-500/20 to-blue-500/20", border: "border-teal-500/30" },
  ];

  const values = [
    { icon: Heart, title: "Empathy First", description: "Understanding user needs is at the heart of everything I design" },
    { icon: Lightbulb, title: "Innovation", description: "Pushing boundaries while keeping usability at the forefront" },
    { icon: Target, title: "Goal-Oriented", description: "Aligning design decisions with business objectives and user needs" },
    { icon: Users, title: "Collaboration", description: "Great products are built by great teams working together" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* ── Page header with tabs ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-0 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-6">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {settings?.siteName || "Portfolio"}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl font-bold leading-tight dark:text-white">
              {activeTab === "work" ? (
                <>
                  Selected{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Work
                  </span>
                </>
              ) : (
                <>
                  About{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Me
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              {activeTab === "work"
                ? "A collection of projects showcasing my approach to solving complex design challenges through research, strategy, and thoughtful execution."
                : "UI/UX Design Lead, Product Owner, and full-stack design thinker with 10+ years of experience crafting meaningful digital experiences."}
            </p>
          </motion.div>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-fit shadow-sm"
          >
            {(["work", "about"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative capitalize">
                  {tab === "work" ? "Work" : "About Me"}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="mt-8 h-px bg-gradient-to-r from-purple-200 via-blue-200 to-transparent dark:from-purple-800 dark:via-blue-800" />
        </div>
      </section>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ══ WORK TAB ══════════════════════════════════════════════════════ */}
        {activeTab === "work" && (
          <motion.div
            key="work"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-xl dark:text-white">Loading...</div>
              </div>
            ) : (
              <>
                {/* Filter bar */}
                <section className="max-w-7xl mx-auto px-6 pt-10 pb-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">Filter:</span>
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                    <span className="ml-auto text-sm text-gray-400">
                      {filteredCaseStudies.length} {filteredCaseStudies.length === 1 ? "project" : "projects"}
                    </span>
                  </div>
                </section>

                {/* Projects grid */}
                <section className="max-w-7xl mx-auto px-6 pb-32">
                  {filteredCaseStudies.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                        No projects found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try selecting a different category
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                      {filteredCaseStudies.map((study, index) => (
                        <motion.div
                          key={study.id}
                          initial={{ opacity: 0, y: 60 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: index * 0.08 }}
                          whileHover={{ y: -10 }}
                        >
                          <Link to={`/work/${study.id}`} className="group block">
                            <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-xl">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <ImageWithFallback
                                src={study.heroImage}
                                alt={study.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              {study.isPasswordProtected && (
                                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 text-gray-900">
                                  <Lock className="w-3 h-3" />
                                  Protected
                                </div>
                              )}
                              <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg dark:text-white">
                                {study.year}
                              </div>
                              <div className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                                {study.category}
                              </div>
                              <h3 className="text-2xl md:text-3xl font-bold dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {study.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {study.subtitle}
                              </p>
                              <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium gap-2 group-hover:gap-3 transition-all">
                                View case study
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </motion.div>
        )}

        {/* ══ ABOUT ME TAB ══════════════════════════════════════════════════ */}
        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Bio block */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 items-start">
                {/* Profile photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center lg:justify-start"
                >
                  <div className="relative w-52 h-52 lg:w-64 lg:h-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(236,72,153,0.6) 50%, transparent 100%)" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: "conic-gradient(from 90deg, transparent 0%, rgba(59,130,246,0.5) 40%, transparent 100%)" }}
                    />
                    <div className="absolute inset-3 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border-4 border-white dark:border-gray-800 shadow-2xl">
                      {settings?.profileImageUrl ? (
                        <img src={settings.profileImageUrl} alt={settings.siteName || "Profile"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl">👤</div>
                      )}
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl"
                    />
                  </div>
                </motion.div>

                {/* Bio text */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
                    I create digital products that{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      make a difference
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    I'm a UI/UX Design Lead and Product Owner with 10+ years of experience crafting
                    meaningful digital experiences across banking, cybersecurity, healthcare, and
                    product startups. I combine user empathy with strategic thinking to deliver
                    solutions that are both beautiful and functional.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Currently at CIMB Bank PH, I serve as the sole UI/UX design authority —
                    managing the Figma design system, driving product strategy, and bridging the gap
                    between design, engineering, and business.
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg group"
                    >
                      Get in touch
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Values */}
            <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 py-20">
              <div className="max-w-7xl mx-auto px-6">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-12"
                >
                  Core Values
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {values.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <v.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 dark:text-white">{v.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{v.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience timeline */}
            <section className="max-w-5xl mx-auto px-6 py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-14"
              >
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                  Experience
                </p>
              </motion.div>

              <div className="space-y-8">
                {experienceData.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-colors group"
                  >
                    <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full bg-gradient-to-br ${exp.gradient} group-hover:scale-150 transition-transform shadow-md`} />
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                      <div className={`text-sm font-semibold mb-2 bg-gradient-to-r ${exp.gradient} bg-clip-text text-transparent`}>
                        {exp.year}
                      </div>
                      <h3 className="text-2xl font-bold mb-1 dark:text-white">{exp.role}</h3>
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-4 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        {exp.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
                />
              </div>
              <div className="relative max-w-7xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <p className="text-sm uppercase tracking-wider text-purple-300 font-semibold mb-2">
                    Skills & Expertise
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold">What I bring to the table</h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {skillsData.map((cat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ y: -6 }}
                      className={`bg-gradient-to-br ${cat.gradient} backdrop-blur-sm rounded-2xl p-6 border ${cat.border} flex flex-col gap-4`}
                    >
                      <div>
                        <span className="text-3xl mb-3 block">{cat.emoji}</span>
                        <h3 className="font-bold text-white leading-snug">{cat.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {cat.skills.map((skill, si) => (
                          <li key={si} className="flex items-center gap-2 text-sm text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 py-32">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full" />
                  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white rounded-full" />
                </div>
                <div className="relative text-center py-20 px-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                    Let's create something great
                  </h2>
                  <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                    I'm always interested in hearing about new projects and opportunities.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg group"
                  >
                    Get in touch
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
