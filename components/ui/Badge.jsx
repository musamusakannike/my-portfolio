import { cn } from "@/utils/cn"; // Assuming utility for class merging exists or I will create it.

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-white/5 text-gray-300 border-white/10",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    accent:
      "bg-[var(--color-toxic-green)]/10 text-[var(--color-toxic-green)] border-[var(--color-toxic-green)]/20",
    outline: "bg-transparent border-white/20 text-gray-400",
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${style} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
