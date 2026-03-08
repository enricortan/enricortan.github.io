import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Lock,
  Linkedin,
  Link2,
  CheckCheck,
} from "lucide-react";
import { XIcon } from "@/app/components/XIcon";
import ReactMarkdown from "react-markdown";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { BlogPost, blogCategories, formatBlogDate } from "@/app/data/blogPosts";

/* ── Category colour palette ─────────────────────────────────── */
const PALETTE = [
  { bg: "#6366f1", light: "rgba(99,102,241,0.09)",  text: "#6366f1" },
  { bg: "#8b5cf6", light: "rgba(139,92,246,0.09)",  text: "#8b5cf6" },
  { bg: "#3b82f6", light: "rgba(59,130,246,0.09)",  text: "#3b82f6" },
  { bg: "#06b6d4", light: "rgba(6,182,212,0.09)",   text: "#06b6d4" },
  { bg: "#10b981", light: "rgba(16,185,129,0.09)",  text: "#10b981" },
  { bg: "#f59e0b", light: "rgba(245,158,11,0.09)",  text: "#d97706" },
  { bg: "#ef4444", light: "rgba(239,68,68,0.09)",   text: "#ef4444" },
  { bg: "#ec4899", light: "rgba(236,72,153,0.09)",  text: "#ec4899" },
];
function catColor(cat: string) {
  const idx = blogCategories.indexOf(cat);
  return idx === -1 ? PALETTE[0] : PALETTE[idx % PALETTE.length];
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost]                   = useState<BlogPost | null>(null);
  const [loading, setLoading]             = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword]           = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [linkCopied, setLinkCopied]       = useState(false);

  useEffect(() => { if (slug) fetchPost(); }, [slug]);

  const fetchPost = async () => {
    try {
      const res  = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/blog-posts/${slug}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        if (p.status !== "published") { navigate("/thoughts"); return; }
        if (p.passwordProtected) {
          const saved = sessionStorage.getItem(`blog_post_${p.id}`);
          if (saved === p.password) setPost(p);
          else { setPost(p); setPasswordRequired(true); }
        } else {
          setPost(p);
        }
      } else {
        navigate("/thoughts");
      }
    } catch { navigate("/thoughts"); }
    finally  { setLoading(false); }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (password === post.password) {
      sessionStorage.setItem(`blog_post_${post.id}`, password);
      setPasswordRequired(false);
      setPassword("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  const shareOn = (platform: string) => {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || "");
    const map: Record<string, string> = {
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (map[platform]) window.open(map[platform], "_blank", "width=600,height=400");
  };

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen pt-[52px] flex items-center justify-center bg-white dark:bg-black">
        <div className="w-5 h-5 border-2 border-[#1d1d1f] dark:border-[#f5f5f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Password gate ───────────────────────────────────────────── */
  if (passwordRequired && post) {
    const color = catColor(post.category);
    return (
      <div className="min-h-screen pt-[52px] bg-white dark:bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-7"
            style={{ background: color.bg }}
          >
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-center text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
            Protected Article
          </h2>
          <p className="text-[#6e6e73] dark:text-[#98989d] text-sm text-center mb-7">
            Enter the password to read this article.
          </p>
          <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-[#2c2c2e] rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#98989d] outline-none focus:ring-2 focus:ring-[#0071e3] text-sm"
                placeholder="Password"
                autoFocus required
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] rounded-xl text-sm font-semibold hover:bg-black dark:hover:bg-white transition-colors"
              >
                Access Article
              </button>
            </form>
          </div>
          <div className="mt-5 text-center">
            <Link to="/thoughts" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
              ← Back to all articles
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!post) return null;

  const color = catColor(post.category);

  /* ── Article ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-[52px]">

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div className="max-w-[860px] mx-auto px-6 pt-10 pb-0">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            to="/thoughts"
            className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] dark:text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Thoughts
          </Link>
        </motion.div>
      </div>

      {/* ── Article header ───────────────────────────────────────── */}
      <header className="max-w-[860px] mx-auto px-6 pt-10 pb-12">
        {/* Category + meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-wrap items-center gap-3 mb-7"
        >
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: color.light, color: color.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color.bg }} />
            {post.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-[#98989d]">
            {post.author && (
              <span className="text-[#6e6e73] dark:text-[#6e6e73] font-medium">{post.author}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatBlogDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-[2.25rem] sm:text-[2.8rem] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.12] tracking-[-0.025em] mb-5"
        >
          {post.title}
        </motion.h1>

        {/* Subtitle / description */}
        {post.description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-[1.15rem] text-[#6e6e73] dark:text-[#98989d] leading-relaxed"
          >
            {post.description}
          </motion.p>
        )}
      </header>

      {/* ── Hero image — contained, not full-bleed ───────────────── */}
      {post.thumbnail && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="max-w-[860px] mx-auto px-6 mb-14"
        >
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#f5f5f7] dark:bg-[#1c1c1e] shadow-xl shadow-black/[0.08] dark:shadow-black/40">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* ── Prose body ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="max-w-[860px] mx-auto px-6 pb-24"
      >
        {/* Top divider with accent */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.07]" />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color.bg }} />
          <div className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.07]" />
        </div>

        {/* Markdown content */}
        <div className="article-prose">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-[1.8rem] text-[#1d1d1f] dark:text-[#f5f5f7] mt-14 mb-5 first:mt-0 tracking-[-0.015em] leading-[1.2]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[1.45rem] text-[#1d1d1f] dark:text-[#f5f5f7] mt-12 mb-4 tracking-[-0.01em] leading-[1.25]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[1.15rem] text-[#1d1d1f] dark:text-[#f5f5f7] mt-8 mb-3 leading-snug">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[1.0625rem] text-[#3d3d3f] dark:text-[#c7c7cc] leading-[1.82] mb-7">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-7 space-y-2.5 pl-6 list-disc marker:text-[#c7c7cc] dark:marker:text-[#6e6e73]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-7 space-y-2.5 pl-6 list-decimal marker:text-[#98989d] dark:marker:text-[#6e6e73]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-[1.0625rem] text-[#3d3d3f] dark:text-[#c7c7cc] leading-[1.75]">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-10 pl-6 border-l-[2px] border-[#1d1d1f] dark:border-[#3a3a3c]">
                  <div className="text-[1.175rem] text-[#1d1d1f] dark:text-[#f5f5f7] italic leading-[1.7]">
                    {children}
                  </div>
                </blockquote>
              ),
              pre: ({ children }) => (
                <pre className="mb-7 overflow-x-auto rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 text-sm font-mono text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
                  {children}
                </pre>
              ),
              code: ({ children, className }) => {
                const isBlock = !!className?.includes("language-");
                return isBlock ? (
                  <code className="block text-sm font-mono">{children}</code>
                ) : (
                  <code className="bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#e5e5ea] px-1.5 py-0.5 rounded-md text-[0.875em] font-mono">
                    {children}
                  </code>
                );
              },
              em: ({ children }) => (
                <em className="italic text-[#6e6e73] dark:text-[#98989d]">{children}</em>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline underline-offset-3 decoration-[#0071e3]/40 transition-colors"
                >
                  {children}
                </a>
              ),
              hr: () => (
                <div className="flex items-center gap-4 my-12">
                  <div className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.07]" />
                  <div className="flex gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-[#c7c7cc] dark:bg-[#3a3a3c]" />
                    <div className="w-1 h-1 rounded-full bg-[#c7c7cc] dark:bg-[#3a3a3c]" />
                    <div className="w-1 h-1 rounded-full bg-[#c7c7cc] dark:bg-[#3a3a3c]" />
                  </div>
                  <div className="h-px flex-1 bg-black/[0.07] dark:bg-white/[0.07]" />
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* ── Bottom divider ─────────────────────────────────────── */}
        <div className="h-px w-full bg-black/[0.07] dark:bg-white/[0.07] mt-12 mb-8" />

        {/* ── Tags ──────────────────────────────────────────────── */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="w-3.5 h-3.5 text-[#98989d] flex-shrink-0" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#6e6e73] dark:text-[#98989d] rounded-lg text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Share + Back ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          {/* Share */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#98989d] uppercase tracking-widest mr-1">Share</span>
            <button
              onClick={() => shareOn("twitter")}
              aria-label="Share on X"
              className="p-2 rounded-lg text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => shareOn("linkedin")}
              aria-label="Share on LinkedIn"
              className="p-2 rounded-lg text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={copyLink}
              aria-label="Copy link"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                linkCopied
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e]"
              }`}
            >
              {linkCopied ? (
                <><CheckCheck className="w-3.5 h-3.5" /> Copied</>
              ) : (
                <><Link2 className="w-3.5 h-3.5" /> Copy link</>
              )}
            </button>
          </div>

          {/* Back */}
          <Link
            to="/thoughts"
            className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] dark:text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All articles
          </Link>
        </div>
      </motion.div>
    </div>
  );
}