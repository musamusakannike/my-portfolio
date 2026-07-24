"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPen, FaFolder, FaComments, FaUsers, FaEnvelope, FaUpload, FaTrash, FaCheck, FaTimes, FaGlobe, FaFileAlt, FaBold, FaItalic, FaHeading, FaListUl, FaListOl, FaQuoteLeft, FaCode, FaLink, FaImage, FaEye, FaExpand, FaSun, FaMoon, FaTags } from "react-icons/fa";
import LoadingWrapper from "@/components/ui/LoadingWrapper";
import TerminalWindow from "@/components/ui/TerminalWindow";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useTheme } from "@/components/ThemeProvider";
import SiteContentManager from "@/components/admin/SiteContentManager";
import ProjectsManager from "@/components/admin/ProjectsManager";

const SafeHtmlRenderer = ({ html }) => {
  const iframeRef = useRef(null);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
      
      const doc = iframe.contentWindow.document;
      const observer = new MutationObserver(() => {
        iframe.style.height = doc.documentElement.scrollHeight + 'px';
      });
      observer.observe(doc.body, { subtree: true, childList: true, attributes: true });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      onLoad={handleLoad}
      className="w-full border-none overflow-hidden"
      sandbox="allow-popups allow-scripts allow-same-origin"
      style={{ minHeight: '350px', height: 'auto' }}
    />
  );
};

