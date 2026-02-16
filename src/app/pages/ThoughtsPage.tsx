import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  Search, 
  Calendar, 
  Clock, 
  Lock, 
  Tag,
  Filter,
  X 
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { BlogPost, blogCategories, formatBlogDate, getCategoryColor } from "@/app/data/blogPosts";

export function ThoughtsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/blog-posts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Only show published posts
        const publishedPosts = data.data.filter(
          (post: BlogPost) => post.status === "published"
        );
        setPosts(publishedPosts);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by published date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    setFilteredPosts(filtered);
  };

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-2xl font-semibold text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Thoughts & Ideas
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Musings on design, technology, creativity, and everything in between
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {selectedCategory !== "All" && (
                  <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === "All"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    All
                  </button>
                  {blogCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "All") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-3"
            >
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
            >
              Featured Articles
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/thoughts/${post.slug}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(
                              post.category
                            )} text-white text-sm font-semibold rounded-full shadow-lg`}
                          >
                            {post.category}
                          </span>
                        </div>
                        {post.passwordProtected && (
                          <div className="absolute top-4 right-4">
                            <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                              <Lock className="w-4 h-4 text-gray-700" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatBlogDate(post.publishedAt)}
                          </div>
                          {post.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readingTime} min read
                            </div>
                          )}
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {regularPosts.length === 0 && featuredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your filters or search query"
                  : "Check back soon for new content!"}
              </p>
            </motion.div>
          ) : (
            <>
              {regularPosts.length > 0 && (
                <>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
                  >
                    {featuredPosts.length > 0 ? "More Articles" : "All Articles"}
                  </motion.h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={`/thoughts/${post.slug}`}>
                          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <span
                                  className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(
                                    post.category
                                  )} text-white text-xs font-semibold rounded-full shadow-lg`}
                                >
                                  {post.category}
                                </span>
                              </div>
                              {post.passwordProtected && (
                                <div className="absolute top-4 right-4">
                                  <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <Lock className="w-4 h-4 text-gray-700" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                {post.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatBlogDate(post.publishedAt)}
                                </div>
                                {post.readingTime && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {post.readingTime} min
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}