import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCaseStudy, useCaseStudies } from "@/app/hooks/useCaseStudies";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { PasswordPrompt } from "@/app/components/PasswordPrompt";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";

// Maps result count → safe Tailwind class (no dynamic string interpolation)
const RESULT_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function CaseStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { caseStudy: study, loading } = useCaseStudy(id || "");
  const { caseStudies } = useCaseStudies();

  const publicStudies = caseStudies.filter(
    (s) => (s.visibility ?? "public") === "public"
  );
  const currentIndex = publicStudies.findIndex((s) => s.id === id);
  const nextStudy =
    publicStudies.length > 0
      ? publicStudies[(currentIndex + 1) % publicStudies.length]
      : null;

  // Track window scroll — avoids the "ref not hydrated" error from useScroll({ target })
  const { scrollY } = useScroll();
  const heroScale   = useTransform(scrollY, [0, 700], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 520], [1, 0.35]);
  const heroY       = useTransform(scrollY, [0, 700], ["0%", "18%"]);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (password: string) => {
    if (study && [study.password, "codevpass"].includes(password)) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-white/40 text-sm tracking-widest uppercase"
        >
          Loading
        </motion.div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">
            404
          </p>
          <h1 className="text-white text-4xl font-bold mb-6">
            Case study not found
          </h1>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
        </div>
      </div>
    );
  }

  if ((study.visibility ?? "public") === "private") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-6 h-6 text-white/40" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-3">
            This project is private
          </h1>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">
            This case study is not publicly available.
          </p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
        </div>
      </div>
    );
  }

  if (study.isPasswordProtected && !isUnlocked) {
    return (
      <div className="min-h-screen pt-24 dark:bg-gray-900">
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onCancel={() => navigate("/")}
          error={passwordError}
        />
      </div>
    );
  }

  // ── Gallery layout helper ─────────────────────────────────────────────────
  // Groups: every 3 images → 1 full-width + 2 side-by-side
  // Remaining 1 or 2 images → full-width each
  const buildGallery = () => {
    const elements: JSX.Element[] = [];
    let i = 0;
    while (i < study.images.length) {
      const remaining = study.images.length - i;
      if (remaining >= 3) {
        // Full-width
        elements.push(
          <motion.div
            key={`img-full-${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1 }}
            className="aspect-[21/9] overflow-hidden"
          >
            <ImageWithFallback
              src={study.images[i]}
              alt={`${study.title} — ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        );
        i++;
        // Side-by-side pair
        elements.push(
          <div key={`img-pair-${i}`} className="grid grid-cols-2 gap-1">
            {[study.images[i], study.images[i + 1]].map((src, pi) => (
              <motion.div
                key={pi}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: pi * 0.12 }}
                className="aspect-[4/3] overflow-hidden"
              >
                <ImageWithFallback
                  src={src}
                  alt={`${study.title} — ${i + pi + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        );
        i += 2;
      } else {
        // Remaining: full-width
        elements.push(
          <motion.div
            key={`img-single-${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1 }}
            className="aspect-[16/9] overflow-hidden"
          >
            <ImageWithFallback
              src={study.images[i]}
              alt={`${study.title} — ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        );
        i++;
      }
    }
    return elements;
  };

  const resultGridClass =
    RESULT_GRID[Math.min(study.results.length, 4)] ?? "grid-cols-2 lg:grid-cols-4";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden">

      {/* ── 1 · HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative h-screen min-h-[680px] bg-[#050507] flex flex-col justify-end overflow-hidden"
      >
        {/* Parallax image */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 origin-center"
        >
          <ImageWithFallback
            src={study.heroImage}
            alt={study.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        </motion.div>

        {/* Back button */}
        <Link
          to="/work"
          className="absolute top-24 left-6 lg:left-12 z-20 inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors duration-300 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Work
        </Link>

        {/* Title content */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 w-full pb-16 lg:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white/35 text-[10px] tracking-[0.3em] uppercase mb-5 font-medium"
          >
            {study.category} — {study.year}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.92] tracking-tight mb-5"
          >
            {study.title}
          </motion.h1>

          {study.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-white/45 text-lg md:text-xl max-w-lg"
            >
              {study.tagline}
            </motion.p>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-px h-14 bg-gradient-to-b from-white/50 to-transparent origin-top mx-auto"
          />
        </motion.div>
      </section>

      {/* ── 2 · OVERVIEW ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black py-24 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          {/* Metadata strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-gray-200 dark:border-white/[0.08] mb-20 lg:mb-28"
          >
            {[
              { label: "Role", value: study.overview.role },
              { label: "Duration", value: study.overview.duration },
              { label: "Tools", value: study.overview.tools.join(" · ") },
            ].map((item, i) => (
              <div
                key={i}
                className={`py-7 ${
                  i > 0
                    ? "sm:pl-10 sm:border-l border-t sm:border-t-0 border-gray-200 dark:border-white/[0.08]"
                    : ""
                } ${i < 2 ? "sm:pr-10" : ""}`}
              >
                <p className="text-gray-400 dark:text-white/25 text-[10px] uppercase tracking-[0.22em] mb-1.5">
                  {item.label}
                </p>
                <p className="text-gray-900 dark:text-white/80 text-sm font-medium">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Large overview paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-2xl sm:text-3xl lg:text-[2.4rem] text-gray-900 dark:text-white leading-[1.38] max-w-5xl"
          >
            {study.overview.description}
          </motion.p>
        </div>
      </section>

      {/* ── 3 · THE BRIEF ────────────────────────────────────────────────── */}
      <section className="bg-[#050507] py-24 lg:py-36">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-10"
          >
            The Brief
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95 }}
            className="text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.22] font-medium max-w-5xl"
          >
            {study.subtitle}
          </motion.blockquote>
        </div>
      </section>

      {/* ── 4 · THE CHALLENGE ────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] dark:bg-[#0d0d0d] py-24 lg:py-36">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="block text-[7rem] lg:text-[9rem] font-bold text-gray-200 dark:text-white/[0.04] leading-none select-none -ml-1"
              >
                01
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 }}
                className="text-xl font-semibold text-gray-900 dark:text-white -mt-4"
              >
                The Challenge
              </motion.h2>
            </div>

            <motion.div
              className="lg:col-span-8 lg:pt-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <p className="text-lg lg:text-xl text-gray-600 dark:text-white/45 leading-relaxed">
                {study.problem}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5 · THE SOLUTION ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black py-24 lg:py-36">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="block text-[7rem] lg:text-[9rem] font-bold text-gray-100 dark:text-white/[0.04] leading-none select-none -ml-1"
              >
                02
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 }}
                className="text-xl font-semibold text-gray-900 dark:text-white -mt-4"
              >
                The Solution
              </motion.h2>
            </div>

            <motion.div
              className="lg:col-span-8 lg:pt-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
            >
              <p className="text-lg lg:text-xl text-gray-600 dark:text-white/45 leading-relaxed">
                {study.solution}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6 · PROCESS ──────────────────────────────────────────────────── */}
      {study.process.length > 0 && (
        <section className="bg-[#050507] py-24 lg:py-36">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-16"
            >
              Design Process
            </motion.p>

            <div className="divide-y divide-white/[0.06]">
              {study.process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: index * 0.04 }}
                  className="py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group cursor-default"
                >
                  <div className="md:col-span-1 pt-0.5">
                    <span className="text-white/20 text-xs font-mono tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-white text-base font-semibold group-hover:text-white/75 transition-colors duration-300">
                      {step.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-white/38 text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7 · GALLERY ──────────────────────────────────────────────────── */}
      {study.images.length > 0 && (
        <div className="bg-[#f5f5f7] dark:bg-[#0d0d0d] space-y-1">
          {buildGallery()}
        </div>
      )}

      {/* ── 8 · RESULTS ──────────────────────────────────────────────────── */}
      {study.results.length > 0 && (
        <section className="bg-[#050507] py-24 lg:py-36">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-16"
            >
              Results & Impact
            </motion.p>

            <div
              className={`grid ${resultGridClass} border border-white/[0.07]`}
            >
              {study.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.08 }}
                  className={`px-8 py-14 text-center border-white/[0.07] ${
                    index % 2 !== 0 ? "border-l" : ""
                  } ${index >= 2 ? "border-t" : ""} ${
                    study.results.length > 2 && index < 2 && study.results.length === 4
                      ? "lg:border-t-0"
                      : ""
                  } ${
                    index > 0 && study.results.length <= 4
                      ? "lg:border-l"
                      : ""
                  }`}
                >
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                    {result.value}
                  </p>
                  <p className="text-white/35 text-xs uppercase tracking-widest">
                    {result.metric}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9 · TESTIMONIAL ──────────────────────────────────────────────── */}
      {study.testimonial && (
        <section className="bg-white dark:bg-black py-24 lg:py-36">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              {/* Large quote mark */}
              <p className="text-gray-200 dark:text-white/10 text-8xl font-serif leading-none mb-0 -mb-4 select-none">
                "
              </p>
              <blockquote className="text-2xl sm:text-3xl text-gray-900 dark:text-white leading-[1.38] mb-12 font-medium">
                {study.testimonial.text}
              </blockquote>
              <div className="flex items-center justify-center gap-5">
                <div className="w-12 h-px bg-gray-200 dark:bg-white/15" />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-semibold">
                    {study.testimonial.author}
                  </p>
                  <p className="text-gray-400 dark:text-white/30 text-xs mt-0.5">
                    {study.testimonial.role}
                  </p>
                </div>
                <div className="w-12 h-px bg-gray-200 dark:bg-white/15" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 10 · NEXT PROJECT ────────────────────────────────────────────── */}
      {nextStudy && (
        <section className="relative bg-[#050507] overflow-hidden">
          <Link
            to={`/work/${nextStudy.id}`}
            className="group block relative h-[58vh] min-h-[380px]"
          >
            {/* Background image */}
            <motion.div
              className="absolute inset-0 origin-center"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ImageWithFallback
                src={nextStudy.heroImage}
                alt={nextStudy.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-16">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
                Next Project
              </p>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-white/35 text-xs tracking-wider mb-3">
                    {nextStudy.category} — {nextStudy.year}
                  </p>
                  <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-white/85 transition-colors duration-400">
                    {nextStudy.title}
                  </h3>
                </div>

                <motion.div
                  whileHover={{ scale: 1.12 }}
                  className="flex-shrink-0 w-14 h-14 rounded-full border border-white/25 flex items-center justify-center group-hover:border-white/50 transition-colors duration-400"
                >
                  <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </motion.div>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