const isHtml = (content) => {
  if (!content) return false;
  const trimmed = content.trim().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html") || trimmed.startsWith("<div") || trimmed.startsWith("<body") || trimmed.includes("</html>");
};

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("MANAGE_POSTS");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Post composer state
  const [postId, setPostId] = useState(""); // empty for new, filled for edit
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("SYSTEM DESIGN");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [upgradeTitle, setUpgradeTitle] = useState("");
  const [upgradeDesc, setUpgradeDesc] = useState("");
  const [upgradeUrl, setUpgradeUrl] = useState("");
  
  const [composerStatus, setComposerStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  // Premium Editor Layout States
  const [editorMode, setEditorMode] = useState("split"); // "split" | "write" | "preview"
  const [previewTheme, setPreviewTheme] = useState("dark"); // "dark" | "light"
  const [previewFontSize, setPreviewFontSize] = useState("md"); // "sm" | "md" | "lg"

  // Dynamic categories state
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const selectedText = currentText.substring(start, end);
    const newText =
      currentText.substring(0, start) +
      prefix +
      (selectedText || "text") +
      suffix +
      currentText.substring(end);

    setContent(newText);

    // Reset cursor position after state updates
    setTimeout(() => {
      textarea.focus();
      const selectionStart = start + prefix.length;
      const selectionEnd = selectionStart + (selectedText ? selectedText.length : 4);
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }, 50);
  };

  const parseInline = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="inline-block max-w-full h-auto grayscale hover:grayscale-0 transition-all duration-300 my-2" />');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[var(--text-primary)]">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-[var(--bg-secondary)] border border-[var(--border-primary)]/50 px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-toxic-green)] rounded-none">$1</code>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--color-toxic-green)] hover:underline font-bold transition-colors">$1</a>');
    return html;
  };

  const parseMarkdownToHtml = (markdown, pTheme) => {
    if (!markdown) return "";
    const blocks = markdown.split(/\n\n+/);
    return blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      if (trimmed.startsWith("```")) {
        const lines = trimmed.split("\n");
        const lang = lines[0].replace("```", "") || "javascript";
        let code = lines.slice(1);
        if (code[code.length - 1] === "```") {
          code = code.slice(0, -1);
        } else {
          code = code.map(line => line === "```" ? "" : line);
        }
        const joinedCode = code.join("\n");
        return `
          <pre class="bg-black/95 text-neutral-300 border border-white/10 p-5 overflow-x-auto rounded-none font-mono text-xs my-6 leading-relaxed select-all relative group">
            <div class="flex justify-between text-[9px] text-neutral-500 uppercase border-b border-white/5 pb-2 mb-3 select-none">
              <span>${lang}</span>
              <span class="cursor-pointer hover:text-white" onclick="navigator.clipboard.writeText(\`${joinedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('[SYS]: Code copied to clipboard');">[COPY_CODE]</span>
            </div>
            <code>${joinedCode}</code>
          </pre>
        `;
      }
      
      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace("## ", "").replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        const isLight = pTheme === "light";
        const hClass = isLight ? "text-black font-serif text-2xl font-black mt-10 mb-4 transition-colors" : "text-[#ADFF2F] font-mono text-xl font-black mt-10 mb-4 transition-colors";
        const hStyle = isLight ? "font-family: 'Playfair Display', Georgia, serif; font-size: 26px;" : "font-family: var(--font-mono); font-size: 18px;";
        return `<h2 id="${id}" class="${hClass}" style="${hStyle}">${parseInline(title)}</h2>`;
      }
      
      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "").replace(/[\*\_]/g, "");
        const id = title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        const isLight = pTheme === "light";
        const hClass = isLight ? "text-black font-serif text-xl font-bold mt-8 mb-3 transition-colors" : "text-white font-mono text-base font-bold mt-8 mb-3 transition-colors";
        const hStyle = isLight ? "font-family: 'Playfair Display', Georgia, serif; font-size: 20px;" : "font-family: var(--font-mono); font-size: 15px;";
        return `<h3 id="${id}" class="${hClass}" style="${hStyle}">${parseInline(title)}</h3>`;
      }
      
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const lines = trimmed.split("\n");
        const listItems = lines.map(line => {
          const content = line.substring(2);
          return `<li class="mb-1">${parseInline(content)}</li>`;
        }).join("");
        return `<ul class="list-disc pl-6 my-4 space-y-1 text-xs leading-relaxed tracking-wide">${listItems}</ul>`;
      }
      
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split("\n");
        const listItems = lines.map(line => {
          const match = line.match(/^\d+\.\s(.*)$/);
          const content = match ? match[1] : line;
          return `<li class="mb-1">${parseInline(content)}</li>`;
        }).join("");
        return `<ol class="list-decimal pl-6 my-4 space-y-1 text-xs leading-relaxed tracking-wide">${listItems}</ol>`;
      }
      
      if (trimmed.startsWith("> ")) {
        const quoteLines = trimmed.split("\n").map(l => l.substring(2)).join("<br />");
        return `
          <blockquote class="border-l-2 border-[#ADFF2F] pl-4 italic text-neutral-400 my-6">
            <p class="text-xs leading-relaxed tracking-wider">"${parseInline(quoteLines)}"</p>
          </blockquote>
        `;
      }
      
      if (trimmed.startsWith("![") && trimmed.endsWith(")")) {
        const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (match) {
          return `
            <div class="my-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 p-2 text-center">
              <img src="${match[2]}" alt="${match[1]}" class="max-w-full h-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300" />
              <span class="text-[9px] text-[var(--text-tertiary)] uppercase mt-2 block tracking-widest">// ${match[1]}</span>
            </div>
          `;
        }
      }
      
      const isLight = pTheme === "light";
      const pClass = isLight ? "text-xs tracking-wider leading-relaxed mb-6 text-neutral-700 font-serif leading-8" : "text-xs tracking-wider leading-relaxed mb-6 text-neutral-300 font-mono";
      const pStyle = isLight ? "font-family: 'Lora', serif; font-size: 12px;" : "font-family: var(--font-sans); font-size: 12px;";
      return `<p class="${pClass}" style="${pStyle}">${parseInline(trimmed)}</p>`;
    }).join("");
  };

  // System items lists
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Newsletter compiler state
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = async () => {
    setLoading(true);
    try {
      const localUser = localStorage.getItem("codiac_user");
      if (localUser) {
        const u = JSON.parse(localUser);
        if (u.isAdmin) {
          setAdminUser(u);
          fetchAdminData();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCategoryStatus("");
    if (!newCategoryName.trim()) return;

    setCategoryLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      setCategoryStatus(`[SUCCESS]: Category '${data.category.name}' created successfully.`);
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      setCategoryStatus(`[ERROR]: ${err.message}`);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? Any post using this category will still retain the string value, but it will be removed from future selection options.")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch dynamic categories
      await fetchCategories();

      // 1. Fetch posts
      const postsRes = await fetch("/api/admin/posts");
      const postsData = await postsRes.json();
      if (postsData.success) setPosts(postsData.posts || []);

      // 2. Fetch flat comments for moderation
      const commRes = await fetch("/api/blog/comments?admin=true");
      const commData = await commRes.json();
      if (commData.success) setComments(commData.comments || []);

      // 3. Fetch subscribers
      const subRes = await fetch("/api/admin/newsletter").catch(() => null);
      if (subRes) {
        const subData = await subRes.json();
        // Wait, if /api/admin/newsletter is POST, let's create a quick subscribers listing on it or just mock subscribers list!
        // We will create the subscribers model and fetch flat list of subscribers if needed
        // Let's implement a GET handle on /api/admin/newsletter to fetch subscribers or write fallback
        if (subData.success) setSubscribers(subData.subscribers || []);
      }
      
      // Fallback subscriber list fetch just in case:
      // We will make sure /api/admin/newsletter route.js accepts GET to return subscribers!
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Image Upload handler for R2 S3
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setComposerStatus("[UPLOAD]: Transmitting file stream to R2 storage...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "File upload failed");

      setCoverImage(data.url);
      setComposerStatus("[SUCCESS]: Image written to Cloudflare R2 bucket.");
    } catch (err) {
      setComposerStatus(`[ERROR]: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Create or Update Post Form handler
  const handleComposerSubmit = async (e) => {
    e.preventDefault();
    setComposerStatus("");

    if (!title || !slug || !content || !summary || !coverImage) {
      setComposerStatus("[ERROR]: Please fill in all required post metadata fields.");
      return;
    }

    try {
      const tags = tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      
      const payload = {
        title,
        slug,
        summary,
        content,
        category,
        tags,
        coverImage,
        published,
        contentUpgrade: {
          title: upgradeTitle,
          description: upgradeDesc,
          fileUrl: upgradeUrl
        }
      };

      let res, data;
      if (postId) {
        // Edit existing
        payload.id = postId;
        res = await fetch("/api/admin/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save journal post");

      setComposerStatus(`[SUCCESS]: Article saved successfully. Pushed to MongoDB.`);
      resetComposerForm();
      fetchAdminData();
      setActiveTab("MANAGE_POSTS");
    } catch (err) {
      setComposerStatus(`[ERROR]: ${err.message}`);
    }
  };

  const resetComposerForm = () => {
    setPostId("");
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory(categories[0]?.name || "SYSTEM DESIGN");
    setTagsInput("");
    setCoverImage("");
    setPublished(false);
    setUpgradeTitle("");
    setUpgradeDesc("");
    setUpgradeUrl("");
  };

  const handleEditPost = (post) => {
    setPostId(post._id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setTagsInput(post.tags.join(", "));
    setCoverImage(post.coverImage);
    setPublished(post.published);
    if (post.contentUpgrade) {
      setUpgradeTitle(post.contentUpgrade.title || "");
      setUpgradeDesc(post.contentUpgrade.description || "");
      setUpgradeUrl(post.contentUpgrade.fileUrl || "");
    }
    setActiveTab("WRITE_POST");
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this journal post?")) return;

    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deletion failed");
      fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Comment Moderation Approvals
  const handleApproveComment = async (id) => {
    try {
      const res = await fetch("/api/blog/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm("Delete this comment and all nested replies?")) return;

    try {
      const res = await fetch(`/api/blog/comments?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Newsletter campaign send dispatcher
  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterStatus("");
    setNewsletterLoading(true);

    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newsletterSubject,
          htmlContent: newsletterBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to dispatch newsletter");

      setNewsletterStatus(`[SUCCESS]: Campaign dispatched. Recipient Count: ${data.sentCount}`);
      setNewsletterSubject("");
      setNewsletterBody("");
    } catch (err) {
      setNewsletterStatus(`[ERROR]: ${err.message}`);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Render Access Denied Window
  if (!loading && !adminUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex items-center justify-center p-6 font-mono">
        <TerminalWindow title="security@codiac.online:~/admin_login">
          <div className="text-red-500 font-extrabold text-sm mb-4 uppercase animate-pulse">
            [ACCESS DENIED]: ADMINISTRATIVE CREDENTIALS MISSING OR EXPIRED
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6 uppercase transition-colors">
            Connection rejected from remote address. This console is reserved for authorized system engineering operations. Please connect using the verified administrator email loaded in the workspace environments.
          </p>
          <div className="flex gap-4">
            <Link
              href="/blog"
              className="text-xs bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold px-4 py-2 hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-colors rounded-none text-center"
            >
              BACK TO JOURNAL
            </Link>
          </div>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <LoadingWrapper text="ADMIN_CONSOLE">
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono pb-20 selection:bg-[#ADFF2F] selection:text-black transition-colors duration-300">
        
        {/* Cyberpunk Scanlines */}
        <div className="absolute inset-0 bg-scanline opacity-[0.01] dark:opacity-[0.03] pointer-events-none z-0" />

        {/* Header */}
        <header className="border-b border-[var(--border-primary)] bg-[var(--glass-bg)] px-6 py-4 flex items-center justify-between sticky top-0 z-40 relative z-10 select-none transition-colors duration-300 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Back to Journal">
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tighter uppercase transition-colors">
              CODIAC // ADMIN DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest hidden md:block transition-colors">
              SYS_ENG: {adminUser?.name} ({adminUser?.email})
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Control Navigation (Sidebar) */}
            <aside className="lg:col-span-3 space-y-2 select-none">
              {[
                { id: "PORTFOLIO_CONTENT", label: "PORTFOLIO CONTENT", icon: <FaGlobe /> },
                { id: "PORTFOLIO_PROJECTS", label: "PORTFOLIO PROJECTS", icon: <FaFileAlt /> },
                { id: "MANAGE_POSTS", label: "MANAGE POSTS", icon: <FaFolder /> },
                { id: "WRITE_POST", label: "WRITE JOURNAL", icon: <FaPen /> },
                { id: "CATEGORIES", label: "MANAGE CATEGORIES", icon: <FaTags /> },
                { id: "MODERATE_COMMENTS", label: "MODERATE COMMENTS", icon: <FaComments />, count: comments.filter(c => !c.approved).length },
                { id: "SUBSCRIBERS", label: "SUBSCRIBERS", icon: <FaUsers /> },
                { id: "NEWSLETTER", label: "SEND CAMPAIGN", icon: <FaEnvelope /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "WRITE_POST" && postId === "") {
                      resetComposerForm();
                    }
                  }}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest flex items-center justify-between transition-colors border rounded-none ${
                    activeTab === tab.id
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                      : "border-[var(--border-primary)] hover:border-[var(--border-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)]/40 hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {tab.icon} {tab.label}
                  </span>
                  {tab.count > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 text-[9px] rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </aside>

            {/* Right Pane (Active view) */}
            <section className="lg:col-span-9">
              
              {/* Tab 1: MANAGE POSTS */}
              {activeTab === "MANAGE_POSTS" && (
                <TerminalWindow title="database:~/journal_entries">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest transition-colors">// JOURNAL CATALOG ({posts.length} entries)</h3>
                    <button
                      onClick={() => {
                        resetComposerForm();
                        setActiveTab("WRITE_POST");
                      }}
                      className="bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold text-[10px] px-3 py-1.5 hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-all rounded-none uppercase"
                    >
                      + Create Post
                    </button>
                  </div>

                  {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[var(--text-secondary)] transition-colors">
                        <thead>
                          <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest transition-colors">
                            <th className="py-3 px-2">ARTICLE TITLE</th>
                            <th className="py-3 px-2">CATEGORY</th>
                            <th className="py-3 px-2">VIEWS</th>
                            <th className="py-3 px-2">STATUS</th>
                            <th className="py-3 px-2 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr key={post._id} className="border-b border-[var(--border-primary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors">
                              <td className="py-4 px-2 font-bold text-[var(--text-primary)] uppercase max-w-xs truncate transition-colors">{post.title}</td>
                              <td className="py-4 px-2 uppercase text-[var(--color-toxic-green)] transition-colors">{post.category}</td>
                              <td className="py-4 px-2">{post.views}</td>
                              <td className="py-4 px-2">
                                <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-none border transition-colors ${
                                  post.published
                                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                                    : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                }`}>
                                  {post.published ? "PUBLISHED" : "DRAFT"}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right flex justify-end gap-3">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="text-[var(--text-primary)] hover:text-[var(--color-toxic-green)] transition-colors"
                                  title="Edit entry"
                                >
                                  <FaPen size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post._id)}
                                  className="text-red-500 hover:text-[var(--text-primary)] transition-colors"
                                  title="Delete entry"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[var(--text-tertiary)] text-xs border border-dashed border-[var(--border-primary)]/50 uppercase select-none transition-colors">
                      No posts stored in database. Pave the way by writing your first journal post!
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab 2: WRITE / EDIT POST COMPOSER */}
              {activeTab === "WRITE_POST" && (
                <TerminalWindow title={`composer:~/${postId ? "edit_post" : "write_new_post"}`}>
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-primary)] pb-2 transition-colors">
                    // {postId ? `MODIFYING_ARTICLE: ${title}` : "COMPOSE_TECHNICAL_JOURNAL"}
                  </h3>

                  {composerStatus && (
                    <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] leading-normal transition-colors">
                      {composerStatus}
                    </div>
                  )}

                  <form onSubmit={handleComposerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">ARTICLE TITLE *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            // Auto generate slug
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
                          }}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                          placeholder="E.g. Redis In-Memory Buffer Patterns"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">NORMALIZED SLUG *</label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                          placeholder="redis-in-memory-buffer-patterns"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">CATEGORY *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                        >
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">COMMA SEPARATED TAGS</label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                          placeholder="redis, cashing, fullstack"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">PUBLISHING STATUS</label>
                        <div className="flex items-center h-11 border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 transition-colors">
                          <input
                            type="checkbox"
                            id="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="mr-3 accent-[#ADFF2F]"
                          />
                          <label htmlFor="published" className="text-xs text-[var(--text-secondary)] uppercase select-none transition-colors">
                            PUBLISH ARTICLE LIVE
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Image R2 Upload block */}
                    <div>
                      <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">COVER IMAGE LINK *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                          placeholder="https://pub-080732c6fb61453c92062218797bf9df.r2.dev/blog/img.jpg"
                        />
                        <div className="relative border border-[var(--border-secondary)] hover:border-[var(--text-primary)] bg-[var(--bg-tertiary)] px-4 py-3 flex items-center justify-center cursor-pointer transition-all select-none text-xs font-bold text-[var(--text-primary)] uppercase">
                          <FaUpload className="inline mr-2" /> {uploading ? "WAIT..." : "UPLOAD"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">SUMMARY EXCERPT *</label>
                      <textarea
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={2}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                        placeholder="Provide a short excerpt explaining the article in 2 sentences"
                      />
                    </div>

                    {/* Rich Production Grade Markdown Post Composer */}
                    <div className="space-y-2">
                      <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1 font-bold transition-colors">MARKDOWN POST BODY *</label>
                      <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)]/10 p-1 space-y-3 transition-colors duration-300">
                        
                        {/* Editor / Preview Mode Header Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[var(--bg-tertiary)] p-3 border-b border-[var(--border-primary)] select-none">
                          
                          {/* Tab Switcher for Writing Modes */}
                          <div className="flex border border-[var(--border-primary)] bg-[var(--bg-primary)] p-0.5 rounded-none text-[10px] font-bold tracking-wider">
                            {[
                              { id: "write", label: "EDIT", icon: <FaPen size={9} /> },
                              { id: "split", label: "SPLIT VIEW", icon: <FaExpand size={9} /> },
                              { id: "preview", label: "PREVIEW", icon: <FaEye size={9} /> }
                            ].map((mode) => (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => setEditorMode(mode.id)}
                                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors rounded-none ${
                                  editorMode === mode.id
                                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                              >
                                {mode.icon}
                                <span>{mode.label}</span>
                              </button>
                            ))}
                          </div>

                          {/* Preview Customizers */}
                          {editorMode !== "write" && (
                            <div className="flex items-center gap-3 ml-auto text-[10px] font-bold">
                              
                              {/* Font size legibility toggles */}
                              <div className="flex border border-[var(--border-primary)] bg-[var(--bg-primary)] p-0.5 rounded-none text-[8px]">
                                <button
                                  type="button"
                                  onClick={() => setPreviewFontSize("sm")}
                                  className={`px-2 py-1 ${previewFontSize === "sm" ? "bg-neutral-800 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                                >
                                  A-
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewFontSize("md")}
                                  className={`px-2 py-1 ${previewFontSize === "md" ? "bg-neutral-800 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                                >
                                  A
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewFontSize("lg")}
                                  className={`px-2 py-1 ${previewFontSize === "lg" ? "bg-neutral-800 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                                >
                                  A+
                                </button>
                              </div>

                              {/* Theme switcher */}
                              <button
                                type="button"
                                onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                                className="border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--text-primary)] p-1.5 text-xs transition-colors rounded-none flex items-center justify-center"
                                title="Toggle Preview Theme"
                              >
                                {previewTheme === "dark" ? <FaSun size={10} className="text-yellow-500" /> : <FaMoon size={10} />}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive Rich Formatting Toolbar (Only in write and split modes) */}
                        {editorMode !== "preview" && (
                          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-primary)] select-none">
                            {[
                              { icon: <FaBold size={11} />, prefix: "**", suffix: "**", title: "Bold" },
                              { icon: <FaItalic size={11} />, prefix: "*", suffix: "*", title: "Italic" },
                              { icon: <FaHeading size={11} />, prefix: "## ", suffix: "", title: "Header 2" },
                              { icon: <span className="font-extrabold text-[9px] font-mono">H3</span>, prefix: "### ", suffix: "", title: "Header 3" },
                              { icon: <FaListUl size={11} />, prefix: "- ", suffix: "", title: "Bullet List" },
                              { icon: <FaListOl size={11} />, prefix: "1. ", suffix: "", title: "Numbered List" },
                              { icon: <FaQuoteLeft size={11} />, prefix: "> ", suffix: "", title: "Blockquote" },
                              { icon: <FaCode size={11} />, prefix: "`", suffix: "`", title: "Inline Code" },
                              { icon: <span className="font-mono text-[9px] font-bold">&lt;/&gt;</span>, prefix: "```javascript\n", suffix: "\n```", title: "Code Block" },
                              { icon: <FaLink size={11} />, prefix: "[Link Label](", suffix: ")", title: "Link" },
                              { icon: <FaImage size={11} />, prefix: "![Alt Label](", suffix: ")", title: "Image" },
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => insertFormatting(item.prefix, item.suffix)}
                                className="w-7 h-7 flex items-center justify-center border border-[var(--border-primary)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all rounded-none"
                                title={item.title}
                              >
                                {item.icon}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Main Workspace: Split / Editor / Preview Container */}
                        <div className={`grid gap-4 ${editorMode === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                          
                          {/* Code editor textarea wrapper */}
                          {editorMode !== "preview" && (
                            <div className="relative">
                              <textarea
                                ref={textareaRef}
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    const start = e.target.selectionStart;
                                    const end = e.target.selectionEnd;
                                    const currentVal = e.target.value;
                                    const newVal = currentVal.substring(0, start) + "  " + currentVal.substring(end);
                                    setContent(newVal);
                                    setTimeout(() => {
                                      e.target.selectionStart = e.target.selectionEnd = start + 2;
                                    }, 10);
                                  }
                                }}
                                rows={18}
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-4 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none leading-relaxed transition-all duration-300 resize-y"
                                placeholder="## INTRODUCTION&#10;&#10;Write down your technical log entry in markdown..."
                              />
                              
                              {/* Editor Stats Footer Bar */}
                              <div className="flex justify-between items-center bg-[var(--bg-tertiary)] border-x border-b border-[var(--border-secondary)] px-3 py-1.5 text-[9px] font-mono text-[var(--text-tertiary)] select-none">
                                <span className="flex items-center gap-3">
                                  <span>CHARS: {content.length}</span>
                                  <span>WORDS: {content.trim().split(/\s+/).filter(Boolean).length}</span>
                                </span>
                                <span>
                                  READ TIME: {Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200))} MIN
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* High Fidelity Theme-able Blog Styled Preview */}
                          {editorMode !== "write" && (
                            <div 
                              className={`border border-[var(--border-primary)] p-6 overflow-y-auto transition-all duration-300 select-text ${
                                previewTheme === "light" 
                                  ? "bg-white text-neutral-800" 
                                  : "bg-[#0b0b0b] text-neutral-300"
                              }`}
                              style={{ 
                                maxHeight: editorMode === "split" ? "404px" : "none",
                                minHeight: editorMode === "split" ? "404px" : "300px" 
                              }}
                            >
                              
                              {/* Mini preview bar header */}
                              <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 border-b border-neutral-700/20 pb-2 mb-4 select-none">
                                <span>// DYNAMIC PREVIEW COMPILER</span>
                                <span>THEME: {previewTheme.toUpperCase()} &bull; SCALE: {previewFontSize.toUpperCase()}</span>
                              </div>

                              {content ? (
                                isHtml(content) ? (
                                  <SafeHtmlRenderer html={content} />
                                ) : (
                                  <article 
                                    className="prose max-w-none break-words"
                                    style={{
                                      fontSize: previewFontSize === "sm" ? "11px" : previewFontSize === "lg" ? "14px" : "12px"
                                    }}
                                    dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(content, previewTheme) }}
                                  />
                                )
                              ) : (
                                <div className="py-12 text-center text-neutral-500 italic text-xs select-none">
                                  Preview compilation is currently empty...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Upgrade optionals */}
                    <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 rounded-none space-y-4 transition-colors duration-300">
                      <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest border-b border-[var(--border-primary)] pb-2 transition-colors">
                        // OPTIONAL CONTENT UPGRADE
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">UPGRADE TITLE</label>
                          <input
                            type="text"
                            value={upgradeTitle}
                            onChange={(e) => setUpgradeTitle(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                            placeholder="E.g. Redis Cheatsheet PDF"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">UPGRADE DESCRIPTION</label>
                          <input
                            type="text"
                            value={upgradeDesc}
                            onChange={(e) => setUpgradeDesc(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                            placeholder="E.g. Comprehensive architecture diagram"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">UPGRADE ASSET URL (R2 / PDF)</label>
                          <input
                            type="text"
                            value={upgradeUrl}
                            onChange={(e) => setUpgradeUrl(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                            placeholder="https://pub-080732c6fb61453c92062218797bf9df.r2.dev/blog/redis_cheat.pdf"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-[var(--border-primary)] transition-colors">
                      <button
                        type="submit"
                        className="bg-[var(--text-primary)] hover:bg-[var(--color-toxic-green)] text-[var(--bg-primary)] hover:text-[var(--color-obsidian)] font-extrabold text-xs px-8 py-3 tracking-widest uppercase transition-colors rounded-none"
                      >
                        {postId ? "UPDATE JOURNAL POST" : "PUBLISH POST"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetComposerForm();
                          setActiveTab("MANAGE_POSTS");
                        }}
                        className="border border-[var(--border-primary)] hover:border-[var(--border-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs px-6 py-3 tracking-widest uppercase transition-all rounded-none"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </TerminalWindow>
              )}

              {/* Tab 3: COMMENTS MODERATION */}
              {activeTab === "MODERATE_COMMENTS" && (
                <TerminalWindow title="moderator:~/discussions">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-primary)] pb-2 transition-colors">
                    // USER DISCUSSIONS MODERATION
                  </h3>

                  {comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comm) => (
                        <div key={comm._id} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-5 rounded-none flex flex-col md:flex-row justify-between gap-4 transition-colors duration-300">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase">
                              <span className="text-[var(--text-primary)] font-bold transition-colors">{comm.userName}</span>
                              <span className="text-[var(--text-tertiary)] transition-colors">({comm.userEmail})</span>
                              <span className="text-[var(--text-tertiary)] transition-colors">&bull;</span>
                              <span className="text-[var(--text-tertiary)] transition-colors">{new Date(comm.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-xs font-mono border-l-2 border-[var(--border-secondary)]/50 pl-3 leading-relaxed uppercase py-1 transition-colors">
                              {comm.content}
                            </p>
                            <div className="text-[9px] text-[var(--text-tertiary)] uppercase transition-colors">
                              POST ID: <span className="text-[var(--text-secondary)] font-bold transition-colors">{comm.postId}</span>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col justify-end gap-2 items-start shrink-0">
                            <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-none border mb-2 transition-colors ${
                              comm.approved
                                ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            }`}>
                              {comm.approved ? "APPROVED" : "PENDING APPROVAL"}
                            </span>
                            
                            <div className="flex gap-2">
                              {!comm.approved && (
                                <button
                                  onClick={() => handleApproveComment(comm._id)}
                                  className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-600/20 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border border-green-500/30 text-[9px] font-bold px-2 py-1 uppercase rounded-none transition-all"
                                >
                                  <FaCheck size={8} /> Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteComment(comm._id)}
                                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-500/30 text-[9px] font-bold px-2 py-1 uppercase rounded-none transition-all"
                              >
                                <FaTrash size={8} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[var(--text-tertiary)] text-xs border border-dashed border-[var(--border-primary)]/50 uppercase select-none transition-colors">
                      All comment logs are moderatively stable. Zero pending comments.
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab: DYNAMIC CATEGORIES MANAGEMENT */}
              {activeTab === "CATEGORIES" && (
                <TerminalWindow title="categories:~/dynamic_tags">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-primary)] pb-2 transition-colors">
                    // MANAGE DYNAMIC CATEGORIES
                  </h3>

                  {categoryStatus && (
                    <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] leading-normal transition-colors">
                      {categoryStatus}
                    </div>
                  )}

                  {/* Creation Form */}
                  <form onSubmit={handleCreateCategory} className="mb-8 border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-5 rounded-none space-y-4 transition-colors duration-300">
                    <h4 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest border-b border-[var(--border-primary)] pb-2 transition-colors">
                      // CREATE NEW CATEGORY
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        required
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                        placeholder="E.g. DEVOPS"
                      />
                      <button
                        type="submit"
                        disabled={categoryLoading}
                        className="bg-[var(--text-primary)] hover:bg-[var(--color-toxic-green)] text-[var(--bg-primary)] hover:text-[var(--color-obsidian)] font-extrabold text-xs px-6 py-3 tracking-widest uppercase transition-colors rounded-none whitespace-nowrap disabled:opacity-50"
                      >
                        {categoryLoading ? "CREATING..." : "ADD CATEGORY"}
                      </button>
                    </div>
                  </form>

                  {/* List categories */}
                  <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)]/10 p-1 transition-colors duration-300">
                    <div className="bg-[var(--bg-tertiary)] p-3 border-b border-[var(--border-primary)] select-none">
                      <span className="text-[10px] font-bold tracking-wider">// REGISTERED CATEGORIES ({categories.length})</span>
                    </div>
                    {categories.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-[var(--text-secondary)] transition-colors">
                          <thead>
                            <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest transition-colors">
                              <th className="py-3 px-4">CATEGORY NAME</th>
                              <th className="py-3 px-4 text-right">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((cat) => (
                              <tr key={cat._id} className="border-b border-[var(--border-primary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors">
                                <td className="py-4 px-4 font-bold text-[var(--text-primary)] uppercase transition-colors">
                                  {cat.name}
                                </td>
                                <td className="py-4 px-4 text-right flex justify-end gap-3">
                                  <button
                                    onClick={() => handleDeleteCategory(cat._id)}
                                    className="text-red-500 hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-[9px] font-bold px-2 py-1 uppercase rounded-none transition-all"
                                    title="Delete category"
                                  >
                                    <FaTrash size={8} /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-[var(--text-tertiary)] text-xs border border-dashed border-[var(--border-primary)]/50 uppercase select-none transition-colors">
                        No categories found in database.
                      </div>
                    )}
                  </div>
                </TerminalWindow>
              )}

              {/* Tab 4: SUBSCRIBERS */}
              {activeTab === "SUBSCRIBERS" && (
                <TerminalWindow title="list:~/verified_subscribers">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-primary)] pb-2 transition-colors">
                    // NEWSLETTER SUBSCRIBERS ({subscribers.length} verified)
                  </h3>

                  {subscribers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[var(--text-secondary)] transition-colors">
                        <thead>
                          <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest transition-colors">
                            <th className="py-3 px-2">EMAIL ADDRESS</th>
                            <th className="py-3 px-2">SUBSCRIPTION DATE</th>
                            <th className="py-3 px-2">VERIFIED</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((sub) => (
                            <tr key={sub._id} className="border-b border-[var(--border-primary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors">
                              <td className="py-4 px-2 font-bold text-[var(--text-primary)] uppercase transition-colors">{sub.email}</td>
                              <td className="py-4 px-2">{new Date(sub.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 px-2 text-green-500 font-extrabold">// TRUE</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[var(--text-tertiary)] text-xs border border-dashed border-[var(--border-primary)]/50 uppercase select-none transition-colors">
                      Mailing list has zero verified subscribers currently. Keep generating high quality logs to build authority!
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab 5: SEND CAMPAIGN */}
              {activeTab === "NEWSLETTER" && (
                <TerminalWindow title="campaign:~/resend_dispatch">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-primary)] pb-2 transition-colors">
                    // SEND NEWSLETTER CAMPAIGN
                  </h3>

                  {newsletterStatus && (
                    <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] transition-colors">
                      {newsletterStatus}
                    </div>
                  )}

                  <form onSubmit={handleSendNewsletter} className="space-y-6">
                    <div>
                      <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">EMAIL SUBJECT *</label>
                      <input
                        type="text"
                        required
                        value={newsletterSubject}
                        onChange={(e) => setNewsletterSubject(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300"
                        placeholder="E.g. Vol.12: Redis Architecture Cheatsheet Pack"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors">NEWSLETTER BODY (HTML SUPPORTED) *</label>
                      <textarea
                        required
                        value={newsletterBody}
                        onChange={(e) => setNewsletterBody(e.target.value)}
                        rows={12}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none leading-relaxed transition-all duration-300"
                        placeholder="&lt;p&gt;Hi developers,&lt;/p&gt;&#10;&lt;p&gt;Today we are breaking down Redis cached pipelines...&lt;/p&gt;"
                      />
                    </div>

                    <div className="border border-[var(--border-primary)]/50 bg-[var(--bg-secondary)] p-4 text-[10px] text-[var(--text-tertiary)] uppercase leading-relaxed font-mono transition-colors duration-300">
                      <span className="text-yellow-500 font-bold">[WARNING]:</span> Dispatching this campaign will trigger Resend API calls to all verified subscribers in the database list. Batch sends are paced to ensure optimal inbox delivery speeds.
                    </div>

                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="bg-[var(--text-primary)] hover:bg-[var(--color-toxic-green)] text-[var(--bg-primary)] hover:text-[var(--color-obsidian)] font-extrabold text-xs px-8 py-3 tracking-widest uppercase transition-colors rounded-none disabled:opacity-50"
                    >
                      {newsletterLoading ? "TRANSMITTING..." : "DISPATCH CAMPAIGN"}
                    </button>
                  </form>
                </TerminalWindow>
              )}

              {/* Tab: PORTFOLIO CONTENT */}
              {activeTab === "PORTFOLIO_CONTENT" && <SiteContentManager />}

              {/* Tab: PORTFOLIO PROJECTS */}
              {activeTab === "PORTFOLIO_PROJECTS" && <ProjectsManager />}
            </section>
          </div>
        </main>
      </div>
    </LoadingWrapper>
  );
};

export default AdminDashboard;
