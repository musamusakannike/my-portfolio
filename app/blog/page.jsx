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

  const categories = ["ALL", "FRONTEND", "BACKEND", "AI SYSTEMS", "SYSTEM DESIGN"];

  // Fetch posts and check active user session
  useEffect(() => {
    fetchPosts();
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

      setSubStatus(`[SYS_LOG]: ${data.message || "Confirmation link dispatched to inbox."}`);
      setEmail("");
    } catch (err) {
      setSubStatus(`[ERROR]: ${err.message}`);
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
      <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-mono selection:bg-[#ADFF2F] selection:text-[#0a0a0a] relative overflow-hidden pb-12">
        
        {/* Cyberpunk Scanlines */}
        <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none z-40" />

        {/* Global Masthead Header */}
        <header className="border-b border-white/10 bg-[#050505] sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-white tracking-tighter hover:opacity-85 transition-opacity">
            MUSA<span className="text-[var(--color-toxic-green)]">_</span>KANNIKE
          </Link>

          <span className="text-xs text-neutral-500 hidden md:inline uppercase tracking-widest animate-pulse">
            // sys_status: index_loaded
          </span>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 border border-white/10 px-3 py-1.5 bg-neutral-900/60 uppercase">
                  [ {user.name} ]
                </span>
                {user.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="text-xs bg-[#ADFF2F] hover:bg-white text-black font-bold px-3 py-1.5 tracking-wider flex items-center gap-1.5 transition-colors uppercase rounded-none"
                  >
                    <FaPlus size={10} /> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-white text-sm py-1"
                  title="Log Out"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs border border-white/20 hover:border-[var(--color-toxic-green)] text-white hover:text-[var(--color-toxic-green)] font-bold px-4 py-2 tracking-wider transition-colors uppercase rounded-none"
              >
                <FaUser size={10} className="inline mr-2" /> Connect
              </button>
            )}
          </div>
        </header>

        {/* Stark Magazine-Style Masthead Band */}
        <div className="bg-white text-black py-3 text-center tracking-[0.25em] font-extrabold text-sm uppercase relative z-10 select-none">
          CODIAC // TECHNOLOGY JOURNAL // CORE ENGINEERING
        </div>

        <main className="max-w-6xl mx-auto px-6 mt-12 relative z-10">
          
          {/* Headline Description */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              The Tech Journal
            </h1>
            <p className="text-neutral-500 text-sm max-w-xl leading-relaxed uppercase">
              High-density writeups, architectural guides, and production logs on fullstack development, AI pipelines, and distributed engineering.
            </p>
          </div>

          {/* Search bar & Category hubs stack */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-b border-white/10 pb-8">
            
            {/* Category hub */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs px-4 py-2 font-bold tracking-widest transition-colors rounded-none ${
                    category === cat
                      ? "bg-[#ADFF2F] text-black border border-[#ADFF2F]"
                      : "border border-white/10 hover:border-white text-neutral-400 hover:text-white"
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
                className="w-full bg-neutral-900/60 border border-white/10 pl-4 pr-10 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none tracking-wide"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-3 text-neutral-500 hover:text-[#ADFF2F] transition-colors"
              >
                <FaSearch size={12} />
              </button>

              {/* Suggestions dropdown dropdown list */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 border border-white/10 bg-[#0E0E0E] shadow-2xl z-50 rounded-none max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push(`/blog/${item.slug}`);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 border-b border-white/5 hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <div className="text-xs text-white font-bold truncate tracking-tight">
                        {item.title}
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[9px] bg-neutral-800 text-[var(--color-toxic-green)] px-1.5 py-0.5 tracking-wider uppercase font-bold">
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
              <div className="inline-block w-8 h-8 border-2 border-neutral-800 border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-4" />
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Loading entries...</p>
            </div>
          ) : (
            <>
              {/* Cover Pinned Post (Hero Card) */}
              {category === "ALL" && coverPost && searchQuery === "" && (
                <div className="story-card-item border border-white/10 bg-[#070707] hover:border-white/20 transition-all duration-300 mb-12 group overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-7 relative h-64 md:h-96 overflow-hidden bg-neutral-900 border-b md:border-b-0 md:border-r border-white/10">
                      {coverPost.coverImage ? (
                        <img
                          src={coverPost.coverImage}
                          alt={coverPost.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase">
                          No Cover Image Attached
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                        COVER STORY
                      </div>
                    </div>
                    
                    <div className="md:col-span-5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-3 items-center text-[10px] text-neutral-500 mb-4 uppercase">
                          <span className="text-[#ADFF2F] font-bold">{coverPost.category}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><FaClock size={8} /> {coverPost.readTime} min read</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><FaEye size={8} /> {coverPost.views}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight uppercase group-hover:text-[#ADFF2F] transition-colors mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          <Link href={`/blog/${coverPost.slug}`}>
                            {coverPost.title}
                          </Link>
                        </h2>
                        <p className="text-neutral-400 text-xs leading-relaxed mb-6 uppercase">
                          {coverPost.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {coverPost.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] border border-white/10 bg-neutral-900 text-neutral-500 px-2 py-0.5 uppercase">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={`/blog/${coverPost.slug}`}
                        className="inline-flex items-center justify-center w-full md:w-auto text-center border border-white text-white font-bold py-3 px-6 text-xs uppercase hover:bg-white hover:text-black transition-colors rounded-none tracking-widest"
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
                      className="story-card-item border border-white/10 bg-[#070707] hover:border-white/20 transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-48 overflow-hidden bg-neutral-900 border-b border-white/10">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase">
                            No Cover Image
                          </div>
                        )}
                        <span className="absolute bottom-3 left-3 bg-black text-[#ADFF2F] border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-3 items-center text-[9px] text-neutral-500 mb-3 uppercase">
                            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-0.5"><FaClock size={8} /> {post.readTime}m read</span>
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#ADFF2F] transition-colors mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-neutral-400 text-[11px] leading-relaxed mb-4 line-clamp-3 uppercase">
                            {post.summary}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[8px] bg-neutral-950 text-neutral-500 border border-white/5 px-2 py-0.5 uppercase">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex w-full items-center justify-center border border-white/10 group-hover:border-white text-white group-hover:bg-white group-hover:text-black font-bold py-2 px-4 text-xs tracking-wider transition-all uppercase rounded-none text-center"
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
                  <div className="py-24 text-center border border-dashed border-white/10">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">[LOG]: No matching articles found</p>
                    <p className="text-[10px] text-neutral-600 uppercase">Try selecting a different filter or search term</p>
                  </div>
                ) : null
              )}
            </>
          )}

          {/* Inline Newsletter Block (Audiences Retainer) */}
          <div className="mt-20 border border-white/10 bg-[#050505] p-8 md:p-12 relative overflow-hidden text-center md:text-left">
            <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-xs text-[var(--color-toxic-green)] font-bold tracking-widest uppercase mb-3">
                  <FaNewspaper /> NEWSLETTER LIST
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-3">
                  Subscribed for Distributed Architecture Writeups?
                </h3>
                <p className="text-xs text-neutral-400 uppercase leading-relaxed max-w-md">
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
                      className="w-full bg-black border border-white/10 px-4 py-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none tracking-wide font-mono"
                    />
                    <button
                      type="submit"
                      disabled={subLoading}
                      className="bg-white hover:bg-[#ADFF2F] text-black font-extrabold px-6 py-3 text-xs tracking-wider uppercase transition-all rounded-none whitespace-nowrap disabled:opacity-50"
                    >
                      {subLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
                    </button>
                  </div>
                  {subStatus && (
                    <div className="text-[10px] text-left text-neutral-400 font-mono tracking-tighter">
                      {subStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Global Footer link to show home */}
        <footer className="mt-20 border-t border-white/5 pt-8 text-center text-xs text-neutral-600 uppercase">
          <p className="mb-2">SYSTEM ENGINEERING: Musa Musa Kannike. MIT LICENSE.</p>
          <Link href="/" className="text-[var(--color-toxic-green)] hover:underline tracking-widest font-bold">
            [ BACK TO PORTFOLIO ]
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
