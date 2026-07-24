"use client";

import React, { useEffect, useState } from "react";
import TerminalWindow from "@/components/ui/TerminalWindow";
import { FaSave, FaUpload } from "react-icons/fa";
import {
  PORTFOLIO_VARIANTS,
  VARIANT_LABELS,
} from "@/utils/siteContentDefaults";
import { Field, TextArea, ArrayEditor } from "@/components/admin/adminUi";

const sectionTitle =
  "text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4 border-b border-[var(--border-primary)] pb-2 transition-colors";

export default function SiteContentManager() {
  const [variant, setVariant] = useState("main");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  const loadContent = async (v) => {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`/api/admin/site-content?variant=${v}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load content");
      setContent(data.content);
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent(variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const setPath = (path, value) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let node = next;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
      node[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, ...content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save content");
      setStatus("[SUCCESS]: Portfolio content saved and live.");
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCv(true);
    setStatus("[UPLOAD]: Transmitting CV to R2 storage...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "cv");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "CV upload failed");
      setPath(["cvUrl"], data.url);
      setStatus("[SUCCESS]: CV uploaded. Remember to Save Changes.");
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setUploadingCv(false);
    }
  };

  return (
    <TerminalWindow title="portfolio:~/site_content">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {PORTFOLIO_VARIANTS.map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-none transition-colors ${
                variant === v
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                  : "border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)]/40"
              }`}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading || !content}
          className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold text-[10px] px-4 py-2 hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-all rounded-none uppercase disabled:opacity-50"
        >
          <FaSave size={12} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status && (
        <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] leading-normal transition-colors">
          {status}
        </div>
      )}

      {loading || !content ? (
        <div className="py-12 text-center text-[var(--text-tertiary)] text-xs uppercase">
          Loading content...
        </div>
      ) : (
        <div className="space-y-10">
          {/* HERO */}
          <div>
            <h3 className={sectionTitle}>// Hero</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Logo" value={content.hero.logo} onChange={(v) => setPath(["hero", "logo"], v)} />
              <Field label="Title Line 1" value={content.hero.titleLine1} onChange={(v) => setPath(["hero", "titleLine1"], v)} />
              <Field label="Title Line 2" value={content.hero.titleLine2} onChange={(v) => setPath(["hero", "titleLine2"], v)} />
            </div>
            <div className="mt-4">
              <TextArea label="Subtitle" value={content.hero.sub} onChange={(v) => setPath(["hero", "sub"], v)} />
            </div>
            <div className="mt-4">
              <ArrayEditor
                label="Stats"
                items={content.hero.stats}
                onChange={(v) => setPath(["hero", "stats"], v)}
                makeEmpty={() => ({ num: "", label: "" })}
                fields={[
                  { key: "num", label: "Number" },
                  { key: "label", label: "Label" },
                ]}
              />
            </div>
          </div>

          {/* ABOUT */}
          <div>
            <h3 className={sectionTitle}>// About</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Eyebrow" value={content.about.eyebrow} onChange={(v) => setPath(["about", "eyebrow"], v)} />
              <Field label="Heading Lead" value={content.about.headingLead} onChange={(v) => setPath(["about", "headingLead"], v)} />
              <Field label="Heading Highlight" value={content.about.headingHighlight} onChange={(v) => setPath(["about", "headingHighlight"], v)} />
            </div>
            <div className="mt-4">
              <TextArea
                label="Bio (one paragraph per line, **bold** supported)"
                rows={5}
                value={(content.about.bio || []).join("\n")}
                onChange={(v) => setPath(["about", "bio"], v.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Skills (one per line)"
                rows={4}
                value={(content.about.skills || []).join("\n")}
                onChange={(v) => setPath(["about", "skills"], v.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
            <div className="mt-4">
              <ArrayEditor
                label="Traits"
                items={content.about.traits}
                onChange={(v) => setPath(["about", "traits"], v)}
                makeEmpty={() => ({ label: "", desc: "" })}
                fields={[
                  { key: "label", label: "Label" },
                  { key: "desc", label: "Description", type: "textarea" },
                ]}
              />
            </div>
          </div>

          {/* EXPERIENCES */}
          <div>
            <h3 className={sectionTitle}>// Experiences</h3>
            <ArrayEditor
              label="Roles"
              items={content.experiences}
              onChange={(v) => setPath(["experiences"], v)}
              makeEmpty={() => ({ title: "", company: "", location: "", period: "", description: "", skills: [], isCurrent: false })}
              fields={[
                { key: "title", label: "Title" },
                { key: "company", label: "Company" },
                { key: "location", label: "Location" },
                { key: "period", label: "Period (e.g. Jan 2024 – Present)" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "skills", label: "Skills (one per line)", type: "lines" },
                { key: "isCurrent", label: "Current role", type: "checkbox" },
              ]}
            />
          </div>

          {/* TESTIMONIALS */}
          <div>
            <h3 className={sectionTitle}>// Testimonials</h3>
            <ArrayEditor
              label="Testimonials"
              items={content.testimonials}
              onChange={(v) => setPath(["testimonials"], v)}
              makeEmpty={() => ({ name: "", role: "", feedback: "", verified: true })}
              fields={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role" },
                { key: "feedback", label: "Feedback", type: "textarea" },
                { key: "verified", label: "Verified", type: "checkbox" },
              ]}
            />
          </div>

          {/* CONTACT */}
          <div>
            <h3 className={sectionTitle}>// Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(v) => setPath(["contact", "eyebrow"], v)} />
              <Field label="Heading Lead" value={content.contact.headingLead} onChange={(v) => setPath(["contact", "headingLead"], v)} />
              <Field label="Heading Highlight" value={content.contact.headingHighlight} onChange={(v) => setPath(["contact", "headingHighlight"], v)} />
            </div>
            <div className="mt-4">
              <TextArea label="Subtitle" value={content.contact.subtitle} onChange={(v) => setPath(["contact", "subtitle"], v)} />
            </div>
          </div>

          {/* FOOTER */}
          <div>
            <h3 className={sectionTitle}>// Footer</h3>
            <TextArea label="Tagline" value={content.footer.tagline} onChange={(v) => setPath(["footer", "tagline"], v)} />
          </div>

          {/* CV */}
          <div>
            <h3 className={sectionTitle}>// CV / Resume</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <Field
                  label="CV URL (used by the Download Resumé button)"
                  value={content.cvUrl}
                  onChange={(v) => setPath(["cvUrl"], v)}
                  placeholder="/Musa Musa Kannike CV.pdf"
                />
              </div>
              <div>
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] font-bold text-[10px] px-4 py-3 hover:border-[var(--color-toxic-green)] transition-colors rounded-none uppercase">
                  <FaUpload size={12} />
                  {uploadingCv ? "Uploading..." : "Upload PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleCvUpload}
                    disabled={uploadingCv}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {content.cvUrl && (
              <a
                href={content.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[10px] text-[var(--color-toxic-green)] hover:underline uppercase tracking-widest"
              >
                Preview current CV →
              </a>
            )}
          </div>
        </div>
      )}
    </TerminalWindow>
  );
}
