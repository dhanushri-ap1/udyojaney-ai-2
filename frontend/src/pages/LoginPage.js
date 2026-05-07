import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const ROLES = [
  {
    id: "verifier",
    username: "verifier1",
    label: "Verifier",
    subtitle: "Review & Approve",
    desc: "Examine AI-extracted tasks from court judgments. Approve or reject before they enter the compliance pipeline.",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.3)",
    icon: "⚖",
    accent: "#60A5FA",
  },
  {
    id: "responder",
    username: "responder1",
    label: "Responder",
    subtitle: "Execute & Complete",
    desc: "View approved compliance tasks assigned by the court and mark them complete as they are fulfilled.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.3)",
    icon: "✓",
    accent: "#34D399",
  },
  {
    id: "petitioner",
    username: "petitioner1",
    label: "Petitioner",
    subtitle: "Submit & Track",
    desc: "Submit court judgment text for AI processing and monitor the real-time status of all extracted tasks.",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.3)",
    icon: "📋",
    accent: "#A78BFA",
  },
];

export default function LoginPage({ onLogin, onBack }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/login`, null, {
        params: { username: selected.username, password: "123" }
      });
      if (res.data.token) {
        onLogin(res.data.token, res.data.role);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch {
      setError("Cannot connect to server. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      fontFamily: "'Playfair Display', Georgia, serif",
      color: "#f0ede6", overflow: "hidden",
    }}>

      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", borderBottom: "1px solid rgba(255,215,100,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD764, #FF8C42)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontWeight: "bold", fontSize: 14, color: "#0a0a0a"
          }}>U</div>
          <span style={{ fontSize: 15, letterSpacing: "0.08em", color: "#FFD764" }}>UdyojaneyAI</span>
        </div>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "rgba(240,237,230,0.4)",
          cursor: "pointer", fontSize: 13, fontFamily: "monospace", letterSpacing: "0.1em",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => e.target.style.color = "#FFD764"}
          onMouseLeave={e => e.target.style.color = "rgba(240,237,230,0.4)"}
        >
          ← BACK
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", padding: "60px 48px",
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 56,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#FFD764", textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>
            Select Your Role
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1 }}>
            Who are you today?
          </h1>
          <p style={{ color: "rgba(240,237,230,0.4)", marginTop: 12, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15 }}>
            Each role unlocks a dedicated compliance workspace.
          </p>
        </div>

        {/* Role cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20,
          maxWidth: 900, width: "100%",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s ease 0.1s",
        }}>
          {ROLES.map((role, i) => {
            const isSelected = selected?.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelected(isSelected ? null : role)}
                style={{
                  background: isSelected ? role.bg : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? role.border : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 4, padding: "32px 24px",
                  cursor: "pointer", position: "relative",
                  transition: "all 0.25s ease",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isSelected ? `0 20px 40px ${role.color}22` : "none",
                  animationDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }
                }}
              >
                {isSelected && (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    width: 20, height: 20, borderRadius: "50%",
                    background: role.color, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700,
                  }}>✓</div>
                )}

                <div style={{ fontSize: 36, marginBottom: 16 }}>{role.icon}</div>

                <div style={{
                  fontSize: 11, letterSpacing: "0.2em", color: role.color,
                  textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6
                }}>
                  {role.subtitle}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#f0ede6" }}>
                  {role.label}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,237,230,0.5)" }}>
                  {role.desc}
                </p>

                <div style={{
                  marginTop: 24, paddingTop: 20,
                  borderTop: `1px solid ${isSelected ? role.border : "rgba(255,255,255,0.06)"}`,
                  fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em",
                  color: isSelected ? role.color : "rgba(240,237,230,0.3)",
                  transition: "all 0.2s",
                }}>
                  {isSelected ? "SELECTED →" : "CLICK TO SELECT"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 24, padding: "12px 24px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 4, fontSize: 13, color: "#FCA5A5", fontFamily: "monospace",
          }}>
            {error}
          </div>
        )}

        {/* Login button */}
        <div style={{
          marginTop: 40,
          opacity: mounted ? 1 : 0,
          transition: "all 0.7s ease 0.2s",
        }}>
          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            style={{
              background: selected ? "#FFD764" : "rgba(255,255,255,0.05)",
              color: selected ? "#0a0a0a" : "rgba(240,237,230,0.3)",
              border: "none", padding: "16px 64px", borderRadius: 2,
              fontSize: 13, letterSpacing: "0.15em", fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
              fontFamily: "monospace", transition: "all 0.25s",
              boxShadow: selected ? "0 0 40px rgba(255,215,100,0.2)" : "none",
            }}
          >
            {loading ? "AUTHENTICATING..." : selected ? `ENTER AS ${selected.label.toUpperCase()} →` : "SELECT A ROLE FIRST"}
          </button>
        </div>

        <p style={{ marginTop: 24, fontSize: 11, color: "rgba(240,237,230,0.2)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
          DEMO · ALL ROLES USE PRESET CREDENTIALS
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}