import { motion } from "motion/react";
import { ArrowRight, Heart, Lightbulb, Target, Users } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Sparkles, Layers, Zap } from "lucide-react";

export function AboutPage() {
  const [settings] = useState({
    aboutTitle: "Let's work together",
    aboutDescription:
      "I'm passionate about solving complex problems through thoughtful design. With over 5 years of experience in product design, I've helped companies of all sizes create digital experiences that users love. My approach combines user research, strategic thinking, and visual design to deliver solutions that are both beautiful and functional.",
    aboutExpertise: [
      "Product Design",
      "UX Research",
      "Design Systems",
      "Prototyping",
      "User Testing",
      "Interface Design",
    ],
  });

  const services = [
    {
      icon: Sparkles,
      title: "Product Design",
      description: "Creating intuitive and engaging user experiences",
    },
    {
      icon: Users,
      title: "User Research",
      description: "Understanding user needs through data and insights",
    },
    {
      icon: Layers,
      title: "Design Systems",
      description: "Building scalable and consistent design languages",
    },
    {
      icon: Zap,
      title: "Prototyping",
      description: "Bringing ideas to life with interactive prototypes",
    },
  ];

  const experience = [
    {
      year: "2022 - Present",
      role: "Senior Product Designer",
      company: "Tech Innovations Inc.",
      description: "Leading design for core products, managing design system",
    },
    {
      year: "2020 - 2022",
      role: "Product Designer",
      company: "Digital Solutions Co.",
      description: "Designed user-centered solutions for B2B SaaS products",
    },
    {
      year: "2018 - 2020",
      role: "UI/UX Designer",
      company: "Creative Agency",
      description: "Created designs for diverse clients across industries",
    },
  ];

  const values = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                About Me
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-8 max-w-4xl font-bold leading-tight">
              I create digital products that{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                make a difference
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              I'm a product designer based in San Francisco with a passion for crafting
              intuitive, accessible, and beautiful digital experiences. My approach
              combines user empathy with business strategy to create solutions that
              truly work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-12"
        >
          Core Values
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
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
      </section>

      {/* Philosophy Section */}
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

      {/* Experience Timeline */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-12"
        >
          Experience
        </motion.h2>

        <div className="space-y-8">
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-colors group"
            >
              <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full group-hover:scale-150 transition-transform" />
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">{exp.year}</div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white">{exp.role}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 font-medium">{exp.company}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
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
            {settings.aboutExpertise.map((skill, index) => (
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

      {/* CTA Section */}
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
    </div>
  );
}