import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function TaskCard({ task, onApprove, onReject }) {
  const [hovered, setHovered] = useState(false);
  const [acting, setActing] = useState(null);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 4, padding: "24px", marginBottom: 12,
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1, marginRight: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#60A5FA", fontFamily: "monospace", marginBottom: 6 }}>
            TASK #{task.id}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f0ede6", marginBottom: 8, lineHeight: 1.3 }}>
            {task.title}
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,237,230,0.5)" }}>
            {task.description}
          </p>
        </div>
        {task.deadline && (
          <div style={{
            background: "rgba(255,215,100,0.08)", border: "1px solid rgba(255,215,100,0.2)",
            padding: "6px 12px", borderRadius: 2, flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#FFD764", fontFamily: "monospace" }}>DEADLINE</div>
            <div style={{ fontSize: 12, color: "#FFD764", fontFamily: "monospace", marginTop: 2 }}>{task.deadline}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={async () => { setActing("approve"); await onApprove(task.id); setActing(null); }}
          disabled={acting}
          style={{
            background: acting === "approve" ? "#10B981" : "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.4)", color: "#34D399",
            padding: "9px 20px", borderRadius: 2, fontSize: 12,
            letterSpacing: "0.12em", fontFamily: "monospace",
            cursor: "pointer", transition: "all 0.2s",
            fontWeight: acting === "approve" ? 700 : 500,
          }}
        >
          {acting === "approve" ? "APPROVING..." : "✓ APPROVE"}
        </button>
        <button
          onClick={async () => { setActing("reject"); await onReject(task.id); setActing(null); }}
          disabled={acting}
          style={{
            background: acting === "reject" ? "#EF4444" : "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5",
            padding: "9px 20px", borderRadius: 2, fontSize: 12,
            letterSpacing: "0.12em", fontFamily: "monospace",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          {acting === "reject" ? "REJECTING..." : "✗ REJECT"}
        </button>
      </div>
    </div>
  );
}

export default function VerifierDashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks/pending`, { headers: { token } });
      setTasks(res.data);
      setLoaded(true);
    } catch { notify("Failed to load tasks", "error"); }
    setLoading(false);
  };

  const approve = async (id) => {
    await axios.post(`${API}/tasks/${id}/approve`, {}, { headers: { token } });
    setTasks(t => t.filter(x => x.id !== id));
    notify(`Task #${id} approved and routed to Responders`);
  };

  const reject = async (id) => {
    await axios.post(`${API}/tasks/${id}/reject`, {}, { headers: { token } });
    setTasks(t => t.filter(x => x.id !== id));
    notify(`Task #${id} has been rejected`, "warn");
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 200,
          background: notification.type === "error" ? "rgba(239,68,68,0.9)" : notification.type === "warn" ? "rgba(245,158,11,0.9)" : "rgba(16,185,129,0.9)",
          padding: "12px 24px", borderRadius: 4, fontSize: 13,
          fontFamily: "monospace", letterSpacing: "0.05em",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease",
        }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: "24px 48px", borderBottom: "1px solid rgba(59,130,246,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(59,130,246,0.03)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.25em", color: "#60A5FA", fontFamily: "monospace" }}>
              VERIFIER PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Verification Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={loadTasks} style={{
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
            color: "#60A5FA", padding: "8px 20px", borderRadius: 2,
            fontSize: 12, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
          }}>
            ↻ REFRESH
          </button>
          <button onClick={onLogout} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(240,237,230,0.4)", padding: "8px 20px", borderRadius: 2,
            fontSize: 12, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
          }}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, margin: "0 48px", marginTop: 32, marginBottom: 32 }}>
        {[
          { label: "Pending Review", value: tasks.length, color: "#FFD764" },
          { label: "Queue Status", value: tasks.length > 0 ? "Active" : "Clear", color: "#10B981" },
          { label: "Your Role", value: "Verifier", color: "#3B82F6" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 24px", borderRadius: i === 0 ? "4px 0 0 4px" : i === 2 ? "0 4px 4px 0" : 0,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(240,237,230,0.4)", letterSpacing: "0.15em", marginTop: 4, fontFamily: "monospace" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div style={{ padding: "0 48px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "rgba(240,237,230,0.7)" }}>
            {loaded ? `${tasks.length} Task${tasks.length !== 1 ? "s" : ""} Pending Review` : "Loading..."}
          </h2>
        </div>

        {loading && <div style={{ textAlign: "center", padding: 80, color: "rgba(240,237,230,0.3)", fontFamily: "monospace", letterSpacing: "0.2em" }}>LOADING TASKS...</div>}

        {!loading && loaded && tasks.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 40px",
            border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 4,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>⚖</div>
            <p style={{ color: "rgba(240,237,230,0.3)", fontFamily: "monospace", letterSpacing: "0.15em", fontSize: 12 }}>
              NO PENDING TASKS · QUEUE IS CLEAR
            </p>
          </div>
        )}

        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onApprove={approve} onReject={reject} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}