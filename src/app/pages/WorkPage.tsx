import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Lock, Filter } from "lucide-react";
import { useCaseStudies } from "../hooks/useCaseStudies";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageMeta } from "../hooks/usePageMeta";
import { useState } from "react";

export function WorkPage() {
  const { caseStudies, loading } = useCaseStudies();
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Set page title
  usePageMeta("Work");

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center dark:bg-gray-900">
        <div className="text-xl dark:text-white">Loading...</div>
      </div>
    );
  }

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(caseStudies.map(study => study.category)))];

  // Filter case studies by category
  const filteredCaseStudies = selectedCategory === "All" 
    ? caseStudies 
    : caseStudies.filter(study => study.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-8 max-w-4xl font-bold leading-tight">
              Selected{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                work
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              A collection of projects showcasing my approach to solving complex design challenges
              through research, strategy, and thoughtful execution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 text-gray-600 dark:text-gray-400"
        >
          Showing {filteredCaseStudies.length} {filteredCaseStudies.length === 1 ? 'project' : 'projects'}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {filteredCaseStudies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try selecting a different category
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {filteredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
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
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 text-gray-900"
                      >
                        <Lock className="w-3 h-3" />
                        Protected
                      </motion.div>
                    )}
                    
                    {/* Year Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
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
      </section>
    </div>
  );
}