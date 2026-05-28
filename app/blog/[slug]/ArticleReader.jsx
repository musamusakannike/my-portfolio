"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import parse, { Element } from "html-react-parser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaClock, FaEye, FaArrowLeft, FaTwitter, FaLinkedin, FaEnvelope, FaFileDownload, FaCommentDots, FaPaperPlane, FaCopy, FaCheck } from "react-icons/fa";
import AuthModal from "@/components/ui/AuthModal";
import LoadingWrapper from "@/components/ui/LoadingWrapper";

/* ─── HTML content renderer with syntax-highlighted code blocks ────────────── */
const HtmlCodeBlock = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const normalizedLang = (lang || 'text').toLowerCase()
    .replace(/^js$/, 'javascript')
    .replace(/^ts$/, 'typescript')
    .replace(/^sh$|^bash$|^shell$/, 'bash')
    .replace(/^py$/, 'python');

  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl" style={{ background: '#1e1e2e' }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ background: '#181825', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: '#cba6f7' }}>{normalizedLang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider transition-all duration-200 px-3 py-1 rounded border"
          style={copied ? { color: '#a6e3a1', borderColor: '#a6e3a1' } : { color: '#6c7086', borderColor: '#313244' }}
        >
          {copied ? <FaCheck size={9} /> : <FaCopy size={9} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <SyntaxHighlighter
        language={normalizedLang}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1.25em 1.4em', background: '#1e1e2e', borderRadius: 0, fontSize: '13.5px', lineHeight: '1.7', overflowX: 'auto' }}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '13.5px' } }}
        showLineNumbers={code.split('\n').length > 5}
        lineNumberStyle={{ color: '#4a4a5a', fontSize: '11px', minWidth: '2.5em', paddingRight: '1em', userSelect: 'none' }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const SafeHtmlRenderer = ({ html }) => {
  const options = {
    replace(domNode) {
      if (domNode instanceof Element && domNode.name === 'pre') {
        const codeNode = domNode.children?.find(c => c instanceof Element && c.name === 'code');
        if (!codeNode) return;
        const langClass = codeNode.attribs?.class || '';
        const langMatch = langClass.match(/language-([\w-]+)/);
        const lang = langMatch ? langMatch[1] : 'text';
        const rawCode = codeNode.children
          ?.map(c => (c.type === 'text' ? c.data : c.children?.map(cc => cc.data).join('') || ''))
          .join('') || '';
        const code = rawCode.replace(/\n$/, '');
        return <HtmlCodeBlock key={lang + code.slice(0, 20)} lang={lang} code={code} />;
      }
    },
  };

  return (
    <div className="html-article prose-like">
      {parse(html, options)}
    </div>
  );
};

const isHtml = (content) => {
  if (!content) return false;
  const trimmed = content.trim();
  return /^<!doctype|^<html|^<div|^<p|^<h[1-6]|^<ul|^<ol|^<section|^<article|^<main|^<figure|^<table/i.test(trimmed) || trimmed.includes('</html>');
};

const ArticleReader = ({ slug }) => {
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = "light";
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

  // ─── Inline text parser: handles **bold**, *italic*, `code`, [links](url) ─────
  const parseInline = (text) => {
    const parts = [];
    // Regex: captures **bold**, *italic*, `code`, [text](url)
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      if (match[1] !== undefined) parts.push(<strong key={match.index} className="font-bold text-[var(--text-primary)]">{match[1]}</strong>);
      else if (match[2] !== undefined) parts.push(<em key={match.index} className="italic">{match[2]}</em>);
      else if (match[3] !== undefined) parts.push(<code key={match.index} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[0.85em] px-1.5 py-0.5 rounded font-mono">{match[3]}</code>);
      else if (match[4] !== undefined) parts.push(<a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-[var(--color-toxic-green)] underline underline-offset-2 hover:opacity-80 transition-opacity">{match[4]}</a>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  // ─── Code Block Component with Syntax Highlighting ──────────────────────────
  const CodeBlock = ({ lang, code, blockKey }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    // Normalise language identifier for react-syntax-highlighter
    const normalizedLang = (lang || 'text').toLowerCase()
      .replace(/^js$/, 'javascript')
      .replace(/^ts$/, 'typescript')
      .replace(/^jsx$/, 'jsx')
      .replace(/^tsx$/, 'tsx')
      .replace(/^sh$|^bash$|^shell$/, 'bash')
      .replace(/^py$/, 'python');

    return (
      <div key={blockKey} className="my-8 rounded-xl overflow-hidden shadow-2xl" style={{ background: '#1e1e2e' }}>
        {/* Code block header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ background: '#181825', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: '#cba6f7' }}>{lang || 'code'}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider transition-all duration-200 px-3 py-1 rounded border"
            style={copied ? { color: '#a6e3a1', borderColor: '#a6e3a1' } : { color: '#6c7086', borderColor: '#313244' }}
          >
            {copied ? <FaCheck size={9} /> : <FaCopy size={9} />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
        {/* Syntax-highlighted code content */}
        <SyntaxHighlighter
          language={normalizedLang}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.25em 1.4em',
            background: '#1e1e2e',
            borderRadius: 0,
            fontSize: '13.5px',
            lineHeight: '1.7',
            overflowX: 'auto',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '13.5px',
            },
          }}
          showLineNumbers={code.split('\n').length > 5}
          lineNumberStyle={{
            color: '#4a4a5a',
            fontSize: '11px',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none',
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  // ─── Markdown structural elements custom renderer ─────────────────────────────
  const renderMarkdownContent = (markdown) => {
    if (!markdown) return null;

    const fontSizePx = fontSize === "sm" ? "15px" : fontSize === "lg" ? "19px" : "17px";

    // Split markdown into segments: fenced code blocks are kept whole,
    // everything else is split on double newlines.
    const segments = [];
    const fenceRegex = /(```[\s\S]*?```)/g;
    let lastIdx = 0;
    let match;
    while ((match = fenceRegex.exec(markdown)) !== null) {
      if (match.index > lastIdx) {
        // Text before this code block — split on double newlines
        markdown.slice(lastIdx, match.index).split("\n\n").forEach(b => {
          if (b.trim()) segments.push(b);
        });
      }
      segments.push(match[1]);
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < markdown.length) {
      markdown.slice(lastIdx).split("\n\n").forEach(b => {
        if (b.trim()) segments.push(b);
      });
    }

    const renderedBlocks = [];

    segments.forEach((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      // H1
      if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
        const title = trimmed.replace(/^# /, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        renderedBlocks.push(
          <h1 key={index} id={id} className="font-bold text-[var(--text-primary)] mt-12 mb-5 leading-tight tracking-tight"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "2rem", borderBottom: '2px solid var(--border-primary)', paddingBottom: '0.4em' }}>
            {parseInline(title)}
          </h1>
        );
        return;
      }

      // H2
      if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
        const title = trimmed.replace(/^## /, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        renderedBlocks.push(
          <h2 key={index} id={id} className="font-bold text-[var(--text-primary)] mt-10 mb-4 leading-snug tracking-tight"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "1.55rem", borderBottom: '1.5px solid var(--border-primary)', paddingBottom: '0.3em' }}>
            {parseInline(title)}
          </h2>
        );
        return;
      }

      // H3
      if (trimmed.startsWith("### ") && !trimmed.startsWith("#### ")) {
        const title = trimmed.replace(/^### /, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        renderedBlocks.push(
          <h3 key={index} id={id} className="font-semibold text-[var(--text-primary)] mt-8 mb-3 leading-snug"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "1.2rem" }}>
            {parseInline(title)}
          </h3>
        );
        return;
      }

      // H4
      if (trimmed.startsWith("#### ")) {
        const title = trimmed.replace(/^#### /, "");
        renderedBlocks.push(
          <h4 key={index} className="font-semibold text-[var(--text-secondary)] mt-6 mb-2 text-base uppercase tracking-wide"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {parseInline(title)}
          </h4>
        );
        return;
      }

      // Fenced code blocks ```lang ... ```
      if (trimmed.startsWith("```")) {
        const lines = trimmed.split("\n");
        const lang = lines[0].replace(/^```/, "").trim() || "text";
        const code = lines.slice(1).join("\n").replace(/```\s*$/, "").trimEnd();
        renderedBlocks.push(<CodeBlock key={index} blockKey={index} lang={lang} code={code} />);
        return;
      }

      // Horizontal rule
      if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
        renderedBlocks.push(<hr key={index} className="my-10 border-t-2 border-[var(--border-primary)]" />);
        return;
      }

      // Ordered list (1. item)
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split("\n").filter(Boolean).map(li => li.replace(/^\d+\.\s+/, ""));
        renderedBlocks.push(
          <ol key={index} className="list-decimal pl-7 my-5 space-y-2" style={{ fontSize: fontSizePx, lineHeight: '1.8', fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-secondary)' }}>
            {items.map((it, idx) => <li key={idx} className="pl-1">{parseInline(it)}</li>)}
          </ol>
        );
        return;
      }

      // Unordered list
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").filter(l => /^[-*]\s/.test(l)).map(li => li.replace(/^[-*]\s+/, ""));
        renderedBlocks.push(
          <ul key={index} className="pl-7 my-5 space-y-2" style={{ fontSize: fontSizePx, lineHeight: '1.8', fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--text-secondary)', listStyleType: 'disc' }}>
            {items.map((it, idx) => <li key={idx} className="pl-1" style={{ markerColor: 'var(--color-toxic-green)' }}>{parseInline(it)}</li>)}
          </ul>
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        const quote = trimmed.replace(/^>\s?/gm, "");
        renderedBlocks.push(
          <blockquote key={index} className="my-8 pl-5 py-1 relative" style={{ borderLeft: '4px solid var(--color-toxic-green)', background: 'rgba(21,128,61,0.05)', borderRadius: '0 8px 8px 0' }}>
            <p className="italic text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: fontSizePx }}>
              {parseInline(quote)}
            </p>
          </blockquote>
        );
        return;
      }

      // Standard paragraph
      renderedBlocks.push(
        <p
          key={index}
          className="mb-6 text-[var(--text-secondary)] leading-relaxed"
          style={{
            fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif",
            fontSize: fontSizePx,
            lineHeight: '1.85',
            color: 'var(--text-secondary)',
          }}
        >
          {parseInline(trimmed)}
        </p>
      );
    });

    // Injected newsletter form exactly halfway down the paragraph index count
    const middleIndex = Math.floor(renderedBlocks.length / 2);
    if (renderedBlocks.length > 2) {
      renderedBlocks.splice(
        middleIndex,
        0,
        <div key="inline-newsletter" className="my-10 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 rounded-xl text-center relative overflow-hidden transition-colors duration-300">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(21,128,61,0.04) 0%, transparent 60%)' }} />
          <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest mb-2 transition-colors">📬 Stay in the Loop</h4>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto mb-5 transition-colors leading-relaxed">Enjoying Musa's engineering logs? Get deep technical checklists and insights delivered straight to your inbox.</p>
          <form onSubmit={handleInlineNewsletterSubmit} className="max-w-xs mx-auto flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              required
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-lg font-sans transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={subLoading}
              className="bg-[var(--color-toxic-green)] hover:opacity-90 text-white font-bold px-5 py-2.5 text-sm tracking-wide uppercase transition-all rounded-lg"
              style={{ color: 'var(--color-obsidian)' }}
            >
              {subLoading ? "..." : "Subscribe"}
            </button>
          </form>
          {subMsg && <div className="text-xs text-[var(--text-tertiary)] mt-3 font-mono transition-colors">{subMsg}</div>}
        </div>
      );
    }

    return renderedBlocks;
  };

  // Render recursive comments tree
  const renderCommentTree = (commentsList, depth = 0) => {
    return commentsList.map((c) => (
      <div key={c._id} className="border-l border-[var(--border-primary)] pl-4 mt-6 relative transition-colors" style={{ marginLeft: depth > 0 ? "16px" : "0" }}>

        <div className="absolute left-0 top-3 w-3 h-px bg-[var(--border-primary)] transition-colors" />

        <div className="flex gap-3 items-center text-[10px] text-[var(--text-tertiary)] mb-2 uppercase transition-colors">
          <span className="text-[var(--text-primary)] font-bold transition-colors">{c.userName}</span>
          <span>&bull;</span>
          <span>{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        <p className="text-[var(--text-secondary)] text-xs tracking-wide leading-relaxed font-mono pl-1 border-l border-[var(--color-toxic-green)]/20 mb-3 transition-colors">
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
          className="text-[9px] text-[var(--color-toxic-green)] hover:underline uppercase font-bold"
        >
          [ REPLY TO ]
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
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-mono transition-colors">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-[var(--border-secondary)] border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-4" />
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest transition-colors">Parsing Article...</p>
          </div>
        </div>
      </LoadingWrapper>
    );
  }

  if (!post) return null;

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 relative ${theme === "light" ? "bg-[var(--bg-primary)] text-[var(--text-primary)]" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
      }`}>

      {/* Cyberpunk Scanlines (only in dark mode) */}
      {theme === "dark" && <div className="absolute inset-0 bg-scanline opacity-[0.01] dark:opacity-[0.03] pointer-events-none z-40" />}

      {/* Floating Highlight to Share tooltip */}
      {shareCoords && (
        <div
          style={{
            position: "absolute",
            top: `${shareCoords.top}px`,
            left: `${shareCoords.left}px`,
            transform: "translateX(-50%)",
          }}
          className="z-50 flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 shadow-2xl rounded-none animate-flicker"
        >
          <span className="text-[9px] font-bold text-[var(--text-secondary)] px-1 border-r border-[var(--border-primary)] uppercase">SHARE:</span>
          <button onClick={() => handleShareClick("twitter")} className="text-[var(--text-secondary)] hover:text-[var(--color-toxic-green)] transition-colors p-1" title="X (Twitter)">
            <FaTwitter size={11} />
          </button>
          <button onClick={() => handleShareClick("linkedin")} className="text-[var(--text-secondary)] hover:text-[var(--color-toxic-green)] transition-colors p-1" title="LinkedIn">
            <FaLinkedin size={11} />
          </button>
          <button onClick={() => handleShareClick("email")} className="text-[var(--text-secondary)] hover:text-[var(--color-toxic-green)] transition-colors p-1" title="Email">
            <FaEnvelope size={11} />
          </button>
        </div>
      )}

      {/* Dynamic Header */}
      <header className="border-b border-[var(--border-primary)] bg-[var(--glass-bg)] sticky top-0 z-40 backdrop-blur-md px-6 py-3.5 flex items-center justify-between transition-colors duration-300">
        <Link href="/blog" className="text-sm font-bold tracking-wide flex items-center gap-2 hover:text-[var(--color-toxic-green)] transition-colors text-[var(--text-primary)]">
          <FaArrowLeft size={12} /> Back to Journal
        </Link>
        {/* Font size controls */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-[var(--border-secondary)] overflow-hidden text-[10px] font-bold">
            <button onClick={() => setFontSize("sm")} className={`px-3 py-1.5 transition-colors ${fontSize === "sm" ? "bg-[var(--text-primary)] text-[var(--bg-primary)]" : "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"}`}>A−</button>
            <button onClick={() => setFontSize("md")} className={`px-3 py-1.5 border-x border-[var(--border-secondary)] transition-colors ${fontSize === "md" ? "bg-[var(--text-primary)] text-[var(--bg-primary)]" : "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"}`}>A</button>
            <button onClick={() => setFontSize("lg")} className={`px-3 py-1.5 transition-colors ${fontSize === "lg" ? "bg-[var(--text-primary)] text-[var(--bg-primary)]" : "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"}`}>A+</button>
          </div>
        </div>
      </header>

      {/* ── Cover Image Hero ── */}
      <div className="w-full h-72 md:h-[500px] relative bg-[var(--bg-tertiary)] overflow-hidden select-none transition-colors duration-300">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center">
            <span className="text-sm text-[var(--text-tertiary)]">No cover image</span>
          </div>
        )}
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        {/* Cover metadata */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-4xl">
          <span className="inline-block bg-[var(--color-toxic-green)] text-[var(--color-obsidian)] font-extrabold px-3 py-1 text-[9px] tracking-widest uppercase rounded-full mb-4 transition-colors">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sticky Left Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block select-none">
            <div className="sticky top-24 space-y-6 max-h-[80vh] overflow-y-auto pr-2">

              {/* Reading time */}
              <div className="rounded-2xl border border-[var(--border-primary)] p-5 bg-[var(--bg-secondary)] shadow-sm transition-colors">
                <div className="flex gap-2 items-center text-[10px] text-[var(--text-tertiary)] uppercase font-bold mb-2 tracking-wider transition-colors">
                  <FaClock /> Estimated Read
                </div>
                <div className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] transition-colors">
                  {post.readTime} <span className="text-sm font-medium text-[var(--text-tertiary)]">min</span>
                </div>
              </div>

              {/* Table of contents */}
              {headings.length > 0 && (
                <div className="rounded-2xl border border-[var(--border-primary)] p-5 bg-[var(--bg-secondary)] shadow-sm transition-colors">
                  <h4 className="text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-widest border-b border-[var(--border-primary)] pb-2 mb-4 transition-colors">
                    Table of Contents
                  </h4>
                  <ul className="space-y-2 text-[11px] font-medium tracking-wide">
                    {headings.map((h) => (
                      <li key={h.id} style={{ paddingLeft: h.level === 3 ? "10px" : "0" }}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`hover:text-[var(--color-toxic-green)] transition-colors block truncate ${
                            activeId === h.id
                              ? "text-[var(--color-toxic-green)] font-bold border-l-2 border-[var(--color-toxic-green)] pl-2"
                              : "text-[var(--text-tertiary)]"
                          }`}
                        >
                          {h.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share buttons */}
              <div className="rounded-2xl border border-[var(--border-primary)] p-5 bg-[var(--bg-secondary)] shadow-sm transition-colors">
                <h4 className="text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-widest border-b border-[var(--border-primary)] pb-2 mb-4 transition-colors">
                  Share Article
                </h4>
                <div className="flex gap-2">
                  <button onClick={() => handleShareClick("twitter")} className="flex-1 border border-[var(--border-primary)] hover:border-sky-400 hover:text-sky-500 p-2.5 text-xs transition-colors text-[var(--text-secondary)] rounded-xl">
                    <FaTwitter className="mx-auto" />
                  </button>
                  <button onClick={() => handleShareClick("linkedin")} className="flex-1 border border-[var(--border-primary)] hover:border-blue-600 hover:text-blue-600 p-2.5 text-xs transition-colors text-[var(--text-secondary)] rounded-xl">
                    <FaLinkedin className="mx-auto" />
                  </button>
                  <button onClick={() => handleShareClick("email")} className="flex-1 border border-[var(--border-primary)] hover:border-[var(--color-toxic-green)] hover:text-[var(--color-toxic-green)] p-2.5 text-xs transition-colors text-[var(--text-secondary)] rounded-xl">
                    <FaEnvelope className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Core Article text reader */}
          <main className="lg:col-span-6">

            {/* Author Byline */}
            <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-5 mb-8 select-none transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-extrabold flex items-center justify-center rounded-full text-xs shadow-md transition-colors">MK</div>
                <div>
                  <span className="text-sm text-[var(--text-primary)] font-semibold block transition-colors" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{post.author?.name || "Musa Musa Kannike"}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Fullstack Engineer</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-[var(--text-tertiary)]">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] justify-end mt-0.5"><FaEye size={9} /> {post.views} views</span>
              </div>
            </div>

            {/* Custom rendered paragraphs */}
            <article ref={articleContentRef} className="blog-article max-w-none">
              {isHtml(post.content) ? (
                <SafeHtmlRenderer html={post.content} />
              ) : (
                renderMarkdownContent(post.content)
              )}
            </article>

            {/* Content Upgrade download bundle card */}
            {post.contentUpgrade && post.contentUpgrade.title && (
              <div className="mt-12 border-2 border-dashed border-[var(--color-toxic-green)]/40 bg-[var(--bg-tertiary)] p-6 rounded-none relative overflow-hidden select-none transition-colors duration-300">
                <div className="absolute inset-0 bg-scanline opacity-[0.01] pointer-events-none" />
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <span className="bg-[var(--color-toxic-green)] text-[var(--color-obsidian)] font-extrabold px-2 py-0.5 text-[8px] tracking-widest uppercase transition-colors">
                      CONTENT UPGRADE
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mt-2 mb-1 transition-colors">{post.contentUpgrade.title}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] max-w-md leading-relaxed transition-colors">{post.contentUpgrade.description}</p>
                  </div>
                  <a
                    href={post.contentUpgrade.fileUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 border border-[var(--text-primary)] text-[var(--text-primary)] font-bold py-2.5 px-4 text-xs tracking-wider uppercase hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] hover:border-[var(--color-toxic-green)] transition-all rounded-none w-full sm:w-auto"
                  >
                    <FaFileDownload /> DOWNLOAD PDF
                  </a>
                </div>
              </div>
            )}

            {/* Comments section */}
            <section className="mt-16 border-t border-[var(--border-primary)] pt-10 transition-colors">
              <div className="flex gap-2 items-center text-base font-bold text-[var(--text-primary)] mb-6 transition-colors" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <FaCommentDots className="text-[var(--color-toxic-green)]" size={16} />
                Discussion <span className="text-sm font-normal text-[var(--text-tertiary)]">{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Error/Success Alerts */}
              {commentMsg && (
                <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-[10px] text-[var(--text-secondary)] font-mono transition-colors">
                  {commentMsg}
                </div>
              )}

              {/* Comment submission form */}
              <form id="comment-form" onSubmit={handleCommentSubmit} className="space-y-4">

                {replyToId && (
                  <div className="flex justify-between items-center bg-[var(--bg-tertiary)] border-l-2 border-[var(--color-toxic-green)] px-3 py-2 text-[10px] text-[var(--text-secondary)] uppercase select-none transition-colors duration-300">
                    <span>REPLYING TO: {replyToName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyToId(null);
                        setReplyToName("");
                      }}
                      className="text-[var(--color-toxic-green)] hover:underline"
                    >
                      [ CANCEL ]
                    </button>
                  </div>
                )}

                {!user && (
                  <div className="border border-dashed border-[var(--border-primary)] p-4 text-center rounded-none select-none transition-colors">
                    <p className="text-[10px] text-[var(--text-tertiary)] mb-3 transition-colors">You must be logged in to participate in the discussions.</p>
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="text-xs bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold px-4 py-2 uppercase tracking-wider rounded-none hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-colors duration-300"
                    >
                      Connect Account
                    </button>
                  </div>
                )}

                {user && (
                  <div className="space-y-3">
                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase select-none transition-colors">
                      COMMENTING AS: <span className="text-[var(--text-primary)] font-bold transition-colors">{user.name} ({user.email})</span>
                    </div>
                    <textarea
                      placeholder="ENTER YOUR COMMENT HERE..."
                      rows={4}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="flex items-center justify-center gap-2 bg-[var(--color-toxic-green)] text-[var(--color-obsidian)] font-extrabold px-6 py-3 text-xs tracking-wider uppercase transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] rounded-none disabled:opacity-50"
                    >
                      <FaPaperPlane size={10} /> {commentLoading ? "PUBLISHING..." : "SUBMIT COMMENT"}
                    </button>
                  </div>
                )}
              </form>

              {/* Nested Comments Display */}
              <div className="mt-8 space-y-5">
                {comments.length > 0 ? (
                  renderCommentTree(comments)
                ) : (
                  <div className="py-10 text-center rounded-2xl border border-dashed border-[var(--border-primary)] text-sm text-[var(--text-tertiary)] select-none transition-colors">
                    No comments yet — be the first to start the discussion!
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Right sidebar — Up Next */}
          <aside className="lg:col-span-3 hidden lg:block select-none">
            {nextPost && (
              <div className="sticky top-24 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm transition-colors duration-300">
                {nextPost.coverImage && (
                  <div className="h-36 overflow-hidden">
                    <img src={nextPost.coverImage} alt={nextPost.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <span className="inline-block bg-[var(--text-primary)] text-[var(--bg-primary)] px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full mb-3 transition-colors">
                    Up Next
                  </span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 tracking-tight line-clamp-2 transition-colors leading-snug" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    <Link href={`/blog/${nextPost.slug}`}>{nextPost.title}</Link>
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4 transition-colors">
                    {nextPost.summary}
                  </p>
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-toxic-green)] font-bold hover:underline tracking-wide"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Next article scroll sentinel */}
      {nextPost && (
        <div ref={nextSentinelRef} className="py-16 border-t border-[var(--border-primary)] text-center bg-gradient-to-b from-transparent to-[var(--bg-secondary)] select-none transition-colors">
          <div className="inline-block w-5 h-5 border-2 border-[var(--border-secondary)] border-t-[var(--color-toxic-green)] rounded-full animate-spin mb-3" />
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Next up</p>
          <p className="text-sm text-[var(--text-primary)] font-bold" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{nextPost.title}</p>
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
