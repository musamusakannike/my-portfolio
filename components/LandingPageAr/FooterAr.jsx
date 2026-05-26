"use client";

import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaLinkedin,
  FaArrowUp,
} from "react-icons/fa";

const FooterAr = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#FAF9F6] dark:bg-[#050505] border-t border-neutral-200 dark:border-white/10 pt-16 pb-8 font-cairo relative overflow-hidden transition-colors duration-300">
      {/* Scanlines generic */}
      <div className="absolute inset-0 bg-scanline opacity-[0.02] dark:opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 font-cairo">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link
              href="/ar"
              className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4 block font-el-messiri"
            >
              موسى<span className="text-[var(--color-toxic-green)]">_</span>
              كانيكي
            </Link>
            <p className="text-neutral-600 dark:text-gray-500 text-sm max-w-sm mb-6">
              تم النشر من إيلورين، نيجيريا. <br />
              بناء تطبيقات ويب عالية الجودة وأنظمة ذكاء اصطناعي.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/musamusakannike"
                target="_blank"
                className="text-neutral-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                rel="noreferrer"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com/musa_codes"
                target="_blank"
                className="text-neutral-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                rel="noreferrer"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="mailto:musamusakannike@gmail.com"
                className="text-neutral-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                className="text-neutral-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                rel="noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-neutral-900 dark:text-white font-bold mb-4 text-sm font-el-messiri">التنقل</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-gray-400">
              <li>
                <Link
                  href="#about"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  عنّي
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  المشاريع
                </Link>
              </li>
              <li>
                <Link
                  href="#experience"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  الخبرة
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="hover:text-[var(--color-toxic-green)]"
                >
                  التقييمات
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-right">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs text-[var(--color-toxic-green)] hover:underline"
              >
                الرجوع للأعلى <FaArrowUp />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 dark:text-gray-600">
          <p>
            SYSTEM_STATUS: <span className="text-green-600 dark:text-green-500">متصل</span>
          </p>
          <p>&copy; {currentYear} موسى كانيكي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterAr;
