"use client";

import { motion } from "framer-motion";

const TerminalWindow = ({
  children,
  title = "musa-kannike:~/skills",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative w-full overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-2xl transition-colors duration-300 ${className}`}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-4 py-2 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/20 md:bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/20 md:bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500/20 md:bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] transition-colors">
          <span className="opacity-50">user@host:</span>
          <span>{title}</span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content Area */}
      <div className="relative p-6 font-mono text-sm">
        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10" />
        <div className="relative z-0 text-[var(--text-primary)] transition-colors">{children}</div>
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
