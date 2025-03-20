import React, { useState } from "react";
import { API_URL } from "./config";

interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function handleLogin() {
    setError(""); // ✅ Clear previous errors

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      setToken(data.token); // ✅ Update state with token
      console.log("Login successful!", data);
    } catch (error) {
      console.error("Error logging in:", error);
      setError((error as Error).message);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input 
        type="text" 
        placeholder="Username" 
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;