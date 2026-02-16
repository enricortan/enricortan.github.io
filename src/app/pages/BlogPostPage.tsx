import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Lock,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  BlogPost,
  formatBlogDate,
  getCategoryColor,
} from "@/app/data/blogPosts";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/blog-posts/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        const fetchedPost = data.data;

        // Check if post is published
        if (fetchedPost.status !== "published") {
          navigate("/thoughts");
          return;
        }

        // Check if password is required
        if (fetchedPost.passwordProtected) {
          // Check if password is already in session storage
          const savedPassword = sessionStorage.getItem(
            `blog_post_${fetchedPost.id}`
          );
          if (savedPassword === fetchedPost.password) {
            setPost(fetchedPost);
            setPasswordRequired(false);
          } else {
            setPasswordRequired(true);
          }
        } else {
          setPost(fetchedPost);
        }
      } else {
        navigate("/thoughts");
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      navigate("/thoughts");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!post) return;

    // Verify password
    if (password === post.password) {
      // Save password to session storage
      sessionStorage.setItem(`blog_post_${post.id}`, password);
      setPasswordRequired(false);
      setPassword("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-2xl font-semibold text-gray-900">Loading...</div>
      </div>
    );
  }

  // Password protection screen
  if (passwordRequired && post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
              Protected Article
            </h2>
            <p className="text-gray-600 text-center mb-6">
              This article is password protected. Please enter the password to
              continue.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                  placeholder="Enter password"
                  required
                />
              </div>

              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
                >
                  {passwordError}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Access Article
              </button>

              <Link
                to="/thoughts"
                className="block text-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to all articles
              </Link>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-8">
        <Link
          to="/thoughts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 group border border-gray-100 dark:border-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Back to all posts</span>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-2 bg-gradient-to-r ${getCategoryColor(
                post.category
              )} text-white text-sm font-semibold rounded-full shadow-lg`}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-6">{post.description}</p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            {post.author && (
              <div className="font-medium text-gray-900">By {post.author}</div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatBlogDate(post.publishedAt)}
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </div>
            )}
            {post.publishedAt !== post.updatedAt && (
              <div className="text-sm text-gray-500">
                Updated {formatBlogDate(post.updatedAt)}
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm font-medium text-gray-700">Share:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors group"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="p-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 bg-gray-100 hover:bg-blue-700 hover:text-white rounded-lg transition-colors group"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={copyLink}
                className="p-2 bg-gray-100 hover:bg-purple-500 hover:text-white rounded-lg transition-colors group"
                aria-label="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg prose-purple max-w-none mb-12"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mb-6 text-gray-900 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-6 py-2 my-6 italic text-gray-600 bg-purple-50 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm text-purple-600 font-mono">
                    {children}
                  </code>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-600">{children}</em>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-5 h-5 text-gray-400" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Articles Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/thoughts"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to all articles
          </Link>
        </motion.div>
      </article>
    </div>
  );
}