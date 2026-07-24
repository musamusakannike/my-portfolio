"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TerminalWindow from "@/components/ui/TerminalWindow";
import { FaSave, FaUpload, FaTrash, FaPen, FaPlus, FaTimes } from "react-icons/fa";
import {
  PORTFOLIO_VARIANTS,
  VARIANT_LABELS,
} from "@/utils/siteContentDefaults";
import { Field, TextArea, Checkbox } from "@/components/admin/adminUi";

const emptyProject = () => ({
  title: "",
  category: "",
  description: "",
  tags: [],
  role: "",
  image: "",
  isPrivate: false,
  isBeta: false,
  portfolios: ["main"],
  order: 0,
  links: {
    website: "",
    playStore: "",
    appStore: "",
    desktop: "",
    github: { frontend: "", server: "", mobile: "" },
  },
});

const sectionTitle =
  "text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4 border-b border-[var(--border-primary)] pb-2 transition-colors";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // project object or null
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects || []);
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const startCreate = () => {
    setEditing({ ...emptyProject(), order: projects.length });
    setStatus("");
  };

  const startEdit = (project) => {
    setEditing(structuredClone({ ...emptyProject(), ...project, links: { ...emptyProject().links, ...(project.links || {}), github: { ...emptyProject().links.github, ...((project.links || {}).github || {}) } } }));
    setStatus("");
  };

  const setField = (key, value) =>
    setEditing((prev) => ({ ...prev, [key]: value }));
  const setLink = (key, value) =>
    setEditing((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));
  const setGithub = (key, value) =>
    setEditing((prev) => ({
      ...prev,
      links: { ...prev.links, github: { ...prev.links.github, [key]: value } },
    }));

  const togglePortfolio = (v) =>
    setEditing((prev) => {
      const has = prev.portfolios.includes(v);
      const next = has
        ? prev.portfolios.filter((p) => p !== v)
        : [...prev.portfolios, v];
      return { ...prev, portfolios: next.length ? next : ["main"] };
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("[UPLOAD]: Transmitting image to R2 storage...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "projects");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");
      setField("image", data.url);
      setStatus("[SUCCESS]: Image uploaded.");
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editing.title) {
      setStatus("[ERROR]: Project title is required.");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      const isEdit = !!editing._id;
      const payload = isEdit ? { ...editing, id: editing._id } : editing;
      const res = await fetch("/api/admin/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");
      setEditing(null);
      await fetchProjects();
    } catch (err) {
      setStatus(`[ERROR]: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project permanently?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  if (editing) {
    return (
      <TerminalWindow title={`projects:~/${editing._id ? "edit" : "new"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest transition-colors">
            // {editing._id ? `Editing: ${editing.title}` : "New Project"}
          </h3>
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FaTimes size={12} /> Cancel
          </button>
        </div>

        {status && (
          <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] transition-colors">
            {status}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title *" value={editing.title} onChange={(v) => setField("title", v)} />
            <Field label="Category" value={editing.category} onChange={(v) => setField("category", v)} />
            <Field label="Role" value={editing.role} onChange={(v) => setField("role", v)} />
            <Field label="Order" type="number" value={editing.order} onChange={(v) => setField("order", Number(v) || 0)} />
          </div>

          <TextArea label="Description" value={editing.description} onChange={(v) => setField("description", v)} />

          <Field
            label="Tags (comma separated)"
            value={(editing.tags || []).join(", ")}
            onChange={(v) => setField("tags", v.split(",").map((s) => s.trim()).filter(Boolean))}
          />

          {/* Image */}
          <div>
            <h4 className={sectionTitle}>// Image</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <Field label="Image URL" value={editing.image} onChange={(v) => setField("image", v)} placeholder="/projects/example.png" />
              </div>
              <label className="flex items-center justify-center gap-2 cursor-pointer bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] font-bold text-[10px] px-4 py-3 hover:border-[var(--color-toxic-green)] transition-colors rounded-none uppercase">
                <FaUpload size={12} />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            </div>
            {editing.image && (
              <div className="mt-3 relative w-40 h-28 border border-[var(--border-primary)]">
                <Image src={editing.image} alt="preview" fill className="object-cover" sizes="160px" />
              </div>
            )}
          </div>

          {/* Flags + portfolios */}
          <div>
            <h4 className={sectionTitle}>// Visibility</h4>
            <div className="flex flex-wrap gap-6 mb-4">
              <Checkbox label="Private (no public repo)" checked={editing.isPrivate} onChange={(v) => setField("isPrivate", v)} />
              <Checkbox label="Beta" checked={editing.isBeta} onChange={(v) => setField("isBeta", v)} />
            </div>
            <label className="block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold">Show on portfolios</label>
            <div className="flex flex-wrap gap-4">
              {PORTFOLIO_VARIANTS.map((v) => (
                <Checkbox
                  key={v}
                  label={VARIANT_LABELS[v]}
                  checked={editing.portfolios.includes(v)}
                  onChange={() => togglePortfolio(v)}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className={sectionTitle}>// Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Website" value={editing.links.website} onChange={(v) => setLink("website", v)} />
              <Field label="Play Store" value={editing.links.playStore} onChange={(v) => setLink("playStore", v)} />
              <Field label="App Store" value={editing.links.appStore} onChange={(v) => setLink("appStore", v)} />
              <Field label="Desktop / Download" value={editing.links.desktop} onChange={(v) => setLink("desktop", v)} />
              <Field label="GitHub — Frontend" value={editing.links.github.frontend} onChange={(v) => setGithub("frontend", v)} />
              <Field label="GitHub — Server" value={editing.links.github.server} onChange={(v) => setGithub("server", v)} />
              <Field label="GitHub — Mobile" value={editing.links.github.mobile} onChange={(v) => setGithub("mobile", v)} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold text-[10px] px-5 py-2.5 hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-all rounded-none uppercase disabled:opacity-50"
            >
              <FaSave size={12} /> {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title="database:~/projects">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest transition-colors">
          // Projects ({projects.length})
        </h3>
        <button
          onClick={startCreate}
          className="flex items-center gap-1 bg-[var(--text-primary)] text-[var(--bg-primary)] font-extrabold text-[10px] px-3 py-1.5 hover:bg-[var(--color-toxic-green)] hover:text-[var(--color-obsidian)] transition-all rounded-none uppercase"
        >
          <FaPlus size={10} /> Create Project
        </button>
      </div>

      {status && (
        <div className="mb-6 border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3 text-xs text-[var(--text-secondary)] transition-colors">
          {status}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-[var(--text-tertiary)] text-xs uppercase">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)] transition-colors">
            <thead>
              <tr className="border-b border-[var(--border-primary)] text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Portfolios</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-[var(--border-primary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="py-4 px-2 font-bold text-[var(--text-primary)] uppercase max-w-xs truncate">{p.title}</td>
                  <td className="py-4 px-2 uppercase text-[var(--color-toxic-green)]">{p.category}</td>
                  <td className="py-4 px-2 uppercase text-[10px]">{(p.portfolios || []).join(", ")}</td>
                  <td className="py-4 px-2 text-right flex justify-end gap-3">
                    <button onClick={() => startEdit(p)} className="text-[var(--text-primary)] hover:text-[var(--color-toxic-green)] transition-colors" title="Edit">
                      <FaPen size={12} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-[var(--text-primary)] transition-colors" title="Delete">
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
          No projects yet. Create your first one!
        </div>
      )}
    </TerminalWindow>
  );
}
