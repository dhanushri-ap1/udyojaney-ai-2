import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import VerifierDashboard from "./pages/VerifierDashboard";
import PetitionerDashboard from "./pages/PetitionerDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";

// Page states: "landing" | "login" | "dashboard"

function App() {
  const [page, setPage] = useState("landing");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = (tok, rl) => {
    setToken(tok);
    setRole(rl);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
    setPage("landing");
  };

  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("login")} />;
  }

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} onBack={() => setPage("landing")} />;
  }

  if (page === "dashboard") {
    if (role === "verifier")   return <VerifierDashboard   token={token} onLogout={handleLogout} />;
    if (role === "responder")  return <ResponderDashboard  token={token} onLogout={handleLogout} />;
    if (role === "petitioner") return <PetitionerDashboard token={token} onLogout={handleLogout} />;
  }

  return null;
}

export default App;