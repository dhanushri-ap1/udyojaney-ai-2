import React, { useEffect, useRef, useState } from "react";

export default function LandingPage({ onEnter }) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#0a0a0a", color: "#f0ede6", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px",
        background: scrollY > 50 ? "rgba(10,10,10,0.92)" : "transparent",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,215,100,0.1)" : "none",
        backdropFilter: scrollY > 50 ? "blur(12px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD764, #FF8C42)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontWeight: "bold", fontSize: 14, color: "#0a0a0a"
          }}>U</div>
          <span style={{ fontSize: 16, letterSpacing: "0.08em", color: "#FFD764", fontFamily: "'Playfair Display', serif" }}>
            UdyojaneyAI
          </span>
        </div>
        <button
          onClick={onEnter}
          style={{
            background: "transparent", border: "1px solid #FFD764",
            color: "#FFD764", padding: "8px 24px", borderRadius: 2,
            fontFamily: "'Playfair Display', serif", fontSize: 13,
            letterSpacing: "0.12em", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.background = "#FFD764"; e.target.style.color = "#0a0a0a"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#FFD764"; }}
        >
          LOGIN →
        </button>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "flex-start",
        padding: "0 48px 0 80px", position: "relative", zIndex: 1,
      }}>
        {/* Gold accent line */}
        <div style={{
          position: "absolute", left: 48, top: "50%", transform: "translateY(-50%)",
          width: 3, height: "30vh", background: "linear-gradient(to bottom, transparent, #FFD764, transparent)",
        }} />

        <div style={{ maxWidth: 700, paddingLeft: 24, animation: "fadeUp 1s ease forwards", opacity: 0, animationDelay: "0.2s" }}>
          <p style={{
            fontSize: 11, letterSpacing: "0.3em", color: "#FFD764",
            textTransform: "uppercase", marginBottom: 20, fontFamily: "monospace"
          }}>
            AI-Powered Legal Compliance System
          </p>
          <h1 style={{
            fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1.05,
            fontWeight: 700, margin: "0 0 24px 0",
            background: "linear-gradient(135deg, #f0ede6 30%, #FFD764 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Justice<br />Should Not<br />Wait.
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: "rgba(240,237,230,0.65)",
            maxWidth: 520, marginBottom: 48, fontFamily: "Georgia, serif",
            fontStyle: "italic"
          }}>
            UdyojaneyAI transforms court judgments into structured, trackable action — 
            bridging the gap between legal orders and real compliance.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={onEnter}
              style={{
                background: "#FFD764", color: "#0a0a0a",
                border: "none", padding: "16px 40px", borderRadius: 2,
                fontSize: 14, letterSpacing: "0.15em", fontWeight: 700,
                cursor: "pointer", fontFamily: "monospace",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 0 40px rgba(255,215,100,0.2)",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(255,215,100,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(255,215,100,0.2)"; }}
            >
              ACCESS PORTAL
            </button>
            <a href="#mission" style={{
              background: "transparent", border: "1px solid rgba(240,237,230,0.2)",
              color: "#f0ede6", padding: "16px 40px", borderRadius: 2,
              fontSize: 14, letterSpacing: "0.15em", cursor: "pointer",
              fontFamily: "monospace", textDecoration: "none",
              display: "inline-flex", alignItems: "center",
              transition: "border-color 0.2s",
            }}>
              OUR MISSION ↓
            </a>
          </div>
        </div>

        {/* Floating decorative text */}
        <div style={{
          position: "absolute", right: -20, top: "50%", transform: "translateY(-50%) rotate(90deg)",
          fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,215,100,0.2)",
          fontFamily: "monospace", textTransform: "uppercase", whiteSpace: "nowrap"
        }}>
          PETITIONER · VERIFIER · RESPONDER · COMPLIANCE · JUSTICE
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{
        borderTop: "1px solid rgba(255,215,100,0.1)",
        borderBottom: "1px solid rgba(255,215,100,0.1)",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        padding: "40px 80px",
      }}>
        {[
          { num: "3", label: "Role-Based Portals" },
          { num: "AI", label: "Powered Task Extraction" },
          { num: "100%", label: "Compliance Tracking" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,215,100,0.1)" : "none", padding: "0 20px" }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#FFD764", lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(240,237,230,0.5)", marginTop: 8, fontFamily: "monospace", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* MISSION SECTION */}
      <section id="mission" style={{ padding: "120px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#FFD764", textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>
            Our Mission
          </p>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 48, maxWidth: 600 }}>
            Closing the Gap Between Judgment & Action
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(240,237,230,0.7)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                In India and across the world, court orders frequently go unimplemented — not from 
                negligence alone, but from lack of clear, structured follow-through mechanisms.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(240,237,230,0.7)", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 20 }}>
                UdyojaneyAI uses artificial intelligence to read court judgments, extract concrete 
                actionable tasks, and route them through a verified compliance pipeline.
              </p>
            </div>
            <div style={{ paddingLeft: 32, borderLeft: "1px solid rgba(255,215,100,0.2)" }}>
              {[
                { role: "Petitioner", desc: "Submits court judgments for AI processing and tracks all task statuses in real time.", color: "#8B5CF6" },
                { role: "Verifier", desc: "Reviews AI-extracted tasks, approves or rejects them before they enter the compliance pipeline.", color: "#3B82F6" },
                { role: "Responder", desc: "Executes approved tasks and marks them complete — creating a transparent accountability trail.", color: "#10B981" },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 32, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: r.color, fontFamily: "monospace", marginBottom: 6 }}>{r.role.toUpperCase()}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(240,237,230,0.6)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 80px 120px", background: "rgba(255,215,100,0.03)", borderTop: "1px solid rgba(255,215,100,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#FFD764", textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>
            The Pipeline
          </p>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 700, marginBottom: 64 }}>
            From Judgment to Completion
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { step: "01", title: "Submit", desc: "Petitioner pastes court judgment text into the portal" },
              { step: "02", title: "Extract", desc: "AI reads and extracts structured tasks with deadlines" },
              { step: "03", title: "Verify", desc: "Verifier reviews, approves, or rejects each task" },
              { step: "04", title: "Execute", desc: "Responder completes tasks and logs compliance" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "32px 24px",
                background: "#111",
                borderLeft: i === 0 ? "none" : "1px solid #1a1a1a",
                position: "relative",
              }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: "rgba(255,215,100,0.08)", lineHeight: 1, marginBottom: 16, fontFamily: "monospace" }}>{s.step}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#FFD764" }}>{s.title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,237,230,0.5)" }}>{s.desc}</div>
                {i < 3 && <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "rgba(255,215,100,0.3)", zIndex: 1 }}>›</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: "center", padding: "120px 48px",
        background: "radial-gradient(ellipse at center, rgba(255,215,100,0.06) 0%, transparent 70%)",
      }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 700, marginBottom: 24, lineHeight: 1.1 }}>
          Begin Your Session
        </h2>
        <p style={{ color: "rgba(240,237,230,0.5)", marginBottom: 40, fontSize: 16, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Select your role to access your dedicated compliance dashboard.
        </p>
        <button
          onClick={onEnter}
          style={{
            background: "#FFD764", color: "#0a0a0a", border: "none",
            padding: "18px 56px", fontSize: 14, letterSpacing: "0.15em",
            fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
            boxShadow: "0 0 60px rgba(255,215,100,0.25)",
            transition: "all 0.2s", borderRadius: 2,
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
        >
          ENTER PORTAL
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,215,100,0.1)",
        padding: "32px 80px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "rgba(240,237,230,0.3)", fontFamily: "monospace" }}>
          © 2026 UdyojaneyAI — AI-Powered Legal Compliance
        </span>
        <span style={{ fontSize: 12, color: "rgba(240,237,230,0.2)", fontFamily: "monospace" }}>
          JUSTICE THROUGH TECHNOLOGY
        </span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: rgba(255,215,100,0.3); }
      `}</style>
    </div>
  );
}