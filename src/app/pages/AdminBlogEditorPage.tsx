import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { AdminLayout } from "@/app/components/AdminLayout";
import {
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  X,
  Plus,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  BlogPost,
  blogCategories,
  BlogCategory,
  calculateReadingTime,
} from "@/app/data/blogPosts";

export function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    category: "Design & UX",
    tags: [],
    status: "draft",
    featured: false,
    passwordProtected: false,
    password: "",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "Enrico",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && id) {
      fetchPost();
    }
  }, [id, isNew]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Password": token || "",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPost(data.data);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setPost({
      ...post,
      title,
      slug: isNew ? generateSlug(title) : post.slug,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !post.tags?.includes(tagInput.trim())) {
      setPost({
        ...post,
        tags: [...(post.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost({
      ...post,
      tags: post.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleSave = async (status?: "draft" | "published") => {
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      const readingTime = calculateReadingTime(post.content || "");
      
      const postData = {
        ...post,
        status: status || post.status,
        readingTime,
        updatedAt: new Date().toISOString(),
        publishedAt:
          status === "published" && post.status === "draft"
            ? new Date().toISOString()
            : post.publishedAt,
      };

      const url = isNew
        ? `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts`
        : `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/admin/blog-posts/${id}`;

      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-Admin-Password": token || "",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Blog post ${isNew ? "created" : "updated"} successfully!`);
        if (isNew && data.data?.id) {
          navigate(`/admin/blog/${data.data.id}`);
        }
      } else {
        alert("Failed to save blog post");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error saving blog post");
    } finally {
      setSaving(false);
    }
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
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {isNew ? "New Blog Post" : "Edit Blog Post"}
              </h1>
              <p className="text-gray-600">
                {isNew ? "Create a new article" : "Update your article"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {post.status === "draft" && (
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
                Publish
              </button>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white text-2xl font-bold"
                placeholder="Enter post title..."
                required
              />
            </motion.div>

            {/* Slug */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                placeholder="url-friendly-slug"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                URL: /thoughts/{post.slug || "your-slug"}
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                value={post.description}
                onChange={(e) =>
                  setPost({ ...post, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                placeholder="Brief description for the listing page..."
                required
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content (Markdown) *
              </label>
              <textarea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-y text-gray-900 bg-white font-mono text-sm"
                placeholder="Write your content in Markdown format...&#10;&#10;# Heading 1&#10;## Heading 2&#10;&#10;**Bold text**&#10;*Italic text*&#10;&#10;- List item&#10;- List item"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Supports Markdown formatting. Estimated reading time:{" "}
                {calculateReadingTime(post.content || "")} min
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail URL *
              </label>
              <input
                type="url"
                value={post.thumbnail}
                onChange={(e) => setPost({ ...post, thumbnail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white mb-3"
                placeholder="https://example.com/image.jpg"
                required
              />
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-40 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={post.category}
                onChange={(e) =>
                  setPost({ ...post, category: e.target.value as BlogCategory })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                required
              >
                {blogCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPost({
                        ...post,
                        status: post.status === "draft" ? "published" : "draft",
                      })
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {post.status === "published" ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Draft
                      </>
                    )}
                  </button>
                </div>

                {/* Featured */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Featured
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPost({ ...post, featured: !post.featured })
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                      post.featured
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        post.featured ? "fill-current" : ""
                      }`}
                    />
                    {post.featured ? "Featured" : "Not Featured"}
                  </button>
                </div>

                {/* Password Protection */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Password Protection
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPost({
                          ...post,
                          passwordProtected: !post.passwordProtected,
                        })
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                        post.passwordProtected
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.passwordProtected ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Protected
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Public
                        </>
                      )}
                    </button>
                  </div>
                  {post.passwordProtected && (
                    <input
                      type="text"
                      value={post.password || ""}
                      onChange={(e) =>
                        setPost({ ...post, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                      placeholder="Set password..."
                    />
                  )}
                </div>

                {/* Author */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={post.author || ""}
                    onChange={(e) =>
                      setPost({ ...post, author: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                    placeholder="Author name..."
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
