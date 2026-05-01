"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: "test-1",
    name: "ساني س.",
    role: "مهندس برمجيات أول",
    comment:
      "موسى مطور رائع للغاية. لقد عملت معه في تيراتشو وكان لديه شغف واهتمام لا مثيل له بالتفاصيل.",
  },
  {
    id: "test-2",
    name: "دانيال إ.",
    role: "مؤسس شركة ناشئة",
    comment:
      "موسى محترف ومبادر. لقد طور لنا موقعًا سريعًا للغاية وعالي الجودة، والتواصل معه كان ممتازًا.",
  },
  {
    id: "test-3",
    name: "الأمين أ.",
    role: "مطور تطبيقات هواتف",
    comment:
      "العمل مع موسى كان مذهلاً. هو يفهم المكدس الكامل ويستطيع تحويل أي متطلب معقد إلى كود يعمل بسلاسة.",
  },
  {
    id: "test-4",
    name: "شولا ي.",
    role: "مدير منتج",
    comment:
      "من أفضل المطورين الذين تعاملت معهم. دقة في المواعيد، وكود نظيف، وواجهة مستخدم جذابة للغاية.",
  },
];

export default function TestimonialsAr() {
  const sectionRef = useRef(null);
  const trackRef1 = useRef(null);
  const trackRef2 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".test-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".test-eyebrow",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".test-heading", {
        opacity: 0,
        y: 35,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".test-heading",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".test-sub", {
        opacity: 0,
        y: 15,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".test-sub",
          start: "top 90%",
          once: true,
        },
      });

      // Infinite marquee scroll
      const track1 = trackRef1.current;
      const track2 = trackRef2.current;

      if (track1 && track2) {
        gsap.to(track1, {
          xPercent: 100,
          repeat: -1,
          duration: 18,
          ease: "none",
        });

        gsap.to(track2, {
          xPercent: -100,
          repeat: -1,
          duration: 20,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="test-section">
      <div className="test-noise" />

      <div className="test-inner font-cairo">
        {/* ── Header ── */}
        <header className="test-header">
          <div className="test-eyebrow eyebrow font-el-messiri">
            <span className="eyebrowDot" />
            التقييمات
          </div>

          <h2 className="test-heading font-el-messiri">
            ماذا <em>يقول</em><br />الناس
          </h2>

          <p className="test-sub">
            ثقة العملاء والشركاء حول العالم.
          </p>
        </header>

        {/* ── Marquee rows ── */}
        <div className="test-marquee-wrapper">
          {/* Row 1 (RTL -> left to right) */}
          <div className="test-marquee-row">
            <div ref={trackRef1} className="test-marquee-track track-1">
              {[...testimonials, ...testimonials].map((item, i) => (
                <div key={`${item.id}-r1-${i}`} className="test-card">
                  <p className="test-comment">“{item.comment}”</p>
                  <hr className="test-rule" />
                  <div className="test-meta">
                    <span className="test-author font-el-messiri">{item.name}</span>
                    <span className="test-role">{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (LTR -> right to left) */}
          <div className="test-marquee-row">
            <div ref={trackRef2} className="test-marquee-track track-2">
              {[...testimonials, ...testimonials].map((item, i) => (
                <div key={`${item.id}-r2-${i}`} className="test-card">
                  <p className="test-comment">“{item.comment}”</p>
                  <hr className="test-rule" />
                  <div className="test-meta">
                    <span className="test-author font-el-messiri">{item.name}</span>
                    <span className="test-role">{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .test-section {
          position: relative;
          width: 100%;
          min-height: 80vh;
          padding: 130px 0 160px;
          background: #080808;
          overflow: hidden;
          font-family: var(--font-cairo), system-ui, -apple-system, sans-serif;
          color: #fff;
        }

        .test-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          opacity: 0.5;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
        }

        .test-inner {
          position: relative;
          z-index: 10;
        }

        .test-header {
          max-width: 680px;
          margin: 0 auto 72px;
          padding: 0 56px;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 28px;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .test-heading {
          font-family: var(--font-el-messiri), system-ui, sans-serif;
          font-size: clamp(42px, 6.5vw, 84px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -2px;
          color: #fff;
          margin-bottom: 22px;
        }

        .test-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .test-sub {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto;
        }

        .test-marquee-wrapper {
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
        }

        .test-marquee-row {
          position: relative;
          overflow: hidden;
          width: 100%;
          display: flex;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 15%,
            black 85%,
            transparent
          );
        }

        .test-marquee-track {
          display: flex;
          gap: 32px;
          white-space: nowrap;
          will-change: transform;
        }

        .test-card {
          flex-shrink: 0;
          width: 380px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 36px 36px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          cursor: default;
        }

        .test-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.16);
          transform: translateY(-2px);
        }

        .test-comment {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          white-space: normal;
          margin-bottom: 24px;
        }

        .test-rule {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin-bottom: 16px;
        }

        .test-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .test-author {
          font-family: var(--font-el-messiri), system-ui, sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
        }

        .test-role {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .test-header {
            padding: 0 24px;
            margin-bottom: 48px;
          }

          .test-marquee-wrapper {
            gap: 20px;
          }

          .test-card {
            width: 310px;
            padding: 24px 22px 20px;
          }
        }
      `}</style>
    </section>
  );
}
