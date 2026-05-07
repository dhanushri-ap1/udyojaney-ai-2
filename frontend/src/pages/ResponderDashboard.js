import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function ResponderDashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks/approved`, { headers: { token } });
      setTasks(res.data);
    } catch { notify("Failed to load tasks", "error"); }
    setLoading(false);
  };

  const complete = async (id) => {
    setCompleting(id);
    try {
      await axios.post(`${API}/tasks/${id}/complete`, {}, { headers: { token } });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "completed" } : t));
      notify(`Task #${id} marked as completed`);
    } catch { notify("Action failed", "error"); }
    setCompleting(null);
  };

  useEffect(() => { loadTasks(); }, []);

  const activeTasks = tasks.filter(t => t.status === "approved");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const displayed = filter === "active" ? activeTasks : filter === "completed" ? completedTasks : tasks;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede6", fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 200,
          background: notification.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(16,185,129,0.9)",
          padding: "12px 24px", borderRadius: 4, fontSize: 13, fontFamily: "monospace",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease",
          color: "white",
        }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: "24px 48px", borderBottom: "1px solid rgba(16,185,129,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(16,185,129,0.03)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.25em", color: "#34D399", fontFamily: "monospace" }}>
              RESPONDER PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Compliance Execution</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={loadTasks} style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            color: "#34D399", padding: "8px 20px", borderRadius: 2,
            fontSize: 12, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
          }}>↻ REFRESH</button>
          <button onClick={onLogout} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(240,237,230,0.4)", padding: "8px 20px", borderRadius: 2,
            fontSize: 12, letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
          }}>LOGOUT</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, margin: "32px 48px" }}>
        {[
          { label: "Active Tasks", value: activeTasks.length, color: "#FFD764" },
          { label: "Completed", value: completedTasks.length, color: "#10B981" },
          { label: "Total Assigned", value: tasks.length, color: "#3B82F6" },
          { label: "Progress", value: tasks.length ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : "0%", color: "#8B5CF6" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 24px",
            borderRadius: i === 0 ? "4px 0 0 4px" : i === 3 ? "0 4px 4px 0" : 0,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(240,237,230,0.4)", letterSpacing: "0.15em", marginTop: 4, fontFamily: "monospace" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div style={{ padding: "0 48px", marginBottom: 32 }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(to right, #10B981, #34D399)",
              width: `${(completedTasks.length / tasks.length) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ fontSize: 10, color: "rgba(240,237,230,0.3)", fontFamily: "monospace", marginTop: 6, letterSpacing: "0.15em" }}>
            COMPLETION PROGRESS
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ padding: "0 48px", marginBottom: 24, display: "flex", gap: 8 }}>
        {[["all", "All Tasks"], ["active", "Active"], ["completed", "Completed"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            background: filter === id ? "rgba(16,185,129,0.1)" : "none",
            border: `1px solid ${filter === id ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: filter === id ? "#34D399" : "rgba(240,237,230,0.4)",
            padding: "7px 18px", borderRadius: 2, fontSize: 11,
            letterSpacing: "0.1em", fontFamily: "monospace", cursor: "pointer",
            transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ padding: "0 48px 80px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 80, color: "rgba(240,237,230,0.3)", fontFamily: "monospace", letterSpacing: "0.2em" }}>
            LOADING TASKS...
          </div>
        )}

        {!loading && displayed.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 4 }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✓</div>
            <p style={{ color: "rgba(240,237,230,0.3)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em" }}>
              {filter === "completed" ? "NO COMPLETED TASKS YET" : "NO ACTIVE TASKS · ALL DONE!"}
            </p>
          </div>
        )}

        {displayed.map(task => {
          const isCompleted = task.status === "completed";
          return (
            <div key={task.id} style={{
              background: isCompleted ? "rgba(16,185,129,0.03)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isCompleted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 4, padding: "24px", marginBottom: 10,
              transition: "all 0.2s", opacity: isCompleted ? 0.7 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, marginRight: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `1.5px solid ${isCompleted ? "#10B981" : "rgba(16,185,129,0.4)"}`,
                      background: isCompleted ? "#10B981" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "white", flexShrink: 0,
                    }}>
                      {isCompleted ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(240,237,230,0.3)", fontFamily: "monospace" }}>
                      TASK #{task.id}
                    </span>
                    <span style={{
                      fontSize: 10, letterSpacing: "0.15em", fontFamily: "monospace",
                      color: isCompleted ? "#10B981" : "#FFD764",
                      background: isCompleted ? "rgba(16,185,129,0.1)" : "rgba(255,215,100,0.1)",
                      padding: "2px 8px", borderRadius: 2,
                    }}>
                      {isCompleted ? "COMPLETED" : "ACTIVE"}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.3,
                    textDecoration: isCompleted ? "line-through" : "none",
                    color: isCompleted ? "rgba(240,237,230,0.5)" : "#f0ede6",
                  }}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,237,230,0.45)" }}>
                      {task.description}
                    </p>
                  )}
                  {task.deadline && (
                    <div style={{ marginTop: 10, fontSize: 11, color: "#FFD764", fontFamily: "monospace" }}>
                      DEADLINE: {task.deadline}
                    </div>
                  )}
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => complete(task.id)}
                    disabled={completing === task.id}
                    style={{
                      background: completing === task.id ? "#10B981" : "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.4)", color: "#34D399",
                      padding: "10px 20px", borderRadius: 2, fontSize: 12,
                      letterSpacing: "0.12em", fontFamily: "monospace",
                      cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {completing === task.id ? "SAVING..." : "✓ MARK DONE"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}