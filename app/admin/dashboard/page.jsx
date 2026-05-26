"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPen, FaFolder, FaComments, FaUsers, FaEnvelope, FaUpload, FaTrash, FaCheck, FaTimes, FaGlobe, FaFileAlt } from "react-icons/fa";
import LoadingWrapper from "@/components/ui/LoadingWrapper";
import TerminalWindow from "@/components/ui/TerminalWindow";

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

  const fetchAdminData = async () => {
    try {
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
    setCategory("SYSTEM DESIGN");
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
      <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 flex items-center justify-center p-6 font-mono">
        <TerminalWindow title="security@codiac.online:~/admin_login">
          <div className="text-red-500 font-extrabold text-sm mb-4 uppercase animate-pulse">
            [ACCESS_DENIED]: ADMINISTRATIVE CREDENTIALS MISSING OR EXPIRED
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6 uppercase">
            Connection rejected from remote address. This console is reserved for authorized system engineering operations. Please connect using the verified administrator email loaded in the workspace environments.
          </p>
          <div className="flex gap-4">
            <Link
              href="/blog"
              className="text-xs bg-white text-black font-extrabold px-4 py-2 hover:bg-[#ADFF2F] transition-colors rounded-none text-center"
            >
              [ BACK_TO_JOURNAL ]
            </Link>
          </div>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <LoadingWrapper text="ADMIN_CONSOLE">
      <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-mono pb-20 selection:bg-[#ADFF2F] selection:text-black">
        
        {/* Cyberpunk Scanlines */}
        <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none z-0" />

        {/* Header */}
        <header className="border-b border-white/10 bg-[#050505] px-6 py-4 flex items-center justify-between sticky top-0 z-40 relative z-10 select-none">
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-neutral-400 hover:text-white transition-colors" title="Back to Journal">
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-lg font-bold text-white tracking-tighter uppercase">
              CODIAC // ADMIN_DASHBOARD
            </h1>
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-widest hidden md:block">
            SYS_ENG: {adminUser?.name} ({adminUser?.email})
          </div>
        </header>

        {/* Stark Masthead Band */}
        <div className="bg-[#ADFF2F] text-black py-2.5 text-center text-[10px] font-extrabold tracking-[0.2em] uppercase select-none relative z-10">
          OPERATIONAL_CONTROL_PANEL // DATABASE_INTERFACE // S3_R2_MEDIA_TUNNEL
        </div>

        <main className="max-w-6xl mx-auto px-6 mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Control Navigation (Sidebar) */}
            <aside className="lg:col-span-3 space-y-2 select-none">
              {[
                { id: "MANAGE_POSTS", label: "MANAGE_POSTS", icon: <FaFolder /> },
                { id: "WRITE_POST", label: "WRITE_JOURNAL", icon: <FaPen /> },
                { id: "MODERATE_COMMENTS", label: "MODERATE_COMMENTS", icon: <FaComments />, count: comments.filter(c => !c.approved).length },
                { id: "SUBSCRIBERS", label: "SUBSCRIBERS", icon: <FaUsers /> },
                { id: "NEWSLETTER", label: "SEND_CAMPAIGN", icon: <FaEnvelope /> },
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
                      ? "bg-white text-black border-white"
                      : "border-white/10 hover:border-white/30 text-neutral-400 hover:text-white bg-black/40"
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
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">// JOURNAL_CATALOG ({posts.length} entries)</h3>
                    <button
                      onClick={() => {
                        resetComposerForm();
                        setActiveTab("WRITE_POST");
                      }}
                      className="bg-white text-black font-extrabold text-[10px] px-3 py-1.5 hover:bg-[#ADFF2F] transition-colors rounded-none uppercase"
                    >
                      + Create Post
                    </button>
                  </div>

                  {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-neutral-400">
                        <thead>
                          <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-widest">
                            <th className="py-3 px-2">ARTICLE_TITLE</th>
                            <th className="py-3 px-2">CATEGORY</th>
                            <th className="py-3 px-2">VIEWS</th>
                            <th className="py-3 px-2">STATUS</th>
                            <th className="py-3 px-2 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr key={post._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-2 font-bold text-white uppercase max-w-xs truncate">{post.title}</td>
                              <td className="py-4 px-2 uppercase text-[#ADFF2F]">{post.category}</td>
                              <td className="py-4 px-2">{post.views}</td>
                              <td className="py-4 px-2">
                                <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-none border ${
                                  post.published
                                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                                    : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                }`}>
                                  {post.published ? "PUBLISHED" : "DRAFT"}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right flex justify-end gap-3">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="text-white hover:text-[#ADFF2F] transition-colors"
                                  title="Edit entry"
                                >
                                  <FaPen size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post._id)}
                                  className="text-red-500 hover:text-white transition-colors"
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
                    <div className="py-12 text-center text-neutral-500 text-xs border border-dashed border-white/5 uppercase select-none">
                      No posts stored in database. Pave the way by writing your first journal post!
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab 2: WRITE / EDIT POST COMPOSER */}
              {activeTab === "WRITE_POST" && (
                <TerminalWindow title={`composer:~/${postId ? "edit_post" : "write_new_post"}`}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                    // {postId ? `MODIFYING_ARTICLE: ${title}` : "COMPOSE_TECHNICAL_JOURNAL"}
                  </h3>

                  {composerStatus && (
                    <div className="mb-6 border border-white/10 bg-neutral-900/60 p-3 text-xs text-neutral-400 leading-normal">
                      {composerStatus}
                    </div>
                  )}

                  <form onSubmit={handleComposerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">ARTICLE_TITLE *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            // Auto generate slug
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
                          }}
                          className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                          placeholder="E.g. REDIS IN-MEMORY BUFFER PATTERNS"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">NORMALIZED_SLUG *</label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                          className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
                          placeholder="redis-in-memory-buffer-patterns"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">CATEGORY *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-black border border-white/10 p-3 text-xs text-white focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
                        >
                          <option value="FRONTEND">FRONTEND</option>
                          <option value="BACKEND">BACKEND</option>
                          <option value="AI SYSTEMS">AI SYSTEMS</option>
                          <option value="SYSTEM DESIGN">SYSTEM DESIGN</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">COMMA_SEPARATED_TAGS</label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                          placeholder="redis, cashing, fullstack"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">PUBLISHING_STATUS</label>
                        <div className="flex items-center h-11 border border-white/10 bg-black px-4">
                          <input
                            type="checkbox"
                            id="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="mr-3 accent-[#ADFF2F]"
                          />
                          <label htmlFor="published" className="text-xs text-neutral-400 uppercase select-none">
                            PUBLISH_ARTICLE_LIVE
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Image R2 Upload block */}
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">COVER_IMAGE_LINK *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="flex-1 bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
                          placeholder="https://pub-080732c6fb61453c92062218797bf9df.r2.dev/blog/img.jpg"
                        />
                        <div className="relative border border-white/20 hover:border-white bg-neutral-900 px-4 py-3 flex items-center justify-center cursor-pointer transition-colors select-none text-xs font-bold text-white uppercase">
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
                      <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">SUMMARY_EXCERPT *</label>
                      <textarea
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={2}
                        className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                        placeholder="PROVIDE A SHORT EXCERPT EXPLAINING THE ARTICLE IN 2 SENTENCES"
                      />
                    </div>

                    {/* Writer Markdown block */}
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">MARKDOWN_POST_BODY *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={16}
                            className="w-full bg-black border border-white/10 p-3 font-mono text-xs text-neutral-300 placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none leading-relaxed"
                            placeholder="## INTRODUCTION&#10;&#10;Redis has evolved...&#10;&#10;## COMPONENT_DECAY&#10;&#10;Here is code:&#10;&#10;```javascript&#10;const x = 5;&#10;```"
                          />
                        </div>
                        
                        {/* Live preview */}
                        <div className="border border-white/10 bg-neutral-900/10 p-4 max-h-[352px] md:max-h-none overflow-y-auto font-mono text-xs leading-relaxed uppercase select-none">
                          <div className="text-[9px] text-neutral-500 border-b border-white/5 pb-2 mb-4 uppercase tracking-widest">
                            // LIVE_COMPILER_PREVIEW
                          </div>
                          {content ? (
                            <div className="prose max-w-none text-neutral-400">
                              {content.split("\n\n").map((b, idx) => {
                                if (b.trim().startsWith("## ")) return <h2 key={idx} className="text-[#ADFF2F] text-xs font-bold uppercase mt-4 mb-2">{b.replace("## ", "")}</h2>;
                                if (b.trim().startsWith("### ")) return <h3 key={idx} className="text-white text-xs font-bold uppercase mt-3 mb-1">{b.replace("### ", "")}</h3>;
                                if (b.trim().startsWith("```")) return <pre key={idx} className="bg-black/90 p-3 text-[10px] font-mono border border-white/5 my-3"><code>{b.replace(/```[a-z]*/i, "").replace("```", "")}</code></pre>;
                                return <p key={idx} className="mb-3">{b}</p>;
                              })}
                            </div>
                          ) : (
                            <span className="text-neutral-600 italic">Preview compilation is currently empty...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Upgrade optionals */}
                    <div className="border border-white/5 bg-[#050505] p-5 rounded-none space-y-4">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">
                        // OPTIONAL_CONTENT_UPGRADE
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">UPGRADE_TITLE</label>
                          <input
                            type="text"
                            value={upgradeTitle}
                            onChange={(e) => setUpgradeTitle(e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                            placeholder="E.g. REDIS CHEATSHEET PDF"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">UPGRADE_DESCRIPTION</label>
                          <input
                            type="text"
                            value={upgradeDesc}
                            onChange={(e) => setUpgradeDesc(e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                            placeholder="E.g. COMPREHENSIVE ARCHITECTURE DIAGRAM"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">UPGRADE_ASSET_URL (R2 / PDF)</label>
                          <input
                            type="text"
                            value={upgradeUrl}
                            onChange={(e) => setUpgradeUrl(e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono"
                            placeholder="https://pub-080732c6fb61453c92062218797bf9df.r2.dev/blog/redis_cheat.pdf"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="bg-white hover:bg-[#ADFF2F] text-black font-extrabold text-xs px-8 py-3 tracking-widest uppercase transition-colors rounded-none"
                      >
                        {postId ? "UPDATE_JOURNAL_POST" : "PUBLISH_POST"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetComposerForm();
                          setActiveTab("MANAGE_POSTS");
                        }}
                        className="border border-white/10 hover:border-white text-neutral-400 hover:text-white text-xs px-6 py-3 tracking-widest uppercase transition-colors rounded-none"
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
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                    // USER_DISCUSSIONS_MODERATION
                  </h3>

                  {comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comm) => (
                        <div key={comm._id} className="border border-white/10 bg-black/30 p-5 rounded-none flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase">
                              <span className="text-white font-bold">{comm.userName}</span>
                              <span className="text-neutral-500">({comm.userEmail})</span>
                              <span className="text-neutral-600">&bull;</span>
                              <span className="text-neutral-500">{new Date(comm.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-neutral-300 text-xs font-mono border-l-2 border-white/15 pl-3 leading-relaxed uppercase py-1">
                              {comm.content}
                            </p>
                            <div className="text-[9px] text-neutral-600 uppercase">
                              POST_ID: <span className="text-neutral-400 font-bold">{comm.postId}</span>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col justify-end gap-2 items-start shrink-0">
                            <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-none border mb-2 ${
                              comm.approved
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {comm.approved ? "APPROVED" : "PENDING_APPROVAL"}
                            </span>
                            
                            <div className="flex gap-2">
                              {!comm.approved && (
                                <button
                                  onClick={() => handleApproveComment(comm._id)}
                                  className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/20 text-[9px] font-bold px-2 py-1 uppercase rounded-none transition-colors"
                                >
                                  <FaCheck size={8} /> Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteComment(comm._id)}
                                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-[9px] font-bold px-2 py-1 uppercase rounded-none transition-colors"
                              >
                                <FaTrash size={8} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-neutral-500 text-xs border border-dashed border-white/5 uppercase select-none">
                      All comment logs are moderatively stable. Zero pending comments.
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab 4: SUBSCRIBERS */}
              {activeTab === "SUBSCRIBERS" && (
                <TerminalWindow title="list:~/verified_subscribers">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                    // NEWSLETTER_SUBSCRIBERS ({subscribers.length} verified)
                  </h3>

                  {subscribers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-neutral-400">
                        <thead>
                          <tr className="border-b border-white/10 text-neutral-500 text-[10px] uppercase tracking-widest">
                            <th className="py-3 px-2">EMAIL_ADDRESS</th>
                            <th className="py-3 px-2">SUBSCRIPTION_DATE</th>
                            <th className="py-3 px-2">VERIFIED</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((sub) => (
                            <tr key={sub._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-2 font-bold text-white uppercase">{sub.email}</td>
                              <td className="py-4 px-2">{new Date(sub.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 px-2 text-green-500 font-extrabold">// TRUE</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-neutral-500 text-xs border border-dashed border-white/5 uppercase select-none">
                      Mailing list has zero verified subscribers currently. Keep generating high quality logs to build authority!
                    </div>
                  )}
                </TerminalWindow>
              )}

              {/* Tab 5: SEND CAMPAIGN */}
              {activeTab === "NEWSLETTER" && (
                <TerminalWindow title="campaign:~/resend_dispatch">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                    // SEND_NEWSLETTER_CAMPAIGN
                  </h3>

                  {newsletterStatus && (
                    <div className="mb-6 border border-white/10 bg-neutral-900/60 p-3 text-xs text-neutral-400">
                      {newsletterStatus}
                    </div>
                  )}

                  <form onSubmit={handleSendNewsletter} className="space-y-6">
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">EMAIL_SUBJECT *</label>
                      <input
                        type="text"
                        required
                        value={newsletterSubject}
                        onChange={(e) => setNewsletterSubject(e.target.value)}
                        className="w-full bg-black border border-white/10 p-3 text-xs text-white placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none font-mono uppercase"
                        placeholder="E.g. VOL.12: REDIS ARCHITECTURE CHEATSHEET PACK"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">NEWSLETTER_BODY (HTML SUPPORTED) *</label>
                      <textarea
                        required
                        value={newsletterBody}
                        onChange={(e) => setNewsletterBody(e.target.value)}
                        rows={12}
                        className="w-full bg-black border border-white/10 p-3 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:border-[#ADFF2F] focus:outline-none rounded-none leading-relaxed"
                        placeholder="&lt;p&gt;Hi developers,&lt;/p&gt;&#10;&lt;p&gt;Today we are breaking down Redis cached pipelines...&lt;/p&gt;"
                      />
                    </div>

                    <div className="border border-white/5 bg-[#050505] p-4 text-[10px] text-neutral-500 uppercase leading-relaxed font-mono">
                      <span className="text-yellow-500 font-bold">[WARNING]:</span> Dispatching this campaign will trigger Resend API calls to all verified subscribers in the database list. Batch sends are paced to ensure optimal inbox delivery speeds.
                    </div>

                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="bg-white hover:bg-[#ADFF2F] text-black font-extrabold text-xs px-8 py-3 tracking-widest uppercase transition-colors rounded-none disabled:opacity-50"
                    >
                      {newsletterLoading ? "TRANSMITTING..." : "DISPATCH_CAMPAIGN"}
                    </button>
                  </form>
                </TerminalWindow>
              )}
            </section>
          </div>
        </main>
      </div>
    </LoadingWrapper>
  );
};

export default AdminDashboard;
