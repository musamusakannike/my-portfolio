"use client";

import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const inputClass =
  "w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--color-toxic-green)] focus:outline-none rounded-none font-mono transition-all duration-300";

const labelClass =
  "block text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-2 font-bold transition-colors";

export function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-xs text-[var(--text-secondary)] cursor-pointer select-none">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#ADFF2F]"
      />
      {label}
    </label>
  );
}

// Generic editor for an array of objects. `fields` describes the columns.
export function ArrayEditor({ label, items, onChange, fields, makeEmpty }) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (idx, key, value) => {
    const next = list.map((it, i) => (i === idx ? { ...it, [key]: value } : it));
    onChange(next);
  };
  const removeItem = (idx) => onChange(list.filter((_, i) => i !== idx));
  const addItem = () => onChange([...list, makeEmpty()]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelClass}>{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-[10px] font-bold uppercase text-[var(--color-toxic-green)] hover:text-[var(--text-primary)] transition-colors"
        >
          <FaPlus size={10} /> Add
        </button>
      </div>
      {list.map((item, idx) => (
        <div
          key={idx}
          className="border border-[var(--border-primary)] p-3 space-y-3 bg-[var(--bg-secondary)]/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) =>
              f.type === "checkbox" ? (
                <div key={f.key} className="flex items-center">
                  <Checkbox
                    label={f.label}
                    checked={item[f.key]}
                    onChange={(v) => updateItem(idx, f.key, v)}
                  />
                </div>
              ) : f.type === "lines" ? (
                <div key={f.key} className="md:col-span-2">
                  <TextArea
                    label={f.label}
                    value={(item[f.key] || []).join("\n")}
                    onChange={(v) =>
                      updateItem(
                        idx,
                        f.key,
                        v.split("\n").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder={f.placeholder}
                    rows={f.rows || 3}
                  />
                </div>
              ) : f.type === "textarea" ? (
                <div key={f.key} className="md:col-span-2">
                  <TextArea
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(idx, f.key, v)}
                    placeholder={f.placeholder}
                    rows={f.rows || 3}
                  />
                </div>
              ) : (
                <Field
                  key={f.key}
                  label={f.label}
                  value={item[f.key]}
                  onChange={(v) => updateItem(idx, f.key, v)}
                  placeholder={f.placeholder}
                />
              )
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(idx)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-500 hover:text-[var(--text-primary)] transition-colors"
          >
            <FaTrash size={10} /> Remove
          </button>
        </div>
      ))}
      {list.length === 0 && (
        <div className="py-6 text-center text-[var(--text-tertiary)] text-[10px] border border-dashed border-[var(--border-primary)]/50 uppercase">
          No entries. Use &quot;Add&quot; to create one.
        </div>
      )}
    </div>
  );
}
