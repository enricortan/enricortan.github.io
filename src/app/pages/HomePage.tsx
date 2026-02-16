import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Mail,
  Linkedin,
  Twitter,
  Dribbble,
  Users,
  Zap,
  Lock,
  Heart,
  Lightbulb,
  Target,
  Layers,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { TypingAnimation } from "../components/TypingAnimation";
import { NetworkBackground } from "../components/NetworkBackground";
import { useCaseStudies } from "../hooks/useCaseStudies";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useHomepageSections } from "../hooks/useHomepageSections";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";

export function HomePage() {
  const { caseStudies, loading } = useCaseStudies();
  const { settings } = useSiteSettings();
  const { sections, isSectionVisible, getSectionConfig } = useHomepageSections();
  
  // Set page title and favicon
  usePageMeta();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center dark:bg-gray-900">
        <div className="text-xl dark:text-white">Loading...</div>
      </div>
    );
  }

  // Get stats section configuration
  const statsConfig = getSectionConfig("stats");
  const statsData = statsConfig?.data?.stats || [
    { icon: "Users", value: "50+", label: "Happy Clients" },
    { icon: "Zap", value: "100+", label: "Projects Completed" },
    { icon: "Sparkles", value: "5+", label: "Years Experience" },
  ];

  // Filter for featured case studies only
  const featuredCaseStudies = caseStudies.filter(study => study.featured);

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Sparkles; // Fallback to Sparkles if icon not found
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors">
      {/* Hero Section - Full Width & Height */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Checkered Canvas Grid */}
          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(147, 51, 234) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(147, 51, 234) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Gradient Blurs - Positioned at top on mobile */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 dark:from-purple-500/20 dark:to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-pink-300/30 to-purple-300/30 dark:from-pink-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
          />

          {/* Network Background Pattern */}
          <NetworkBackground />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-16 sm:py-24 lg:py-32 z-10">
          <div className="max-w-[1800px] mx-auto">
            {/* Unified Content Area - Center on mobile, Left aligned on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-32 sm:pt-24 md:pt-16 lg:pt-20"
            >
              <div className="max-w-5xl lg:max-w-none mx-auto">
                {/* Animated Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8 sm:mb-6 lg:mb-4"
                >
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-gray-800 dark:text-gray-200 text-center lg:text-left">
                    <span className="inline-block mr-2 sm:mr-3">👋</span>
                    {settings?.heroGreeting || "Hi"}, I'm{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                      {settings?.siteName || ''}
                    </span>
                  </h2>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-[2.8rem] xs:text-[3.2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl mb-6 xs:mb-8 sm:mb-10 leading-[1.2] xs:leading-[1.25] sm:leading-[1.05] font-bold dark:text-white text-center lg:text-left"
                >
                  Crafting{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    meaningful
                  </span>
                  <br />
                  digital experiences
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-4 sm:mb-8 lg:mb-12 text-center lg:text-left"
                >
                  <div className="h-[180px] sm:h-[180px] md:h-[160px] max-w-[900px] lg:mx-0 mx-auto">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      <TypingAnimation
                        texts={settings?.heroTypingTexts && settings.heroTypingTexts.length > 0 
                          ? settings.heroTypingTexts 
                          : [
                              "I'm a product designer focused on creating user-centered solutions that solve real problems and delight users.",
                              "I transform complex challenges into intuitive experiences that users love and businesses value.",
                              "I craft thoughtful design systems and interfaces that make digital products accessible and engaging.",
                              "I help startups and companies build beautiful products through research-driven design processes."
                            ]}
                        typingSpeed={60}
                        deletingSpeed={30}
                        pauseDuration={3000}
                        className="text-gray-900 dark:text-white"
                      />
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-4"
                >
                  <Link
                    to="/contact"
                    className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    Let's talk
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/work"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                  >
                    View my work
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {isSectionVisible("stats") && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Values Grid - from About */}
      {isSectionVisible("values") && (
        <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Two Column Layout: Photo Left, Content Right */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 mb-16">
              {/* Profile Photo - Left Column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[300px]">
                  {/* Animated Ring 1 - Purple/Pink */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent 0%, rgba(236, 72, 153, 0.6) 50%, transparent 100%)",
                    }}
                  />

                  {/* Animated Ring 2 - Blue/Cyan */}
                  <motion.div
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 90deg, transparent 0%, rgba(59, 130, 246, 0.5) 40%, transparent 100%)",
                    }}
                  />

                  {/* Animated Ring 3 - Purple */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 180deg, transparent 0%, rgba(168, 85, 247, 0.5) 30%, transparent 100%)",
                    }}
                  />

                  {/* Animated Ring 4 - Teal */}
                  <motion.div
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 270deg, transparent 0%, rgba(20, 184, 166, 0.4) 35%, transparent 100%)",
                    }}
                  />

                  {/* Image Container */}
                  <div className="absolute inset-3 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 border-4 border-white dark:border-gray-800 shadow-2xl">
                    {settings?.profileImageUrl ? (
                      <img
                        src={settings.profileImageUrl}
                        alt={settings.siteName || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-8xl">👤</div>
                      </div>
                    )}
                  </div>

                  {/* Pulse Effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl"
                  />
                </div>
              </motion.div>

              {/* Content - Right Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center text-center lg:text-left"
              >
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8 mx-auto lg:mx-0 w-fit">
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    About Me
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-bold leading-tight">
                  I create digital products that{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    make a difference
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  I'm a product designer based in San Francisco with a passion for crafting
                  intuitive, accessible, and beautiful digital experiences. My approach
                  combines user empathy with business strategy to create solutions that
                  truly work.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Empathy First",
                  description: "Understanding user needs is at the heart of everything I design",
                },
                {
                  icon: Lightbulb,
                  title: "Innovation",
                  description: "Pushing boundaries while keeping usability at the forefront",
                },
                {
                  icon: Target,
                  title: "Goal-Oriented",
                  description: "Aligning design decisions with business objectives and user needs",
                },
                {
                  icon: Users,
                  title: "Collaboration",
                  description: "Great products are built by great teams working together",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      {isSectionVisible("philosophy") && (
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-purple-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-4">
                  My Approach
                </h2>
                <h3 className="text-3xl font-bold mb-6 dark:text-white">User-centered, data-informed</h3>
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  I believe great design starts with understanding people. Through
                  research, testing, and iteration, I create experiences that solve real
                  problems while delivering business value.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-blue-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  Beyond Pixels
                </h2>
                <h3 className="text-3xl font-bold mb-6 dark:text-white">Collaboration & strategy</h3>
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  Design doesn't happen in isolation. I work closely with product
                  managers, engineers, and stakeholders to ensure designs are feasible,
                  strategic, and aligned with business goals.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {isSectionVisible("experience") && (
        <section className="relative max-w-7xl mx-auto px-6 py-32 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30" />
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="inline-block text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-4 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                Experience
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 dark:text-white">
                Professional Journey
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-purple-400 to-blue-400 dark:from-purple-800 dark:via-purple-600 dark:to-blue-600 md:-ml-0.5" />

                <div className="space-y-16">
                  {[
                    {
                      year: "2022 - Present",
                      role: "Senior Product Designer",
                      company: "Tech Innovations Inc.",
                      description: "Leading design for core products, managing design system, and mentoring junior designers. Driving user-centered design initiatives across multiple product teams.",
                      icon: "Briefcase",
                      gradient: "from-purple-600 to-blue-600",
                    },
                    {
                      year: "2020 - 2022",
                      role: "Product Designer",
                      company: "Digital Solutions Co.",
                      description: "Designed user-centered solutions for B2B SaaS products, conducted user research, and collaborated with cross-functional teams to deliver impactful features.",
                      icon: "Sparkles",
                      gradient: "from-blue-600 to-indigo-600",
                    },
                    {
                      year: "2018 - 2020",
                      role: "UI/UX Designer",
                      company: "Creative Agency",
                      description: "Created designs for diverse clients across industries, from startups to enterprise companies. Built expertise in rapid prototyping and user testing.",
                      icon: "Palette",
                      gradient: "from-indigo-600 to-purple-600",
                    },
                  ].map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      className={`relative flex flex-col md:flex-row gap-8 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 md:-ml-3 top-0 z-10">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${exp.gradient} shadow-lg shadow-purple-500/50 ring-4 ring-white dark:ring-gray-900`}
                        />
                      </div>

                      {/* Content card */}
                      <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                        <motion.div
                          whileHover={{ y: -8 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
                        >
                          {/* Gradient accent */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exp.gradient} rounded-t-2xl`} />
                          
                          {/* Year badge */}
                          <div className={`inline-flex items-center gap-2 text-sm font-bold mb-4 bg-gradient-to-r ${exp.gradient} bg-clip-text text-transparent`}>
                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {exp.year}
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
                            {exp.role}
                          </h3>
                          
                          <p className="text-lg text-gray-900 dark:text-gray-300 mb-4 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full" />
                            {exp.company}
                          </p>
                          
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {exp.description}
                          </p>

                          {/* Hover effect overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity pointer-events-none`} />
                        </motion.div>
                      </div>

                      {/* Empty space for alternating layout on desktop */}
                      <div className="hidden md:block flex-1" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {isSectionVisible("skills") && (
        <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-wider text-purple-300 font-semibold mb-12"
            >
              Skills & Expertise
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Product Design", "UX Research", "Design Systems", "Prototyping", "User Testing", "Interface Design"].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                >
                  <span className="font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Available for new projects badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-purple-100 dark:border-purple-800">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Available for new projects
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-2">
            Selected Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold dark:text-white mb-4">Featured Projects</h3>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
        </motion.div>

        {featuredCaseStudies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
              No case studies yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Check back soon for portfolio projects
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {featuredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link to={`/work/${study.id}`} className="group block">
                  <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-xl">
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <ImageWithFallback
                      src={study.heroImage}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Password Protected Badge */}
                    {study.isPasswordProtected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 text-gray-900"
                      >
                        <Lock className="w-3 h-3" />
                        Protected
                      </motion.div>
                    )}
                    
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg dark:text-white"
                      >
                        {study.year}
                      </motion.div>

                    {/* Hover Arrow */}
                    <motion.div
                      className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                      {study.category}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{study.subtitle}</p>
                    
                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:gap-3 gap-2 transition-all">
                      View case study
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* View All Projects Button */}
        {featuredCaseStudies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              View all projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </section>

      {/* About Preview Section with Card Design */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 lg:p-16 text-white">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Let's work together
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/90 mb-8 leading-relaxed"
              >
                I'm passionate about solving complex problems through thoughtful design.
                With 5+ years of experience in product design, I've helped startups and
                established companies create experiences that users love.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg group"
                >
                  More about me
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-3 font-semibold">
                  Services
                </h3>
                <ul className="space-y-2">
                  {["Product Design", "User Research", "Design Systems", "Prototyping"].map((service, i) => (
                    <li key={i} className="flex items-center gap-2 text-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-3 font-semibold">
                  Tools
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Figma, Adobe Creative Suite, Principle, Protopie, Framer
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}