import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import { useCaseStudies } from "../hooks/useCaseStudies";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";
import { useState } from "react";

/* ── Category colour palette ─────────────────────────────────── */
const PALETTE = [
  { bg: "#6366f1", light: "rgba(99,102,241,0.12)",  text: "#818cf8" },
  { bg: "#8b5cf6", light: "rgba(139,92,246,0.12)",  text: "#a78bfa" },
  { bg: "#3b82f6", light: "rgba(59,130,246,0.12)",  text: "#60a5fa" },
  { bg: "#06b6d4", light: "rgba(6,182,212,0.12)",   text: "#22d3ee" },
  { bg: "#10b981", light: "rgba(16,185,129,0.12)",  text: "#34d399" },
  { bg: "#f59e0b", light: "rgba(245,158,11,0.12)",  text: "#fbbf24" },
  { bg: "#ef4444", light: "rgba(239,68,68,0.12)",   text: "#f87171" },
  { bg: "#ec4899", light: "rgba(236,72,153,0.12)",  text: "#f472b6" },
];

function useCatColor(cat: string, allCats: string[]) {
  const idx = allCats.filter(c => c !== "All").indexOf(cat);
  return idx === -1 ? PALETTE[0] : PALETTE[idx % PALETTE.length];
}

export function WorkPage() {
  const { caseStudies, loading } = useCaseStudies();
  const [selectedCategory, setSelectedCategory] = useState("All");

  usePageMeta("Work");

  const publicStudies = caseStudies.filter(s => (s.visibility ?? "public") === "public");
  const rawCats       = Array.from(new Set(publicStudies.map(s => s.category)));
  const categories    = ["All", ...rawCats];

  const counts: Record<string, number> = {};
  categories.forEach(c => {
    counts[c] = c === "All" ? publicStudies.length : publicStudies.filter(s => s.category === c).length;
  });

  const filtered = selectedCategory === "All"
    ? publicStudies
    : publicStudies.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen pt-[52px] flex items-center justify-center bg-white dark:bg-black">
        <div className="w-6 h-6 border-2 border-[#1d1d1f] dark:border-[#f5f5f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-[52px]">

      {/* ── Page header ──────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">
            Portfolio
          </p>
          <h1 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4.2rem] leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 max-w-2xl">
            Selected work.
          </h1>
          <p className="text-base md:text-lg text-[#6e6e73] dark:text-[#98989d] max-w-xl leading-relaxed">
            A curated set of projects spanning UX research, product design, and systems thinking.
          </p>
        </motion.div>
      </section>

      {/* ── Category filter bar ───────────────────────────────────── */}
      <div className="sticky top-[52px] z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-black/[0.07] dark:border-white/[0.07]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            const color    = useCatColor(cat, categories);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all shrink-0 outline-none"
                style={{
                  background: isActive ? (cat === "All" ? "#1d1d1f" : color.bg) : "transparent",
                  color: isActive ? "#fff" : "#6e6e73",
                  boxShadow: isActive ? `0 0 0 1px ${cat === "All" ? "#1d1d1f" : color.bg}` : "0 0 0 1px rgba(0,0,0,0.1)",
                }}
              >
                {cat !== "All" && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-all"
                    style={{ background: isActive ? "rgba(255,255,255,0.6)" : color.bg }}
                  />
                )}
                {cat}
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)",
                    color: isActive ? "#fff" : "#6e6e73",
                  }}
                >
                  {counts[cat]}
                </span>
              </button>
            );
          })}

          <span className="ml-auto text-xs text-[#6e6e73] dark:text-[#98989d] shrink-0 pl-4">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      {/* ── Projects grid ─────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-12 pb-32">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10"
          >
            <p className="text-[#6e6e73] dark:text-[#98989d] text-sm">No projects in this category.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12"
            >
              {filtered.map((study, i) => (
                <ProjectCard key={study.id} study={study} index={i} allCats={rawCats} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}

/* ── Project card ─────────────────────────────────────────────── */
function ProjectCard({ study, index, allCats }: { study: any; index: number; allCats: string[] }) {
  const color = useCatColor(study.category, ["All", ...allCats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to={`/work/${study.id}`} className="group block">

        {/* ── Image container ── */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0f0f0f] dark:bg-[#0f0f0f] mb-4">
          <ImageWithFallback
            src={study.heroImage}
            alt={study.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] opacity-90 group-hover:opacity-100"
          />

          {/* Subtle bottom fade for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Year — top right */}
          <span className="absolute top-3.5 right-4 text-xs text-white/50 tracking-wide tabular-nums">
            {study.year}
          </span>

          {/* Lock badge — top left */}
          {study.isPasswordProtected && (
            <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-black/50 backdrop-blur-sm text-white/80">
              <Lock className="w-2.5 h-2.5" /> Protected
            </span>
          )}
        </div>

        {/* ── Text content ── */}
        <div className="px-1">
          {/* Category · first tag */}
          <p className="text-xs mb-1.5 truncate" style={{ color: color.text }}>
            {study.category}
            {study.tags?.length > 0 && (
              <> · {study.tags.slice(0, 2).join(" + ")}</>
            )}
          </p>

          {/* Title */}
          <h3 className="text-white mb-2 leading-snug tracking-tight">
            {study.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
            {study.subtitle}
          </p>

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:gap-2.5 transition-all">
            View case study <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}