"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaClock, FaEye, FaArrowLeft, FaSun, FaMoon, FaShareAlt, FaTwitter, FaLinkedin, FaEnvelope, FaFileDownload, FaCommentDots, FaPaperPlane, FaUser } from "react-icons/fa";
import AuthModal from "@/components/ui/AuthModal";
import LoadingWrapper from "@/components/ui/LoadingWrapper";

const ArticleReader = () => {
  const { slug } = useParams();
  const router = useRouter();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark"); // "dark" or "light" (hybrid stark journal mode)
  const [fontSize, setFontSize] = useState("md"); // "sm", "md", "lg" for accessibility
  
  // Highlight to Share state
  const [shareCoords, setShareCoords] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const articleContentRef = useRef(null);

  // Table of Contents state
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [replyToName, setReplyToName] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentMsg, setCommentMsg] = useState("");

  // Infinite Scroll / Next Post state
  const [nextPost, setNextPost] = useState(null);
  const [hasScrolledToNext, setHasScrolledToNext] = useState(false);
  const nextSentinelRef = useRef(null);

  // Inline newsletter state
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg] = useState("");

  // Fetch article data
  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
    checkSession();
  }, [slug]);

  const checkSession = () => {
    const localUser = localStorage.getItem("codiac_user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  };

  const fetchArticle = async (articleSlug) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?slug=${articleSlug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        parseHeadings(data.post.content);
        fetchComments(data.post._id);
        fetchNextPost(data.post._id, data.post.category);
      } else {
        router.push("/blog");
      }
    } catch (e) {
      console.error(e);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`/api/blog/comments?postId=${postId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNextPost = async (excludeId, category) => {
    try {
      // Find a related post in the same category
      const res = await fetch(`/api/blog?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      if (data.success) {
        const related = data.posts.find(p => p.published && p._id !== excludeId);
        // Fallback to any post if no match in same category
        if (related) {
          setNextPost(related);
        } else {
          const fallbackRes = await fetch("/api/blog");
          const fallbackData = await fallbackRes.json();
          const fallbackPost = fallbackData.posts.find(p => p.published && p._id !== excludeId);
          setNextPost(fallbackPost || null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Parse H2 and H3 from markdown for Table of Contents
  const parseHeadings = (markdown) => {
    if (!markdown) return;
    const lines = markdown.split("\n");
    const foundHeadings = [];
    
    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      
      if (h2Match) {
        const title = h2Match[1].replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        foundHeadings.push({ title, id, level: 2 });
      } else if (h3Match) {
        const title = h3Match[1].replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        foundHeadings.push({ title, id, level: 3 });
      }
    });
    setHeadings(foundHeadings);
  };

  // Intersection Observer for Table of Contents highlighting
  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings, post]);

  // Infinite scroll next-article loading sentinel trigger
  useEffect(() => {
    if (!nextPost || hasScrolledToNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasScrolledToNext(true);
          // Transition to next article: change URL, title and fetch new post content
          router.push(`/blog/${nextPost.slug}`, { scroll: true });
        }
      },
      { threshold: 0.1 }
    );

    if (nextSentinelRef.current) {
      observer.observe(nextSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [nextPost, hasScrolledToNext]);

  // Selection change listener for Highlight to Share tooltips
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (!text || !articleContentRef.current || !articleContentRef.current.contains(selection.anchorNode)) {
        setShareCoords(null);
        setSelectedText("");
        return;
      }

      const range = selection.getRangeAt(0);
      const rects = range.getBoundingClientRect();
      
      if (rects.width > 0) {
        setShareCoords({
          top: rects.top + window.scrollY - 44, // 44px above selection
          left: rects.left + window.scrollX + rects.width / 2,
        });
        setSelectedText(text);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleShareClick = (platform) => {
    if (!selectedText) return;
    const url = window.location.href;
    const shareText = `"${selectedText}" — Read more on Musa's Tech Journal:`;
    
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    } else if (platform === "email") {
      shareUrl = `mailto:?subject=Interesting engineering insight&body=${encodeURIComponent(shareText + "\n\n" + url)}`;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    window.getSelection().removeAllRanges();
    setShareCoords(null);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setCommentLoading(true);
    setCommentMsg("");

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          userName: user.name,
          userEmail: user.email,
          content: commentContent,
          parentId: replyToId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      setCommentMsg(`[SYS_LOG]: ${data.message}`);
      setCommentContent("");
      setReplyToId(null);
      setReplyToName("");
      
      // Re-fetch comments to display if auto-approved
      fetchComments(post._id);
    } catch (err) {
      setCommentMsg(`[ERROR]: ${err.message}`);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleInlineNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubLoading(true);
    setSubMsg("");

    try {
      const res = await fetch("/api/blog/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setSubMsg(`[SYS]: ${data.message || "Confirmation link dispatched."}`);
      setSubEmail("");
    } catch (err) {
      setSubMsg(`[ERROR]: ${err.message}`);
    } finally {
      setSubLoading(false);
    }
  };

  // Markdown structural elements custom renderer
  const renderMarkdownContent = (markdown) => {
    if (!markdown) return null;

    const blocks = markdown.split("\n\n");
    const renderedBlocks = [];

    // Custom Paragraph/Header/List block parser
    blocks.forEach((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      // 1. Headers H2/H3
      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace("## ", "").replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        renderedBlocks.push(
          <h2
            key={index}
            id={id}
            className={`font-black uppercase tracking-tight mt-10 mb-4 transition-colors ${
              theme === "light" ? "text-black font-serif" : "text-[#ADFF2F] font-mono text-xl"
            }`}
            style={{ 
              fontFamily: theme === "light" ? "'Playfair Display', Georgia, serif" : "var(--font-mono)",
              fontSize: theme === "light" ? "26px" : "18px"
            }}
          >
            {title}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "").replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        renderedBlocks.push(
          <h3
            key={index}
            id={id}
            className={`font-bold mt-8 mb-3 transition-colors ${
              theme === "light" ? "text-black font-serif" : "text-white font-mono text-base"
            }`}
            style={{ 
              fontFamily: theme === "light" ? "'Playfair Display', Georgia, serif" : "var(--font-mono)",
              fontSize: theme === "light" ? "20px" : "15px"
            }}
          >
            {title}
          </h3>
        );
        return;
      }

      // 2. Code blocks ```
      if (trimmed.startsWith("```")) {
        const lines = trimmed.split("\n");
        const lang = lines[0].replace("```", "") || "javascript";
        const code = lines.slice(1, -1).join("\n");
        renderedBlocks.push(
          <pre key={index} className="bg-black/95 text-neutral-300 border border-white/10 p-5 overflow-x-auto rounded-none font-mono text-xs my-6 leading-relaxed select-all">
            <div className="flex justify-between text-[9px] text-neutral-500 uppercase border-b border-white/5 pb-2 mb-3">
              <span>{lang}</span>
              <span>[COPY_CODE]</span>
            </div>
            <code>{code}</code>
          </pre>
        );
        return;
      }

      // 3. Bullet list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(li => li.substring(2).replace(/[\*\_]/g, ""));
        renderedBlocks.push(
          <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-xs leading-relaxed uppercase tracking-wide">
            {items.map((it, idx) => <li key={idx}>{it}</li>)}
          </ul>
        );
        return;
      }

      // 4. Blockquotes
      if (trimmed.startsWith("> ")) {
        const quote = trimmed.substring(2).replace(/[\*\_]/g, "");
        renderedBlocks.push(
          <blockquote key={index} className="border-l-2 border-[#ADFF2F] pl-4 italic text-neutral-400 my-6">
            <p className="text-xs uppercase leading-relaxed tracking-wider">"{quote}"</p>
          </blockquote>
        );
        return;
      }

      // 5. Standard paragraph
      // Simple parse bold markdown **text**
      const renderedText = trimmed.split("**").map((chunk, cIdx) => {
        if (cIdx % 2 === 1) return <strong key={cIdx} className={theme === "light" ? "text-black" : "text-[#ADFF2F]"}>{chunk}</strong>;
        return chunk;
      });

      renderedBlocks.push(
        <p
          key={index}
          className={`text-xs uppercase tracking-wider leading-relaxed mb-6 transition-colors ${
            theme === "light" ? "text-neutral-700 font-serif leading-8" : "text-neutral-300 font-mono"
          }`}
          style={{
            fontFamily: theme === "light" ? "'Lora', serif" : "var(--font-sans)",
            fontSize: fontSize === "sm" ? "11px" : fontSize === "lg" ? "14px" : "12px",
            textTransform: theme === "light" ? "none" : "uppercase", // Light mode utilizes normal sentence casing for reader comfort!
          }}
        >
          {renderedText}
        </p>
      );
    });

    // Injected newsletter form exactly halfway down the paragraph index count
    const middleIndex = Math.floor(renderedBlocks.length / 2);
    if (renderedBlocks.length > 2) {
      renderedBlocks.splice(
        middleIndex,
        0,
        <div key="inline-newsletter" className="my-10 border border-white/10 bg-neutral-900/60 p-6 rounded-none text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">// INLINE_NEWSLETTER_ALERT</h4>
          <p className="text-[10px] text-neutral-400 uppercase max-w-sm mx-auto mb-4">Enjoying Musa's logs? Submit your email to receive deep technical checklists directly in your inbox.</p>
          <form onSubmit={handleInlineNewsletterSubmit} className="max-w-xs mx-auto flex gap-2">
            <input
              type="email"
              placeholder="ENTER_EMAIL"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              required
              className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] text-white focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
            />
            <button
              type="submit"
              disabled={subLoading}
              className="bg-white hover:bg-[#ADFF2F] text-black font-extrabold px-4 py-2 text-[10px] tracking-wider uppercase transition-all rounded-none"
            >
              {subLoading ? "..." : "SUBSCRIBE"}
            </button>
          </form>
          {subMsg && <div className="text-[9px] text-neutral-500 mt-2 font-mono uppercase">{subMsg}</div>}
        </div>
      );
    }

    return renderedBlocks;
  };

  // Render recursive comments tree
  const renderCommentTree = (commentsList, depth = 0) => {
    return commentsList.map((c) => (
      <div key={c._id} className="border-l border-white/10 pl-4 mt-6 relative" style={{ marginLeft: depth > 0 ? "16px" : "0" }}>
        
        <div className="absolute left-0 top-3 w-3 h-px bg-white/10" />
        
        <div className="flex gap-3 items-center text-[10px] text-neutral-500 mb-2 uppercase">
          <span className="text-white font-bold">{c.userName}</span>
          <span>&bull;</span>
          <span>{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        
        <p className="text-neutral-300 text-xs uppercase tracking-wide leading-relaxed font-mono pl-1 border-l border-[var(--color-toxic-green)]/20 mb-3">
          {c.content}
        </p>

        {/* Reply toggle */}
        <button
          onClick={() => {
            setReplyToId(c._id);
            setReplyToName(c.userName);
            // Scroll to comment form
            document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-[9px] text-[#ADFF2F] hover:underline uppercase font-bold"
        >
          [ REPLY_TO ]
        </button>

        {/* Child comments */}
        {c.replies && c.replies.length > 0 && (
          <div className="space-y-4">
            {renderCommentTree(c.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <LoadingWrapper text="JOURNAL_READER">
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center font-mono">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-neutral-800 border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-4" />
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Parsing Article...</p>
          </div>
        </div>
      </LoadingWrapper>
    );
  }

  if (!post) return null;

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 relative ${
      theme === "light" ? "bg-[#FFFFFF] text-black" : "bg-[#0A0A0A] text-neutral-200"
    }`}>
      
      {/* Cyberpunk Scanlines (only in dark mode) */}
      {theme === "dark" && <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none z-40" />}

      {/* Floating Highlight to Share tooltip */}
      {shareCoords && (
        <div
          style={{
            position: "absolute",
            top: `${shareCoords.top}px`,
            left: `${shareCoords.left}px`,
            transform: "translateX(-50%)",
          }}
          className="z-50 flex items-center gap-2 border border-white/20 bg-black p-2 shadow-2xl rounded-none animate-flicker"
        >
          <span className="text-[9px] font-bold text-neutral-400 px-1 border-r border-white/10 uppercase">SHARE:</span>
          <button onClick={() => handleShareClick("twitter")} className="text-neutral-400 hover:text-[#ADFF2F] transition-colors p-1" title="X (Twitter)">
            <FaTwitter size={11} />
          </button>
          <button onClick={() => handleShareClick("linkedin")} className="text-neutral-400 hover:text-[#ADFF2F] transition-colors p-1" title="LinkedIn">
            <FaLinkedin size={11} />
          </button>
          <button onClick={() => handleShareClick("email")} className="text-neutral-400 hover:text-[#ADFF2F] transition-colors p-1" title="Email">
            <FaEnvelope size={11} />
          </button>
        </div>
      )}

      {/* Dynamic Header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors ${
        theme === "light" ? "bg-white/90 border-neutral-200 text-black" : "bg-[#050505]/90 border-white/10 text-white"
      }`}>
        <Link href="/blog" className="text-xs font-bold tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity uppercase">
          <FaArrowLeft /> Back to Journal
        </Link>
        
        <span className="text-[10px] text-neutral-500 hidden md:inline uppercase tracking-widest">
          CODIAC // TECH_JOURNAL // VOL.{new Date(post.createdAt).getFullYear()}
        </span>

        {/* Header toolbar Controls */}
        <div className="flex items-center gap-3">
          {/* Legibility text size adjustment */}
          <div className="flex border border-neutral-700/30 text-[9px] font-bold rounded-none overflow-hidden">
            <button onClick={() => setFontSize("sm")} className={`px-2 py-1 ${fontSize === "sm" ? "bg-neutral-800 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"}`}>A-</button>
            <button onClick={() => setFontSize("md")} className={`px-2 py-1 ${fontSize === "md" ? "bg-neutral-800 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"}`}>A</button>
            <button onClick={() => setFontSize("lg")} className={`px-2 py-1 ${fontSize === "lg" ? "bg-neutral-800 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"}`}>A+</button>
          </div>
          
          {/* Theme toggler */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border border-neutral-700/30 hover:border-neutral-400 p-2 transition-colors rounded-none"
            title="Toggle Legibility Theme"
          >
            {theme === "dark" ? <FaSun size={12} className="text-yellow-500" /> : <FaMoon size={12} />}
          </button>
        </div>
      </header>

      {/* Cover Image Header */}
      <div className="w-full h-64 md:h-96 relative bg-neutral-950 border-b border-white/10 overflow-hidden select-none">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover grayscale opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 uppercase">
            No Cover Image Included
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Cover metadata */}
        <div className="absolute bottom-6 left-6 right-6 max-w-4xl mx-auto px-6">
          <span className="bg-[#ADFF2F] text-black font-extrabold px-3 py-1 text-[9px] tracking-widest uppercase">
            {post.category}
          </span>
          <h1 className="text-xl md:text-3xl font-extrabold text-white uppercase tracking-tight mt-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sticky Left Sidebar (Table of Contents + Controls) */}
          <aside className="lg:col-span-3 hidden lg:block select-none">
            <div className="sticky top-28 space-y-8 max-h-[80vh] overflow-y-auto pr-4">
              
              {/* Reading time details */}
              <div className="border border-neutral-700/20 p-4 bg-neutral-900/10 rounded-none font-mono">
                <div className="flex gap-2 items-center text-[10px] text-neutral-500 uppercase mb-2">
                  <FaClock /> ESTIMATED_READ
                </div>
                <div className="text-xl font-bold tracking-tight text-white uppercase">
                  {post.readTime} MIN READ
                </div>
              </div>

              {/* Table of contents */}
              {headings.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-700/20 pb-2 mb-4">
                    // TABLE_OF_CONTENTS
                  </h4>
                  <ul className="space-y-3 text-[10px] font-bold tracking-widest">
                    {headings.map((h) => (
                      <li key={h.id} style={{ paddingLeft: h.level === 3 ? "12px" : "0" }}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`hover:text-[#ADFF2F] transition-colors block uppercase ${
                            activeId === h.id ? "text-[#ADFF2F] border-l-2 border-[#ADFF2F] pl-2" : "text-neutral-500"
                          }`}
                        >
                          {h.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share actions */}
              <div>
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-700/20 pb-2 mb-4">
                  // SHARE_JOURNAL
                </h4>
                <div className="flex gap-3">
                  <button onClick={() => handleShareClick("twitter")} className="border border-neutral-700/20 hover:border-neutral-400 p-2 text-xs transition-colors text-neutral-400 hover:text-white rounded-none">
                    <FaTwitter />
                  </button>
                  <button onClick={() => handleShareClick("linkedin")} className="border border-neutral-700/20 hover:border-neutral-400 p-2 text-xs transition-colors text-neutral-400 hover:text-white rounded-none">
                    <FaLinkedin />
                  </button>
                  <button onClick={() => handleShareClick("email")} className="border border-neutral-700/20 hover:border-neutral-400 p-2 text-xs transition-colors text-neutral-400 hover:text-white rounded-none">
                    <FaEnvelope />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Core Article text reader */}
          <main className="lg:col-span-6">
            
            {/* Author Byline line */}
            <div className="flex items-center justify-between border-b border-neutral-700/20 pb-4 mb-8 text-[10px] text-neutral-500 uppercase select-none">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#ADFF2F] text-black font-extrabold flex items-center justify-center rounded-full text-[8px]">MK</div>
                <div>
                  <span className="text-white font-bold block">{post.author?.name || "Musa Musa Kannike"}</span>
                  <span>SYSTEM_DEVELOPER</span>
                </div>
              </div>
              <div>
                <span className="block text-right">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><FaEye /> {post.views} VIEWS</span>
              </div>
            </div>

            {/* Custom rendered paragraphs */}
            <article ref={articleContentRef} className="prose max-w-none">
              {renderMarkdownContent(post.content)}
            </article>

            {/* Content Upgrade download bundle card */}
            {post.contentUpgrade && post.contentUpgrade.title && (
              <div className="mt-12 border-2 border-dashed border-[#ADFF2F]/40 bg-neutral-900/10 p-6 rounded-none relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-scanline opacity-[0.01] pointer-events-none" />
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <span className="bg-[#ADFF2F] text-black font-extrabold px-2 py-0.5 text-[8px] tracking-widest uppercase">
                      CONTENT_UPGRADE
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-2 mb-1">{post.contentUpgrade.title}</h4>
                    <p className="text-[10px] text-neutral-400 uppercase max-w-md leading-relaxed">{post.contentUpgrade.description}</p>
                  </div>
                  <a
                    href={post.contentUpgrade.fileUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 border border-white text-white font-bold py-2.5 px-4 text-xs tracking-wider uppercase hover:bg-[#ADFF2F] hover:text-black hover:border-[#ADFF2F] transition-all rounded-none w-full sm:w-auto"
                  >
                    <FaFileDownload /> DOWNLOAD_PDF
                  </a>
                </div>
              </div>
            )}

            {/* Public Interactive Comments / Discussions Section */}
            <section className="mt-16 border-t border-neutral-700/20 pt-12">
              <div className="flex gap-2 items-center text-xs font-bold text-white uppercase tracking-widest mb-6">
                <FaCommentDots className="text-[var(--color-toxic-green)]" /> DISCUSSION_THREAD ({comments.length})
              </div>

              {/* Error/Success Alerts */}
              {commentMsg && (
                <div className="mb-6 border border-white/10 bg-neutral-900/60 p-3 text-[10px] text-neutral-400 font-mono">
                  {commentMsg}
                </div>
              )}

              {/* Comment submission form */}
              <form id="comment-form" onSubmit={handleCommentSubmit} className="space-y-4">
                
                {replyToId && (
                  <div className="flex justify-between items-center bg-neutral-900 border-l-2 border-[#ADFF2F] px-3 py-2 text-[10px] text-neutral-400 uppercase select-none">
                    <span>REPLYING_TO: {replyToName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyToId(null);
                        setReplyToName("");
                      }}
                      className="text-[#ADFF2F] hover:underline"
                    >
                      [ CANCEL ]
                    </button>
                  </div>
                )}

                {!user && (
                  <div className="border border-dashed border-white/10 p-4 text-center rounded-none select-none">
                    <p className="text-[10px] text-neutral-500 uppercase mb-3">You must be logged in to participate in the discussions.</p>
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="text-xs bg-white text-black font-extrabold px-4 py-2 uppercase tracking-wider rounded-none hover:bg-[#ADFF2F] transition-colors"
                    >
                      Connect Account
                    </button>
                  </div>
                )}

                {user && (
                  <div className="space-y-3">
                    <div className="text-[9px] text-neutral-500 uppercase select-none">
                      COMMENTING_AS: <span className="text-white font-bold">{user.name} ({user.email})</span>
                    </div>
                    <textarea
                      placeholder="ENTER_YOUR_COMMENT_HERE..."
                      rows={4}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="flex items-center justify-center gap-2 bg-[#ADFF2F] text-black font-extrabold px-6 py-3 text-xs tracking-wider uppercase transition-colors hover:bg-white rounded-none disabled:opacity-50"
                    >
                      <FaPaperPlane size={10} /> {commentLoading ? "PUBLISHING..." : "SUBMIT_COMMENT"}
                    </button>
                  </div>
                )}
              </form>

              {/* Nested Comments Display */}
              <div className="mt-8 space-y-6">
                {comments.length > 0 ? (
                  renderCommentTree(comments)
                ) : (
                  <div className="py-8 text-center border border-white/5 text-[10px] text-neutral-500 uppercase select-none">
                    No comments in this thread yet. Be the first to start the discussion!
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Right side next-article suggestions (optional/desktop) */}
          <aside className="lg:col-span-3 hidden lg:block select-none">
            {nextPost && (
              <div className="sticky top-28 border border-white/10 bg-[#070707] p-6 rounded-none max-h-[85vh] overflow-y-auto">
                <span className="bg-white text-black font-extrabold px-2 py-0.5 text-[8px] tracking-widest uppercase">
                  UP_NEXT
                </span>
                <h4 className="text-xs font-bold text-white uppercase mt-4 mb-2 tracking-tight line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <Link href={`/blog/${nextPost.slug}`}>{nextPost.title}</Link>
                </h4>
                <p className="text-[10px] text-neutral-400 uppercase leading-relaxed line-clamp-3 mb-4">
                  {nextPost.summary}
                </p>
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="inline-block text-[9px] text-[#ADFF2F] font-bold hover:underline tracking-widest uppercase"
                >
                  [ LOAD_POST_NOW ]
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Infinite scroll load sentinel */}
      {nextPost && (
        <div ref={nextSentinelRef} className="py-20 border-t border-white/5 text-center bg-black/40 select-none">
          <div className="inline-block w-6 h-6 border border-neutral-700 border-t-[#ADFF2F] rounded-full animate-spin mb-3" />
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Keep scrolling to load the next article</p>
          <p className="text-xs text-white font-bold mt-2 uppercase">{nextPost.title}</p>
        </div>
      )}

      {/* Auth modal toggle */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => {
          localStorage.setItem("codiac_user", JSON.stringify(userData));
          setUser(userData);
        }}
      />
    </div>
  );
};

export default ArticleReader;
