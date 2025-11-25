import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/login", form);
    login(data);
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="bg-white shadow-md p-6 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="w-full bg-blue-600 text-white p-2 rounded mt-2">
        Login
      </button>
    </form>
  );
}
