import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

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

      await api.post("/auth/register", form);

      alert("Registration Successful");
      navigate("/login");

    } catch (error) {
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center px-4">

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8"
      >

        <img
          src={logo}
          alt="SkillSharper"
          className="h-20 mx-auto mb-5 object-contain"
        />

        <h1 className="text-4xl font-bold text-black text-center mb-2">
          Join SkillSharper
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Create your student account
        </p>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 text-black outline-none focus:ring-2 focus:ring-[#14532D]"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 text-black outline-none focus:ring-2 focus:ring-[#14532D]"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 mb-6 text-black outline-none focus:ring-2 focus:ring-[#14532D]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#14532D] hover:bg-[#166534] text-white p-3 rounded-xl font-semibold transition"
        >
          {loading ? "Please wait..." : "Register"}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already user?{" "}
          <Link
            to="/login"
            className="text-[#14532D] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}