import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const box = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  margin: "10px 0",
  background: "#fff",
};

const button = {
  padding: "8px 12px",
  margin: "5px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

function App() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

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
    await axios.post(`${API}/tasks/${id}/approve`, {}, {
      headers: { token }
    });
    getTasks("/tasks/pending");
  };

  const reject = async (id) => {
    await axios.post(`${API}/tasks/${id}/reject`, {}, {
      headers: { token }
    });
    getTasks("/tasks/pending");
  };

  const complete = async (id) => {
    await axios.post(`${API}/tasks/${id}/complete`, {}, {
      headers: { token }
    });
    getTasks("/tasks/approved");
  };

  // LOGIN
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>UdyojaneyAI</h1>
        <button style={{ ...button, background: "#4CAF50", color: "white" }} onClick={() => login("verifier1", "123")}>Verifier</button>
        <button style={{ ...button, background: "#2196F3", color: "white" }} onClick={() => login("responder1", "123")}>Responder</button>
        <button style={{ ...button, background: "#9C27B0", color: "white" }} onClick={() => login("petitioner1", "123")}>Petitioner</button>
      </div>
    );
  }

  // VERIFIER
  if (role === "verifier") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Verifier Dashboard</h2>
        <button style={button} onClick={() => getTasks("/tasks/pending")}>Load Tasks</button>

        {tasks.map(t => (
          <div key={t.id} style={box}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <button style={{ ...button, background: "green", color: "white" }} onClick={() => approve(t.id)}>Approve</button>
            <button style={{ ...button, background: "red", color: "white" }} onClick={() => reject(t.id)}>Reject</button>
          </div>
        ))}
      </div>
    );
  }

  // RESPONDER
  if (role === "responder") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Responder Dashboard</h2>
        <button style={button} onClick={() => getTasks("/tasks/approved")}>Load Tasks</button>

        {tasks.map(t => (
          <div key={t.id} style={box}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <button style={{ ...button, background: "blue", color: "white" }} onClick={() => complete(t.id)}>Complete</button>
          </div>
        ))}
      </div>
    );
  }

  // PETITIONER
  if (role === "petitioner") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Petitioner Dashboard</h2>

        <textarea
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          placeholder="Paste judgment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button style={button} onClick={processText}>Process</button>

        <br /><br />
        <button style={button} onClick={() => getTasks("/tasks/all-status")}>View Status</button>

        {tasks.map(t => (
          <div key={t.id} style={box}>
            <h3>{t.title}</h3>
            <p>Status: {t.status}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default App;