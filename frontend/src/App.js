import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

// Reusable styles
const container = {
  fontFamily: "Arial",
  background: "#f4f6f8",
  minHeight: "100vh",
  padding: "20px",
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const button = (color) => ({
  background: color,
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  marginRight: "5px",
  cursor: "pointer",
});

function App() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const logout = () => {
    setToken("");
    setRole("");
    setTasks([]);
  };

  const login = async (username, password) => {
    const res = await axios.post(`${API}/login`, null, {
      params: { username, password }
    });
    setToken(res.data.token);
    setRole(res.data.role);
  };

  const getTasks = async (endpoint) => {
    const res = await axios.get(`${API}${endpoint}`, {
      headers: { token }
    });
    setTasks(res.data);
  };

  const processText = async () => {
    await axios.post(`${API}/process-text`, null, {
      params: { text }
    });
    alert("Tasks created!");
  };

  const approve = async (id) => {
    await axios.post(`${API}/tasks/${id}/approve`, {}, { headers: { token }});
    getTasks("/tasks/pending");
  };

  const reject = async (id) => {
    await axios.post(`${API}/tasks/${id}/reject`, {}, { headers: { token }});
    getTasks("/tasks/pending");
  };

  const complete = async (id) => {
    await axios.post(`${API}/tasks/${id}/complete`, {}, { headers: { token }});
    getTasks("/tasks/approved");
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div style={{ ...container, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...card, textAlign: "center", width: "300px" }}>
          <h2>UdyojaneyAI</h2>
          <p>Select Role</p>
          <button style={button("#3b82f6")} onClick={() => login("verifier1", "123")}>Verifier</button>
          <button style={button("#10b981")} onClick={() => login("responder1", "123")}>Responder</button>
          <button style={button("#8b5cf6")} onClick={() => login("petitioner1", "123")}>Petitioner</button>
        </div>
      </div>
    );
  }

  // COMMON HEADER
  const Header = ({ title }) => (
    <div style={{ marginBottom: "20px" }}>
      <h2>{title}</h2>
      <button style={button("#ef4444")} onClick={logout}>Logout</button>
    </div>
  );

  // VERIFIER
  if (role === "verifier") {
    return (
      <div style={container}>
        <Header title="Verifier Dashboard" />
        <button style={button("#3b82f6")} onClick={() => getTasks("/tasks/pending")}>
          Load Pending Tasks
        </button>

        {tasks.map(t => (
          <div key={t.id} style={card}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <button style={button("#10b981")} onClick={() => approve(t.id)}>Approve</button>
            <button style={button("#ef4444")} onClick={() => reject(t.id)}>Reject</button>
          </div>
        ))}
      </div>
    );
  }

  // RESPONDER
  if (role === "responder") {
    return (
      <div style={container}>
        <Header title="Responder Dashboard" />
        <button style={button("#10b981")} onClick={() => getTasks("/tasks/approved")}>
          Load Approved Tasks
        </button>

        {tasks.map(t => (
          <div key={t.id} style={card}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <button style={button("#3b82f6")} onClick={() => complete(t.id)}>Mark Complete</button>
          </div>
        ))}
      </div>
    );
  }

  // PETITIONER
  if (role === "petitioner") {
    return (
      <div style={container}>
        <Header title="Petitioner Dashboard" />

        <textarea
          style={{ width: "100%", height: "100px", marginBottom: "10px", padding: "10px" }}
          placeholder="Paste court judgment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button style={button("#8b5cf6")} onClick={processText}>
          Process Judgment
        </button>

        <button style={button("#374151")} onClick={() => getTasks("/tasks/all-status")}>
          View Status
        </button>

        {tasks.map(t => (
          <div key={t.id} style={card}>
            <h3>{t.title}</h3>
            <p>Status: <b>{t.status}</b></p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default App;