import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Search, Clock, Lock, X, BookOpen, ArrowRight } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { BlogPost, blogCategories, formatBlogDate } from "@/app/data/blogPosts";

/* ── Category colour palette (used only for filter pill dots) ─── */
const PALETTE = [
  { bg: "#6366f1" }, { bg: "#8b5cf6" }, { bg: "#3b82f6" }, { bg: "#06b6d4" },
  { bg: "#10b981" }, { bg: "#f59e0b" }, { bg: "#ef4444" }, { bg: "#ec4899" },
];

function catColor(cat: string) {
  const idx = blogCategories.indexOf(cat);
  return idx === -1 ? PALETTE[0] : PALETTE[idx % PALETTE.length];
}

export function ThoughtsPage() {
  const [posts, setPosts]             = useState<BlogPost[]>([]);
  const [filtered, setFiltered]       = useState<BlogPost[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");

  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => { filterPosts(); }, [posts, searchQuery, selectedCat]);

  const fetchPosts = async () => {
    try {
      const res  = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cb2778c5/blog-posts`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (data.success) {
        setPosts(data.data.filter((p: BlogPost) => p.status === "published"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let f = [...posts];
    if (selectedCat !== "All") f = f.filter(p => p.category === selectedCat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    f.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    setFiltered(f);
  };

  const allCats     = ["All", ...blogCategories];
  const counts: Record<string, number> = {};
  allCats.forEach(c => {
    counts[c] = c === "All" ? posts.length : posts.filter(p => p.category === c).length;
  });
  const visibleCats = allCats.filter(c => counts[c] > 0);

  const featuredPosts = filtered.filter(p => p.featured);
  const regularPosts  = filtered.filter(p => !p.featured);

  if (loading) {
    return (
      <div className="min-h-screen pt-[52px] flex items-center justify-center bg-white dark:bg-black">
        <div className="w-6 h-6 border-2 border-[#1d1d1f] dark:border-[#f5f5f7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-[52px]">

      {/* ── Page header ─────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d] mb-4">Writing</p>
          <h1 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4.2rem] leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 max-w-2xl">
            Thoughts & ideas.
          </h1>
          <p className="text-base md:text-lg text-[#6e6e73] dark:text-[#98989d] max-w-xl leading-relaxed">
            Musings on design, technology, creativity, and everything in between.
          </p>
        </motion.div>
      </section>

      {/* ── Sticky toolbar ──────────────────────────────────────── */}
      <div className="sticky top-[52px] z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-black/[0.07] dark:border-white/[0.07]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* Search */}
          <div className="flex items-center gap-3 py-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98989d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, tags…"
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-transparent focus:border-[#d2d2d7] dark:focus:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#98989d] outline-none transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98989d] hover:text-[#6e6e73]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-xs text-[#98989d] ml-auto">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            {visibleCats.map(cat => {
              const isActive = selectedCat === cat;
              const color    = cat === "All" ? null : catColor(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-all shrink-0 outline-none"
                  style={{
                    background: isActive ? (color ? color.bg : "#1d1d1f") : "transparent",
                    color: isActive ? "#fff" : "#6e6e73",
                  }}
                >
                  {color && (
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isActive ? "rgba(255,255,255,0.55)" : color.bg }} />
                  )}
                  {cat}
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)",
                      color: isActive ? "#fff" : "#6e6e73",
                    }}
                  >
                    {counts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] ml-1"
              >
                "{searchQuery}" <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-40 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6 text-[#98989d]" />
          </div>
          <p className="text-[#1d1d1f] dark:text-[#f5f5f7]">
            {searchQuery || selectedCat !== "All" ? "No articles match your filters." : "No articles published yet."}
          </p>
          {(searchQuery || selectedCat !== "All") && (
            <button onClick={() => { setSearchQuery(""); setSelectedCat("All"); }} className="text-sm text-[#6e6e73] underline underline-offset-4">
              Clear filters
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCat}-${searchQuery}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Featured posts ───────────────────────────────────── */}
          {featuredPosts.length > 0 && (
            <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-12 pb-32">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d]">Featured</span>
                <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 mb-16">
                {featuredPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── Regular posts ────────────────────────────────────── */}
          {regularPosts.length > 0 && (
            <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-32">
              {featuredPosts.length > 0 && (
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#6e6e73] dark:text-[#98989d]">All articles</span>
                  <div className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                {regularPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Single unified card ─────────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to={`/thoughts/${post.slug}`} className="group block">

        {/* Image container */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0f0f0f] mb-4">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1e] to-[#0f0f0f]" />
          )}

          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Date — top right */}
          <span className="absolute top-3.5 right-4 text-xs text-white/50 tracking-wide">
            {formatBlogDate(post.publishedAt)}
          </span>

          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {post.passwordProtected && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-black/50 backdrop-blur-sm text-white/80">
                <Lock className="w-2.5 h-2.5" /> Protected
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-black/40 backdrop-blur-sm text-white/70">
                <Clock className="w-3 h-3" />{post.readingTime} min
              </span>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="px-1">
          <p className="text-xs text-white/50 mb-1.5 truncate">
            {post.category}
            {post.tags?.length > 0 && <> · {post.tags.slice(0, 2).join(" + ")}</>}
          </p>

          <h3 className="text-white mb-2 leading-snug tracking-tight">
            {post.title}
          </h3>

          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>

          <span className="inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:gap-2.5 transition-all">
            Read article <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}