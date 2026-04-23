import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight, Mail, Linkedin, Twitter, Github, Dribbble,
  Lock, Sparkles, Users, Zap,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { TypingAnimation } from "../components/TypingAnimation";
import { NetworkBackground } from "../components/NetworkBackground";
import { useCaseStudies } from "../hooks/useCaseStudies";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useHomepageSections } from "../hooks/useHomepageSections";
import type { SkillCategory } from "../hooks/useHomepageSections";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";

export function HomePage() {
  const { caseStudies, loading } = useCaseStudies();
  const { settings } = useSiteSettings();
  const { sections, isSectionVisible, getSectionConfig } = useHomepageSections();

  usePageMeta();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-white dark:bg-black">
        <div className="w-6 h-6 border-2 border-[#1d1d1f] dark:border-[#f5f5f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Sparkles;
  };

  // Section configs
  const statsConfig     = getSectionConfig("stats");
  const statsData       = statsConfig?.data?.stats || [
    { icon: "Users", value: "50+", label: "Happy Clients" },
    { icon: "Zap",   value: "100+", label: "Projects" },
    { icon: "Sparkles", value: "5+", label: "Years Experience" },
  ];

  const experienceConfig = getSectionConfig("experience");
  const experienceData   = experienceConfig?.data?.experience || [
    { year: "June 2021 – Present", role: "UI/UX Design Lead & Product Owner", company: "CIMB Bank PH", description: "Elevated to Product Owner with accountability for the strategic vision, roadmap, and delivery of key features within the digital banking platform. Serves as the sole UI/UX design authority, managing and maintaining the entire Figma design system." },
    { year: "March 2017 – June 2021", role: "Product Designer", company: "Obelisk Security, Hong Kong", description: "Headed the redesign of cybersecurity product interfaces, enhancing user adoption rates. Collaborated with the development team to ensure designs translated seamlessly to functional applications." },
    { year: "March 2017 – June 2021", role: "UI/UX Designer", company: "Futureworks PH", description: "Served as Lead Designer for the full design lifecycle — from conceptualization and branding through to production. Functioned as a full-stack design expert." },
    { year: "March 2015 – 2016", role: "Frontend Designer, UI/UX", company: "ThousandMinds", description: "Supplied design assets for mobile and web applications, ensuring optimal user experience across all platforms." },
  ];

  const skillsConfig = getSectionConfig("skills");
  const skillsData: SkillCategory[] = skillsConfig?.data?.skills || [
    { emoji: "🛠", title: "Product Ownership & Strategy", skills: ["Product Lifecycle Management", "Roadmapping & Prioritization", "Stakeholder Management", "Customer Discovery & Validation"], gradient: "", border: "" },
    { emoji: "🎨", title: "UI/UX Design & Research", skills: ["UI Design & Prototyping", "Design Systems", "Interaction & Motion Design", "Accessibility Standards"], gradient: "", border: "" },
    { emoji: "🧱", title: "Development & Handoff", skills: ["Frontend Fundamentals", "Design-to-Dev Handoff", "Version Control & Collaboration"], gradient: "", border: "" },
    { emoji: "🧩", title: "Collaboration & Productivity", skills: ["Project & Task Management", "Cross-functional Team Leadership", "Agile / Scrum Workflows"], gradient: "", border: "" },
  ];

  const valuesConfig       = getSectionConfig("values");
  const valuesBioTitle     = valuesConfig?.data?.bioTitle || "I create digital products that make a difference";
  const valuesBioDescription = valuesConfig?.data?.bioDescription || "I'm a product designer with a passion for crafting intuitive, accessible, and beautiful digital experiences. My approach combines user empathy with business strategy to create solutions that truly work.";
  const valueItems         = valuesConfig?.data?.valueItems || [
    { icon: "Heart",     title: "Empathy First",   description: "Understanding user needs is at the heart of everything I design" },
    { icon: "Lightbulb", title: "Innovation",       description: "Pushing boundaries while keeping usability at the forefront" },
    { icon: "Target",    title: "Goal-Oriented",    description: "Aligning design decisions with business objectives and user needs" },
    { icon: "Users",     title: "Collaboration",    description: "Great products are built by great teams working together" },
  ];

  const philosophyConfig = getSectionConfig("philosophy");
  const philosophyCards  = philosophyConfig?.data?.philosophyCards || [
    { icon: "Target", label: "My Approach",   title: "User-centered, data-informed",   description: "I believe great design starts with understanding people. Through research, testing, and iteration, I create experiences that solve real problems while delivering business value.", gradient: "" },
    { icon: "Users",  label: "Beyond Pixels", title: "Collaboration & strategy",        description: "Design doesn't happen in isolation. I work closely with product managers, engineers, and stakeholders to ensure designs are feasible, strategic, and aligned with business goals.", gradient: "" },
  ];

  const featuredCaseStudies = caseStudies.filter(
    study => (study.visibility ?? "public") === "public" && study.featured
  );

  // CTA config
  const ctaConfig      = getSectionConfig("cta");
  const ctaHeading     = ctaConfig?.data?.ctaHeading     || "Open to the right opportunity.";
  const ctaDescription = ctaConfig?.data?.ctaDescription || "Got a full-time or remote consultant role? I'd love to hear about it.";
  const ctaEmail       = ctaConfig?.data?.ctaEmail       || settings?.contactEmail || "hello@yourname.com";
  const ctaButtonLabel = ctaConfig?.data?.ctaButtonLabel || "Send me a message";
  const ctaSocialLinks: Array<{ name: string; icon: string; url: string }> = ctaConfig?.data?.ctaSocialLinks || [
    { name: "LinkedIn", icon: "Linkedin", url: settings?.socialLinkedIn || "https://linkedin.com" },
    { name: "X",        icon: "Twitter",  url: settings?.socialTwitter  || "https://x.com"        },
    { name: "GitHub",   icon: "Github",   url: "https://github.com" },
    { name: "Dribbble", icon: "Dribbble", url: settings?.socialDribbble || "https://dribbble.com" },
  ];
  const linkedInUrl = ctaSocialLinks.find(l => l.icon === "Linkedin")?.url || settings?.socialLinkedIn;

  return (
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-[#f7f7f5] dark:bg-[#050507] overflow-hidden">

        {/* Fine dot-grid pattern — dark dots on white / white dots on dark */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.14) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient gradient blobs — light + dark */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
        />

        {/* Network icon background */}
        <NetworkBackground />

        {/* Hero content */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-24 md:py-32 pt-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-sm text-[#6e6e73] dark:text-white/40 mb-4 tracking-wide">
              👋 Hi, I'm{" "}
              <span className="text-[#1d1d1f] dark:text-white/70">{settings?.siteName || ""}</span>
            </p>

            <h1
              className="text-[2.8rem] sm:text-[3.6rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] dark:text-white mb-6 max-w-4xl"
            >
              Crafting meaningful<br />digital experiences.
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl text-[#6e6e73] dark:text-white/50 leading-relaxed max-w-2xl mb-10 min-h-[80px]">
              <TypingAnimation
                texts={settings?.heroTypingTexts && settings.heroTypingTexts.length > 0
                  ? settings.heroTypingTexts
                  : [
                      "Product designer focused on user-centered solutions that solve real problems.",
                      "Transforming complex challenges into intuitive, delightful experiences.",
                      "Crafting design systems and interfaces that feel natural and effortless.",
                    ]}
                typingSpeed={55}
                deletingSpeed={28}
                pauseDuration={3000}
                className=""
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-black/20 dark:border-white/20 text-[#1d1d1f] dark:text-white rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                View my work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      {isSectionVisible("stats") && (
        <section className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-y border-black/[0.06] dark:border-white/[0.08]">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {statsData.map((stat, i) => {
              const IconComp = getIconComponent(stat.icon);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#6e6e73] dark:text-[#98989d]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Values / About ────────────────────────────────────────────── */}
      {isSectionVisible("values") && (
        <section className="bg-white dark:bg-black">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
            {/* Bio row */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-20">
              {/* Photo */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-[#f5f5f7] dark:bg-[#2c2c2e] flex-shrink-0">
                  {settings?.profileImageUrl ? (
                    <img src={settings.profileImageUrl} alt={settings.siteName || "Profile"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                  )}
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col justify-center"
              >
                <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">About me</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-5 leading-tight tracking-tight">
                  {valuesBioTitle}
                </h2>
                <p className="text-base md:text-lg text-[#6e6e73] dark:text-[#98989d] leading-relaxed">
                  {valuesBioDescription}
                </p>
              </motion.div>
            </div>

            {/* Value cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueItems.map((value, i) => {
                const IconComp = getIconComponent(value.icon);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6"
                  >
                    <div className="w-9 h-9 bg-[#e8e8ed] dark:bg-[#2c2c2e] rounded-xl flex items-center justify-center mb-4">
                      <IconComp className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                    </div>
                    <h3 className="text-base text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{value.title}</h3>
                    <p className="text-sm text-[#6e6e73] dark:text-[#98989d] leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Philosophy ────────────────────────────────────────────────── */}
      {isSectionVisible("philosophy") && (
        <section className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-y border-black/[0.06] dark:border-white/[0.08]">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
            <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">Philosophy</p>
            <h2 className="text-3xl md:text-4xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-14 tracking-tight max-w-xl">
              How I approach every project
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {philosophyCards.map((card, i) => {
                const CardIcon = getIconComponent(card.icon);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-8"
                  >
                    <div className="w-9 h-9 bg-[#f5f5f7] dark:bg-[#3a3a3c] rounded-xl flex items-center justify-center mb-5">
                      <CardIcon className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-2">{card.label}</p>
                    <h3 className="text-xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">{card.title}</h3>
                    <p className="text-sm text-[#6e6e73] dark:text-[#98989d] leading-relaxed">{card.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Experience ────────────────────────────────────────────────── */}
      {isSectionVisible("experience") && (
        <section className="bg-white dark:bg-black">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
            <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">Experience</p>
            <h2 className="text-3xl md:text-4xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-14 tracking-tight">
              Professional journey
            </h2>

            <div className="space-y-0 divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {experienceData.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10"
                >
                  <div>
                    <p className="text-xs text-[#6e6e73] dark:text-[#98989d] leading-relaxed">{exp.year}</p>
                    <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">{exp.company}</p>
                  </div>
                  <div>
                    <h3 className="text-base text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{exp.role}</h3>
                    <p className="text-sm text-[#6e6e73] dark:text-[#98989d] leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Skills ───────────────────────────────────────────────────── */}
      {isSectionVisible("skills") && (
        <section className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-y border-black/[0.06] dark:border-white/[0.08]">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
            <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">Skills & Expertise</p>
            <h2 className="text-3xl md:text-4xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-14 tracking-tight">
              What I bring to the table
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {skillsData.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6"
                >
                  <span className="text-2xl mb-3 block">{category.emoji}</span>
                  <h3 className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 leading-snug">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.skills.map((skill, si) => (
                      <li key={si} className="flex items-start gap-2 text-xs text-[#6e6e73] dark:text-[#98989d]">
                        <span className="w-1 h-1 rounded-full bg-[#d2d2d7] dark:bg-[#48484a] mt-1.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Work ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black">
        <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
          <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">Selected work</p>
          <h2 className="text-3xl md:text-4xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-14 tracking-tight">
            Featured projects
          </h2>

          {featuredCaseStudies.length === 0 ? (
            <div className="py-20 text-center bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl">
              <p className="text-[#6e6e73] dark:text-[#98989d] text-sm">No case studies yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredCaseStudies.map((study, i) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <Link to={`/work/${study.id}`} className="group block">
                    <div className="relative aspect-[4/3] mb-5 overflow-hidden rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e]">
                      <ImageWithFallback
                        src={study.heroImage}
                        alt={study.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {study.isPasswordProtected && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[11px] text-white flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Protected
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {study.year}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs text-[#6e6e73] dark:text-[#98989d]">{study.category}</p>
                      <h3 className="text-lg text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:opacity-70 transition-opacity">
                        {study.title}
                      </h3>
                      <p className="text-sm text-[#6e6e73] dark:text-[#98989d] leading-relaxed">{study.subtitle}</p>
                      <div className="flex items-center gap-1.5 text-xs text-[#1d1d1f] dark:text-[#f5f5f7] pt-1">
                        View case study
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {featuredCaseStudies.length > 0 && (
            <div className="mt-12">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#d2d2d7] dark:border-white/20 text-[#1d1d1f] dark:text-[#f5f5f7] rounded-full text-sm hover:bg-[#f5f5f7] dark:hover:bg-white/10 transition-colors"
              >
                View all projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      {isSectionVisible("cta") && (
        <section className="bg-[#1d1d1f] dark:bg-[#f5f5f7]">
          <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-10"
            >
              {/* Left: copy */}
              <div className="max-w-md">
                <p className="text-xs uppercase tracking-widest text-white/30 dark:text-black/30 mb-4">
                  Availability
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-white dark:text-[#1d1d1f] tracking-tight leading-[1.08] mb-4">
                  {ctaHeading}
                </h2>
                <p className="text-base text-white/50 dark:text-[#6e6e73] leading-relaxed">
                  {ctaDescription}
                </p>
              </div>

              {/* Right: actions + socials */}
              <div className="flex flex-col items-start md:items-end gap-5 shrink-0">
                {/* Primary: LinkedIn */}
                {linkedInUrl && (
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0a66c2] hover:bg-[#0958a8] text-white text-sm transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                )}

                {/* Secondary: email */}
                <a
                  href={`mailto:${ctaEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-white/40 dark:text-black/40 hover:text-white/70 dark:hover:text-black/70 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {ctaButtonLabel}
                </a>

                {/* Social icon row */}
                <div className="flex items-center gap-2 pt-1">
                  {ctaSocialLinks.map((link) => {
                    const SocialIcon = getIconComponent(link.icon);
                    return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.name}
                        className="w-9 h-9 bg-white/[0.08] dark:bg-black/[0.08] hover:bg-white/[0.16] dark:hover:bg-black/[0.14] border border-white/10 dark:border-black/10 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <SocialIcon className="w-4 h-4 text-white/60 dark:text-black/60" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}