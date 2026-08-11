import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim()
      });

      if (res.data.role !== "admin") {
        alert("Admin access only");
        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      navigate("/admin-dashboard");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Invalid Admin Login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-200"
      >

        <img
          src={logo}
          alt="SkillSharper"
          className="h-24 mx-auto mb-6"
        />

        <h1 className="text-4xl font-bold text-center text-[#14532D] mb-2">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Secure Administrator Access
        </p>

        <form onSubmit={submit}>

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl mb-5"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl mb-6"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
          >
            {loading ? "Checking..." : "Login"}
          </button>

        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 border border-[#14532D] text-[#14532D] py-4 rounded-xl font-semibold"
        >
          Student Login
        </button>

      </motion.div>

    </div>
  );
}