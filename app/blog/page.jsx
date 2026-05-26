"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaUser, FaSignOutAlt, FaPlus, FaNewspaper, FaTags, FaClock, FaEye } from "react-icons/fa";
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
    if (isDark) {
      root.classList.remove("dark");
    }
    
    return () => {
      // Re-enable dark mode on exit if user's saved preference was dark
      const savedTheme = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && systemDark)) {
        root.classList.add("dark");
      }
    };
  }, []);

  // Fetch posts and check active user session
  useEffect(() => {
    fetchPosts();
    fetchCategories();
    checkSession();

    // Close suggestions dropdown on clicking outside
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
      // Decode auth_token cookie or do a simple session check
      const res = await fetch("/api/auth/google-login", { method: "GET" }).catch(() => null);
      // Wait, let's create a quick `/api/auth/me` or session check, or we can check user from localStorage!
      const localUser = localStorage.getItem("codiac_user");
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(["ALL", ...data.categories.map(c => c.name)]);
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
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
        
        // Simple GSAP fade-in of cards
        setTimeout(() => {
          gsap.fromTo(
            ".story-card-item",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
          );
        }, 100);
      }
    } catch (e) {
      console.error("Fetch posts failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    fetchPosts(cat);
  };

  // Search and Suggestions autocomplete
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 1) {
      setShowSuggestions(true);
      try {
        const res = await fetch(`/api/blog?suggestions=true&search=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    
    // Filter flat list client side or re-fetch with query
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
      return;
    }

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
    } catch (e) {
      console.error(e);
    }
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

      setSubStatus(`${data.message || "Confirmation link dispatched to inbox."}`);
      setEmail("");
    } catch (err) {
      setSubStatus(`${err.message}`);
    } finally {
      setSubLoading(false);
    }
  };

  // Find most recent post to render as large Cover Story
  const coverPost = posts.find(p => p.published);
  // Rest of the posts render in secondary list
  const gridPosts = filteredPosts.filter(p => p.published && p._id !== coverPost?._id);

  return (
    <LoadingWrapper text="TECH JOURNAL">
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] font-mono selection:bg-[#ADFF2F] selection:text-[#0a0a0a] relative overflow-hidden pb-12 transition-colors duration-300">
        
        {/* Cyberpunk Scanlines */}
        <div className="absolute inset-0 bg-scanline opacity-[0.01] dark:opacity-[0.03] pointer-events-none z-40" />

        {/* Global Masthead Header */}
        <header className="border-b border-[var(--border-primary)] bg-[var(--glass-bg)] sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <Link href="/" className="text-xl font-black text-[var(--text-primary)] tracking-tighter hover:opacity-85 transition-opacity">
            MUSA<span className="text-[var(--color-toxic-green)]">_</span>KANNIKE
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] border border-[var(--border-primary)] px-3 py-1.5 bg-[var(--bg-tertiary)] uppercase transition-colors">
                  [ {user.name} ]
                </span>
                {user.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="text-xs bg-[var(--color-toxic-green)] hover:bg-[var(--text-primary)] text-[var(--color-obsidian)] font-bold px-3 py-1.5 tracking-wider flex items-center gap-1.5 transition-colors uppercase rounded-none"
                  >
                    <FaPlus size={10} /> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm py-1 transition-colors"
                  title="Log Out"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs border border-[var(--border-secondary)] hover:border-[var(--color-toxic-green)] text-[var(--text-primary)] hover:text-[var(--color-toxic-green)] font-bold px-4 py-2 tracking-wider transition-colors uppercase rounded-none"
              >
                <FaUser size={10} className="inline mr-2" /> Connect
              </button>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 mt-12 relative z-10">
          
          {/* Headline Description */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tighter mb-4 transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              The Tech Journal
            </h1>
            <p className="text-[var(--text-tertiary)] text-sm max-w-xl leading-relaxed transition-colors">
              High-density writeups, architectural guides, and production logs on fullstack development, AI pipelines, and distributed engineering.
            </p>
          </div>

          {/* Search bar & Category hubs stack */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-b border-[var(--border-primary)] pb-8 transition-colors">
            
            {/* Category hub */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs px-4 py-2 font-bold tracking-widest transition-colors rounded-none ${
                    category === cat
                      ? "bg-[var(--color-toxic-green)] text-[var(--color-obsidian)] border border-[var(--color-toxic-green)]"
                      : "border border-[var(--border-primary)] hover:border-[var(--text-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Predictive Search autocomplete container */}
            <form 
              onSubmit={handleSearchSubmit} 
              ref={searchContainerRef} 
              className="relative w-full md:max-w-xs"
            >
              <input
                type="text"
                placeholder="SEARCH JOURNAL..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] pl-4 pr-10 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none tracking-wide transition-colors duration-300"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-3 text-[var(--text-tertiary)] hover:text-[var(--color-toxic-green)] transition-colors"
              >
                <FaSearch size={12} />
              </button>

              {/* Suggestions dropdown dropdown list */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-2xl z-50 rounded-none max-h-60 overflow-y-auto transition-colors">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push(`/blog/${item.slug}`);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors"
                    >
                      <div className="text-xs text-[var(--text-primary)] font-bold truncate tracking-tight">
                        {item.title}
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[9px] bg-[var(--bg-tertiary)] text-[var(--color-toxic-green)] px-1.5 py-0.5 tracking-wider uppercase font-bold transition-colors">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-4" />
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest transition-colors">Loading entries...</p>
            </div>
          ) : (
            <>
              {/* Cover Pinned Post (Hero Card) */}
              {category === "ALL" && coverPost && searchQuery === "" && (
                <div className="story-card-item border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)] transition-all duration-300 mb-12 group overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-7 relative h-64 md:h-96 overflow-hidden bg-[var(--bg-tertiary)] border-b md:border-b-0 md:border-r border-[var(--border-primary)] transition-colors">
                      {coverPost.coverImage ? (
                        <img
                          src={coverPost.coverImage}
                          alt={coverPost.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-tertiary)] uppercase transition-colors">
                          No Cover Image Attached
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-[var(--text-primary)] text-[var(--bg-primary)] px-3 py-1 font-bold text-[10px] tracking-widest uppercase transition-colors">
                        COVER STORY
                      </div>
                    </div>
                    
                    <div className="md:col-span-5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-3 items-center text-[10px] text-[var(--text-tertiary)] mb-4 uppercase transition-colors">
                          <span className="text-[var(--color-toxic-green)] font-bold">{coverPost.category}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><FaClock size={8} /> {coverPost.readTime} min read</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><FaEye size={8} /> {coverPost.views}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight group-hover:text-[var(--color-toxic-green)] transition-colors mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          <Link href={`/blog/${coverPost.slug}`}>
                            {coverPost.title}
                          </Link>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-6 transition-colors">
                          {coverPost.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {coverPost.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 uppercase transition-colors">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={`/blog/${coverPost.slug}`}
                        className="inline-flex items-center justify-center w-full md:w-auto text-center border border-[var(--text-primary)] text-[var(--text-primary)] font-bold py-3 px-6 text-xs uppercase hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors rounded-none tracking-widest"
                      >
                        READ JOURNAL
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of secondary stories */}
              {gridPosts.length > 0 ? (
                <div ref={postsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <article
                      key={post._id}
                      className="story-card-item border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)] transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-48 overflow-hidden bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)] transition-colors">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-tertiary)] uppercase transition-colors">
                            No Cover Image
                          </div>
                        )}
                        <span className="absolute bottom-3 left-3 bg-[var(--bg-secondary)] text-[var(--color-toxic-green)] border border-[var(--border-primary)] px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase transition-colors">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-3 items-center text-[9px] text-[var(--text-tertiary)] mb-3 uppercase transition-colors">
                            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-0.5"><FaClock size={8} /> {post.readTime}m read</span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--color-toxic-green)] transition-colors mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed mb-4 line-clamp-3 transition-colors">
                            {post.summary}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[8px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] px-2 py-0.5 uppercase transition-colors">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex w-full items-center justify-center border border-[var(--border-primary)] group-hover:border-[var(--text-primary)] text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] font-bold py-2 px-4 text-xs tracking-wider transition-all uppercase rounded-none text-center"
                          >
                            READ ARTICLE
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                coverPost && category !== "ALL" || gridPosts.length === 0 ? (
                  <div className="py-24 text-center border border-dashed border-[var(--border-primary)] transition-colors">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest mb-2 transition-colors">No matching articles found</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] opacity-80 uppercase transition-colors">Try selecting a different filter or search term</p>
                  </div>
                ) : null
              )}
            </>
          )}

          {/* Inline Newsletter Block (Audiences Retainer) */}
          <div className="mt-20 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 md:p-12 relative overflow-hidden text-center md:text-left transition-colors duration-300">
            <div className="absolute inset-0 bg-scanline opacity-[0.01] dark:opacity-[0.02] pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-xs text-[var(--color-toxic-green)] font-bold tracking-widest uppercase mb-3">
                  <FaNewspaper /> NEWSLETTER LIST
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-3 transition-colors">
                  Subscribed for Distributed Architecture Writeups?
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md transition-colors">
                  Get high-density engineering breakdown logs directly in your mailbox, verified spam-free. Receive templates, checklists, and code repositories.
                </p>
              </div>

              <div className="md:col-span-5 w-full">
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="ENTER YOUR EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none tracking-wide font-mono transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      disabled={subLoading}
                      className="bg-[var(--text-primary)] hover:bg-[var(--color-toxic-green)] text-[var(--bg-primary)] hover:text-[var(--color-obsidian)] font-extrabold px-6 py-3 text-xs tracking-wider uppercase transition-all rounded-none whitespace-nowrap disabled:opacity-50"
                    >
                      {subLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
                    </button>
                  </div>
                  {subStatus && (
                    <div className="text-[10px] text-left text-[var(--text-secondary)] font-mono tracking-tighter transition-colors">
                      {subStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Global Footer link to show home */}
        <footer className="mt-20 border-t border-[var(--border-primary)] pt-8 text-center text-xs text-[var(--text-tertiary)] uppercase transition-colors duration-300">
          <Link href="/" className="text-[var(--color-toxic-green)] hover:underline tracking-widest font-bold">
            BACK TO PORTFOLIO
          </Link>
        </footer>

        {/* Auth modal toggle */}
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
