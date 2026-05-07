import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const STATUS_CONFIG = {
  pending:   { color: "#FFD764", bg: "rgba(255,215,100,0.1)", label: "PENDING" },
  approved:  { color: "#10B981", bg: "rgba(16,185,129,0.1)",  label: "APPROVED" },
  rejected:  { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   label: "REJECTED" },
  completed: { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)",  label: "COMPLETED" },
};

export default function PetitionerDashboard({ token, onLogout }) {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [view, setView] = useState("submit"); // "submit" | "status"
  const [processResult, setProcessResult] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const processText = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    setProcessResult(null);
    try {
      const res = await axios.post(`${API}/process-text`, null, { params: { text } });
      setProcessResult(res.data);
      notify(`${res.data.tasks?.length || 0} tasks successfully extracted by AI`);
    } catch { notify("Processing failed. Check if backend is running.", "error"); }
    setProcessing(false);
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks/all-status`, { headers: { token } });
      setTasks(res.data);
    } catch { notify("Failed to load task status", "error"); }
    setLoading(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 200,
          background: notification.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(139,92,246,0.9)",
          padding: "12px 24px", borderRadius: 4, fontSize: 13, fontFamily: "monospace",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease",
        }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: "24px 48px", borderBottom: "1px solid rgba(139,92,246,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(139,92,246,0.03)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.25em", color: "#A78BFA", fontFamily: "monospace" }}>
              PETITIONER PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Judgment Submission</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onLogout} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(240,237,230,0.4)", padding: "8px 20px", borderRadius: 2,
            fontSize: 12, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
          }}>LOGOUT</button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        display: "flex", gap: 0, padding: "0 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {[
          { id: "submit", label: "Submit Judgment" },
          { id: "status", label: "Track Status" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setView(tab.id); if (tab.id === "status") loadStatus(); }}
            style={{
              background: "none", border: "none", borderBottom: `2px solid ${view === tab.id ? "#8B5CF6" : "transparent"}`,
              color: view === tab.id ? "#A78BFA" : "rgba(240,237,230,0.4)",
              padding: "16px 24px", fontSize: 12, letterSpacing: "0.12em",
              fontFamily: "monospace", cursor: "pointer", transition: "all 0.2s",
            }}
          >{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "40px 48px 80px" }}>
        {/* SUBMIT VIEW */}
        {view === "submit" && (
          <div style={{ maxWidth: 800 }}>
            <p style={{ fontSize: 14, color: "rgba(240,237,230,0.5)", marginBottom: 24, lineHeight: 1.7, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              Paste a court judgment below. Our AI will extract actionable compliance tasks with deadlines and route them into the verification pipeline.
            </p>

            <div style={{ position: "relative" }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste court judgment text here..."
                style={{
                  width: "100%", minHeight: 280, padding: "24px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: 4, color: "#f0ede6",
                  fontSize: 14, lineHeight: 1.8, resize: "vertical",
                  fontFamily: "Georgia, serif",
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(139,92,246,0.2)"}
              />
              <div style={{
                position: "absolute", bottom: 12, right: 16,
                fontSize: 11, fontFamily: "monospace", color: "rgba(240,237,230,0.2)",
              }}>
                {wordCount} words
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
              <button
                onClick={processText}
                disabled={!text.trim() || processing}
                style={{
                  background: text.trim() ? "#8B5CF6" : "rgba(255,255,255,0.05)",
                  color: text.trim() ? "white" : "rgba(240,237,230,0.3)",
                  border: "none", padding: "14px 32px", borderRadius: 2,
                  fontSize: 12, letterSpacing: "0.15em", fontWeight: 700,
                  fontFamily: "monospace", cursor: text.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow: text.trim() ? "0 0 30px rgba(139,92,246,0.25)" : "none",
                }}
              >
                {processing ? "AI PROCESSING..." : "⚡ PROCESS WITH AI"}
              </button>
              {text && (
                <button onClick={() => { setText(""); setProcessResult(null); }} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(240,237,230,0.4)", padding: "14px 20px",
                  borderRadius: 2, fontSize: 12, fontFamily: "monospace", cursor: "pointer",
                }}>
                  CLEAR
                </button>
              )}
            </div>

            {/* AI Result */}
            {processResult && (
              <div style={{
                marginTop: 32, padding: 24,
                background: "rgba(139,92,246,0.05)",
                border: "1px solid rgba(139,92,246,0.2)", borderRadius: 4,
                animation: "fadeUp 0.4s ease",
              }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#A78BFA", fontFamily: "monospace", marginBottom: 16 }}>
                  AI EXTRACTION COMPLETE · {processResult.tasks?.length || 0} TASKS FOUND
                </div>
                {processResult.tasks?.map((t, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 4, padding: "16px 20px", marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,237,230,0.5)", lineHeight: 1.6 }}>{t.description}</div>
                    {t.deadline && (
                      <div style={{ marginTop: 8, fontSize: 11, color: "#FFD764", fontFamily: "monospace" }}>
                        DEADLINE: {t.deadline}
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 12, color: "rgba(240,237,230,0.4)", fontFamily: "monospace" }}>
                  Tasks submitted to Verifier queue for review.
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATUS VIEW */}
        {view === "status" && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "rgba(240,237,230,0.5)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                Track compliance status of all extracted tasks.
              </p>
              <button onClick={loadStatus} style={{
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
                color: "#A78BFA", padding: "8px 20px", borderRadius: 2,
                fontSize: 11, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
              }}>↻ REFRESH</button>
            </div>

            {/* Summary */}
            {tasks.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                  const count = tasks.filter(t => t.status === status).length;
                  return (
                    <div key={status} style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 4, padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: cfg.color, fontFamily: "monospace" }}>{count}</div>
                      <div style={{ fontSize: 10, color: cfg.color, letterSpacing: "0.15em", marginTop: 4, fontFamily: "monospace" }}>{cfg.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {loading && <div style={{ textAlign: "center", padding: 60, color: "rgba(240,237,230,0.3)", fontFamily: "monospace" }}>LOADING...</div>}

            {!loading && tasks.length === 0 && (
              <div style={{ textAlign: "center", padding: 80, border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
                <p style={{ color: "rgba(240,237,230,0.3)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em" }}>
                  NO TASKS FOUND · SUBMIT A JUDGMENT FIRST
                </p>
              </div>
            )}

            {tasks.map(t => {
              const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
              return (
                <div key={t.id} style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 4, padding: "20px 24px", marginBottom: 10,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(240,237,230,0.3)", fontFamily: "monospace", marginBottom: 4 }}>TASK #{t.id}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{t.title}</div>
                    {t.deadline && <div style={{ fontSize: 12, color: "#FFD764", fontFamily: "monospace", marginTop: 6 }}>DL: {t.deadline}</div>}
                  </div>
                  <div style={{
                    background: cfg.bg, border: `1px solid ${cfg.color}44`,
                    padding: "6px 14px", borderRadius: 2, flexShrink: 0,
                    fontSize: 11, letterSpacing: "0.15em", color: cfg.color, fontFamily: "monospace",
                  }}>
                    {cfg.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: rgba(240,237,230,0.2); }
      `}</style>
    </div>
  );
}