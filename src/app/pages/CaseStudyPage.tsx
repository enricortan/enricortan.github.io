import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { useCaseStudy, useCaseStudies } from "@/app/hooks/useCaseStudies";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { PasswordPrompt } from "@/app/components/PasswordPrompt";
import { ArrowLeft, ArrowRight, Award, Clock, Wrench } from "lucide-react";

export function CaseStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { caseStudy: study, loading } = useCaseStudy(id || "");
  const { caseStudies } = useCaseStudies();
  const currentIndex = caseStudies.findIndex((s) => s.id === id);
  const nextStudy = caseStudies.length > 0 ? caseStudies[(currentIndex + 1) % caseStudies.length] : null;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (password: string) => {
    if (study && study.password === password) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center dark:bg-gray-900">
        <div className="text-xl dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl mb-4 font-bold dark:text-white">Case study not found</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Show password prompt if case study is protected and not unlocked
  if (study.isPasswordProtected && !isUnlocked) {
    return (
      <div className="min-h-screen pt-24 dark:bg-gray-900">
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onCancel={handleCancel}
          error={passwordError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 group border border-gray-100 dark:border-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Back to home</span>
        </Link>
      </div>

      {/* Hero Section with Parallax */}
      <section className="relative mb-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-semibold rounded-full mb-6"
              >
                {study.category} • {study.year}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold leading-tight"
              >
                {study.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed"
              >
                {study.subtitle}
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl"
          >
            <ImageWithFallback
              src={study.heroImage}
              alt={study.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Overview Section with Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-4">
              Overview
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">{study.overview.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {[
              { icon: Award, label: "Role", value: study.overview.role },
              { icon: Clock, label: "Duration", value: study.overview.duration },
              { icon: Wrench, label: "Tools", value: study.overview.tools.join(", ") },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold">
                    {item.label}
                  </h3>
                </div>
                <p className="text-gray-800 font-medium">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <h2 className="text-sm uppercase tracking-wider text-red-600 font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                The Problem
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">{study.problem}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <h2 className="text-sm uppercase tracking-wider text-green-600 font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                The Solution
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">{study.solution}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-2">
              Design Process
            </h2>
            <h3 className="text-4xl font-bold">How we got there</h3>
          </motion.div>

          <div className="space-y-8">
            {study.process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-lg leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Images Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {study.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl"
            >
              <ImageWithFallback
                src={image}
                alt={`${study.title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider text-purple-300 font-semibold mb-12"
          >
            Results & Impact
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {study.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <p className="text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  {result.value}
                </p>
                <p className="text-white/80">{result.metric}</p>
              </motion.div>
            ))}
          </div>

          {study.testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20"
            >
              <p className="text-2xl lg:text-3xl mb-8 leading-relaxed italic">
                "{study.testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full" />
                <div>
                  <p className="text-lg font-semibold">{study.testimonial.author}</p>
                  <p className="text-white/70">{study.testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Next Project */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm uppercase tracking-wider text-purple-600 font-semibold mb-8">
            Next Project
          </h2>
          {nextStudy && (
            <Link to={`/work/${nextStudy.id}`} className="group block">
              <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
                <ImageWithFallback
                  src={nextStudy.heroImage}
                  alt={nextStudy.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                >
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </motion.div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-semibold mb-2">
                    {nextStudy.category} • {nextStudy.year}
                  </p>
                  <h3 className="text-3xl lg:text-4xl font-bold group-hover:text-purple-600 transition-colors">
                    {nextStudy.title}
                  </h3>
                </div>
              </div>
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
}