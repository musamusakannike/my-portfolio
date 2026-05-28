"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaUser, FaSignOutAlt, FaPlus, FaNewspaper, FaTags, FaClock, FaEye, FaArrowRight } from "react-icons/fa";
import AuthModal from "@/components/ui/AuthModal";
import LoadingWrapper from "@/components/ui/LoadingWrapper";
import gsap from "gsap";

const BlogHub = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Newsletter state
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const searchContainerRef = useRef(null);
  const postsGridRef = useRef(null);

  const [categories, setCategories] = useState(["ALL", "FRONTEND", "BACKEND", "AI SYSTEMS", "SYSTEM DESIGN"]);

  // Force light mode only for the blog pages
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) root.classList.remove("dark");
    return () => {
      const savedTheme = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && systemDark)) root.classList.add("dark");
    };
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    checkSession();
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkSession = async () => {
    try {
      const localUser = localStorage.getItem("codiac_user");
      if (localUser) setUser(JSON.parse(localUser));
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(["ALL", ...data.categories.map(c => c.name)]);
      }
    } catch (e) { console.error("Failed to fetch categories:", e); }
  };

  const fetchPosts = async (cat = "") => {
    setLoading(true);
    try {
      const endpoint = cat && cat !== "ALL"
        ? `/api/blog?category=${encodeURIComponent(cat)}`
        : "/api/blog";
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
        setTimeout(() => {
          gsap.fromTo(
            ".story-card-item",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
          );
        }, 100);
      }
    } catch (e) { console.error("Fetch posts failed:", e); }
    finally { setLoading(false); }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    fetchPosts(cat);
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      setShowSuggestions(true);
      try {
        const res = await fetch(`/api/blog?suggestions=true&search=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (data.success) setSuggestions(data.suggestions || []);
      } catch (e) { console.error(e); }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim() === "") { setFilteredPosts(posts); return; }
    const matches = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(matches);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("codiac_user");
      setUser(null);
      router.refresh();
    } catch (e) { console.error(e); }
  };

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("codiac_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    setSubStatus("");
    try {
      const res = await fetch("/api/blog/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setSubStatus(data.message || "Confirmation link dispatched to inbox.");
      setEmail("");
    } catch (err) { setSubStatus(err.message); }
    finally { setSubLoading(false); }
  };

  const coverPost = posts.find(p => p.published);
  const gridPosts = filteredPosts.filter(p => p.published && p._id !== coverPost?._id);

  return (
    <LoadingWrapper text="TECH JOURNAL">
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] selection:bg-[#ADFF2F] selection:text-[#0a0a0a] relative overflow-hidden pb-20 transition-colors duration-300">

        {/* ── Masthead Header ── */}
        <header className="border-b border-[var(--border-primary)] bg-[var(--glass-bg)] sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <Link href="/" className="text-xl font-black text-[var(--text-primary)] tracking-tighter hover:opacity-85 transition-opacity" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            MUSA<span className="text-[var(--color-toxic-green)]">_</span>KANNIKE
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] border border-[var(--border-primary)] px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-full font-medium transition-colors">
                  {user.name}
                </span>
                {user.isAdmin && (
                  <Link href="/admin/dashboard"
                    className="text-xs bg-[var(--color-toxic-green)] hover:opacity-90 text-[var(--color-obsidian)] font-bold px-3 py-1.5 tracking-wide flex items-center gap-1.5 transition-all rounded-full">
                    <FaPlus size={10} /> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm py-1 transition-colors" title="Log Out">
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs border border-[var(--border-secondary)] hover:border-[var(--color-toxic-green)] hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] text-[var(--text-primary)] font-bold px-4 py-2 tracking-wide transition-all rounded-full"
              >
                <FaUser size={10} className="inline mr-2" />Sign In
              </button>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 mt-14 relative z-10">

          {/* ── Page Headline ── */}
          <div className="mb-10 pb-8 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-toxic-green)] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Engineering Journal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3 leading-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              The Tech Journal
            </h1>
            <p className="text-[var(--text-tertiary)] text-base max-w-xl leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              High-density writeups, architectural guides, and production logs on fullstack development, AI pipelines, and distributed engineering.
            </p>
          </div>

          {/* ── Filters + Search ── */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 transition-colors">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-[11px] px-4 py-1.5 font-bold tracking-widest transition-all duration-200 rounded-full ${
                    category === cat
                      ? "bg-[var(--color-toxic-green)] text-[var(--color-obsidian)] shadow-sm"
                      : "border border-[var(--border-secondary)] hover:border-[var(--color-toxic-green)] hover:text-[var(--color-toxic-green)] text-[var(--text-secondary)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Predictive Search */}
            <form onSubmit={handleSearchSubmit} ref={searchContainerRef} className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] pl-4 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-xl tracking-wide transition-colors duration-300"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              />
              <button type="submit" className="absolute right-3 top-3 text-[var(--text-tertiary)] hover:text-[var(--color-toxic-green)] transition-colors">
                <FaSearch size={13} />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-2xl z-50 rounded-xl max-h-60 overflow-y-auto transition-colors">
                  {suggestions.map((item) => (
                    <div key={item._id}
                      onClick={() => { router.push(`/blog/${item.slug}`); setShowSuggestions(false); }}
                      className="px-4 py-3 border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors"
                    >
                      <div className="text-sm text-[var(--text-primary)] font-semibold truncate">{item.title}</div>
                      <span className="text-[9px] text-[var(--color-toxic-green)] font-bold tracking-wider uppercase">{item.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* ── Loader ── */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[var(--text-tertiary)] tracking-widest">Loading articles…</p>
            </div>
          ) : (
            <>
              {/* ── Cover Story (Hero) ── */}
              {category === "ALL" && coverPost && searchQuery === "" && (
                <Link href={`/blog/${coverPost.slug}`} className="story-card-item block group mb-12 rounded-2xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)] hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Image col */}
                    <div className="md:col-span-7 relative h-64 md:h-[420px] overflow-hidden bg-[var(--bg-tertiary)]">
                      {coverPost.coverImage ? (
                        <>
                          <img
                            src={coverPost.coverImage}
                            alt={coverPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-[var(--text-tertiary)]">No Cover Image</div>
                      )}
                      {/* Cover badge */}
                      <div className="absolute top-4 left-4 bg-[var(--text-primary)] text-[var(--bg-primary)] px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-full">
                        ✦ COVER STORY
                      </div>
                    </div>

                    {/* Text col */}
                    <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 items-center text-[10px] text-[var(--text-tertiary)] mb-5">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">{coverPost.category}</span>
                          <span className="flex items-center gap-1"><FaClock size={9} /> {coverPost.readTime} min</span>
                          <span className="flex items-center gap-1"><FaEye size={9} /> {coverPost.views}</span>
                        </div>
                        <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-[var(--text-primary)] leading-tight tracking-tight group-hover:text-[var(--color-toxic-green)] transition-colors mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                          {coverPost.title}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-6" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                          {coverPost.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {coverPost.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full uppercase font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] group-hover:bg-[var(--color-toxic-green)] group-hover:text-[var(--color-obsidian)] font-bold py-3 px-6 text-sm tracking-wide transition-all rounded-xl w-full justify-center">
                        Read Article <FaArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Grid of stories ── */}
              {gridPosts.length > 0 ? (
                <div ref={postsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <article key={post._id} className="story-card-item rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)] hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">
                      {/* Card image */}
                      <div className="relative h-48 overflow-hidden bg-[var(--bg-tertiary)]">
                        {post.coverImage ? (
                          <>
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-tertiary)]">No Image</div>
                        )}
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-3 items-center text-[10px] text-[var(--text-tertiary)] mb-3">
                            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><FaClock size={8} /> {post.readTime}m</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><FaEye size={8} /> {post.views}</span>
                          </div>
                          <h3 className="text-[1.05rem] font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--color-toxic-green)] transition-colors mb-2.5 line-clamp-2" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                            {post.summary}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[9px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] px-2 py-0.5 rounded-full uppercase font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex w-full items-center justify-center gap-2 border border-[var(--border-primary)] group-hover:border-[var(--color-toxic-green)] group-hover:bg-[var(--color-toxic-green)] group-hover:text-[var(--color-obsidian)] text-[var(--text-primary)] font-semibold py-2.5 px-4 text-xs tracking-wide transition-all rounded-xl text-center"
                          >
                            Read Article <FaArrowRight size={9} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                coverPost && category !== "ALL" || gridPosts.length === 0 ? (
                  <div className="py-24 text-center border border-dashed border-[var(--border-primary)] rounded-2xl transition-colors">
                    <p className="text-sm text-[var(--text-tertiary)] mb-2">No matching articles found</p>
                    <p className="text-xs text-[var(--text-tertiary)] opacity-80">Try selecting a different filter or search term</p>
                  </div>
                ) : null
              )}
            </>
          )}

          {/* ── Newsletter Block ── */}
          <div className="mt-20 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 md:p-12 relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(21,128,61,0.05) 0%, transparent 60%)' }} />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-xs text-[var(--color-toxic-green)] font-bold tracking-widest uppercase mb-3">
                  <FaNewspaper /> Newsletter
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3 leading-tight transition-colors" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Get engineering insights in your inbox
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md transition-colors" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  High-density engineering breakdown logs, templates, checklists, and code repositories — delivered directly to your mailbox, spam-free.
                </p>
              </div>
              <div className="md:col-span-5 w-full">
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-xl tracking-wide transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      disabled={subLoading}
                      className="bg-[var(--color-toxic-green)] hover:opacity-90 text-[var(--color-obsidian)] font-bold px-6 py-3 text-sm tracking-wide transition-all rounded-xl whitespace-nowrap disabled:opacity-50"
                    >
                      {subLoading ? "Subscribing…" : "Subscribe"}
                    </button>
                  </div>
                  {subStatus && (
                    <div className="text-xs text-left text-[var(--text-secondary)] transition-colors">{subStatus}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-[var(--border-primary)] pt-8 pb-4 text-center transition-colors duration-300">
          <Link href="/" className="text-[var(--color-toxic-green)] hover:opacity-80 transition-opacity text-sm font-bold tracking-widest">
            ← Back to Portfolio
          </Link>
          <p className="text-[10px] text-[var(--text-tertiary)] mt-3">© {new Date().getFullYear()} Musa Musa Kannike</p>
        </footer>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </LoadingWrapper>
  );
};

export default BlogHub;
