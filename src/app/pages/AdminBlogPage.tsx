import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { AdminLayout } from "@/app/components/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  FileText,
  Database,
  CheckCircle,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { BlogPost, formatBlogDate, getCategoryColor, sampleBlogPosts } from "@/app/data/blogPosts";

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [initializing, setInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePosts = async () => {
    setInitializing(true);
    setInitMessage("Initializing blog posts...");

    try {
      const token = localStorage.getItem("adminToken");
      
      // Save each sample blog post
      for (const post of sampleBlogPosts) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
              "X-Admin-Password": token || "",
            },
            body: JSON.stringify(post),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to save post: ${post.title}`);
        }
      }

      setInitMessage("✓ Successfully initialized 4 blog posts! Reloading...");
      
      // Reload posts
      setTimeout(() => {
        fetchPosts();
        setInitializing(false);
        setInitMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error initializing blog posts:", error);
      setInitMessage(`Error: ${error.message}`);
      setInitializing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
        }
      );

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
        alert("Blog post deleted successfully!");
      } else {
        alert("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("Error deleting blog post");
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
          body: JSON.stringify({ ...post, status: newStatus }),
        }
      );

      if (response.ok) {
        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, status: newStatus } : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-gray-900">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 text-lg">
              Manage your thoughts and articles
            </p>
          </div>
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.published}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.drafts}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "published"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Published ({stats.published})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "draft"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Drafts ({stats.drafts})
          </button>
        </div>

        {/* Initialize Button */}
        {posts.length === 0 && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-900">No Blog Posts Yet!</h3>
                <p className="text-gray-600 mb-4">
                  Get started by initializing 4 sample blog posts about UX/UI design and product management. These are high-quality, realistic posts that you can edit or use as templates.
                </p>
                <button
                  onClick={handleInitializePosts}
                  disabled={initializing}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Database className="w-5 h-5" />
                  {initializing ? "Initializing..." : "Initialize 4 Sample Blog Posts"}
                </button>
                {initMessage && (
                  <div className={`mt-3 flex items-center gap-2 ${
                    initMessage.includes("✓") ? "text-green-600" : initMessage.includes("Error") ? "text-red-600" : "text-gray-600"
                  }`}>
                    {initMessage.includes("✓") && <CheckCircle className="w-5 h-5" />}
                    {initMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Get started by creating your first blog post"
                : `No ${filter} posts yet`}
            </p>
            {filter === "all" && (
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            post.status === "published"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                        >
                          {post.status === "published" ? "Published" : "Draft"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span
                        className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(
                          post.category
                        )} text-white text-xs rounded-lg font-semibold`}
                      >
                        {post.category}
                      </span>
                      {post.passwordProtected && (
                        <span className="flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          Protected
                        </span>
                      )}
                      {post.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg font-semibold">
                          Featured
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatBlogDate(post.publishedAt)}
                      </span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{post.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        to={`/thoughts/${post.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}