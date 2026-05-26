"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaPaperPlane } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function ContactAr() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-eyebrow", start: "top 88%", once: true },
      });

      gsap.from(".contact-heading", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-heading", start: "top 88%", once: true },
      });

      gsap.from(".contact-form-wrapper", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-form-wrapper", start: "top 90%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "تم إرسال الرسالة بنجاح! سأرد عليك في أقرب وقت." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      <div className="contact-noise" />

      <div className="contact-inner font-cairo">
        <header className="contact-header">
          <div className="eyebrow contact-eyebrow font-el-messiri">
            <span className="eyebrowDot" />
            تواصل معي
          </div>
          <h2 className="contact-heading font-el-messiri">
            لنعمل <br /> <em>معاً</em>
          </h2>
          <p className="contact-subtitle">
            هل لديك مشروع في ذهنك أو تريد فقط إلقاء التحية؟ أحب أن أسمع منك.
          </p>
        </header>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="جون دو"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">الرسالة</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="أخبرني عن مشروعك..."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <span className="btn-text">{isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
              <FaPaperPlane className="btn-icon" />
            </button>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          position: relative;
          width: 100%;
          min-height: 80vh;
          padding: 130px 0 160px;
          background: transparent;
          overflow: hidden;
          font-family: var(--font-cairo), system-ui, -apple-system, sans-serif;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .contact-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.55;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        .contact-inner {
          position: relative;
          z-index: 10;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 56px;
          width: 100%;
        }

        .contact-header {
          margin-bottom: 50px;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--glass-bg);
          border: 1px solid var(--border-primary);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 28px;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-primary);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .contact-heading {
          font-family: var(--font-el-messiri), system-ui, sans-serif;
          font-size: clamp(40px, 6vw, 76px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -2px;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .contact-heading em {
          font-style: normal;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 440px;
          margin: 0 auto;
          transition: color 0.3s ease;
        }

        .contact-form-wrapper {
          background: var(--glass-bg);
          border: 1px solid var(--border-primary);
          border-radius: 24px;
          padding: 48px;
          backdrop-filter: blur(10px);
          box-shadow: 0 16px 40px var(--border-primary);
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-right: 4px;
          text-align: right;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          background: var(--bg-primary);
          border: 1px solid var(--border-secondary);
          border-radius: 12px;
          padding: 16px 20px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 15px;
          transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s;
          outline: none;
          text-align: right;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: var(--text-tertiary);
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          background: var(--bg-secondary);
          border-color: var(--color-toxic-green);
          box-shadow: 0 0 0 2px var(--border-primary);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: var(--text-primary);
          color: var(--bg-primary);
          border: none;
          border-radius: 12px;
          padding: 18px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s;
          margin-top: 8px;
          font-family: inherit;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--border-secondary);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 14px;
          transform: scaleX(-1); /* Flips arrow for RTL */
        }

        .status-message {
          margin-top: 16px;
          padding: 14px;
          border-radius: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        .status-message.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-toxic-green);
          border: 1px solid var(--border-secondary);
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 768px) {
          .contact-inner {
            padding: 0 24px;
          }

          .contact-heading {
            font-size: clamp(32px, 8vw, 42px);
          }

          .contact-form-wrapper {
            padding: 32px 24px;
          }
        }
      `}</style>
    </section>
  );
}
