import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4200);

    return () => clearTimeout(timer);
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

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      alert("Invalid Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ background: "#f0ede8" }}
          >
            {/* Background green fade */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.7 }}
              style={{ background: "#14532D" }}
            />

            {/* Circular Motion Animation */}
            <motion.div
              className="absolute"
              style={{ width: "70vmin", height: "70vmin" }}
            >
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#14532D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    times: [0, 0.3, 0.58, 0.72],
                    duration: 2.6,
                    delay: 0.3
                  }}
                />
              </svg>
            </motion.div>

            {/* Flying Dots */}
            {[
              { axis: "x", val: "46vw" },
              { axis: "x", val: "-46vw" },
              { axis: "y", val: "-46vh" },
              { axis: "y", val: "46vh" }
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  background: "#22c55e"
                }}
                initial={{ [dot.axis]: 0, opacity: 0 }}
                animate={{
                  [dot.axis]: [0, dot.val, dot.val, 0],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  times: [0, 0.35, 0.65, 0.9],
                  duration: 1.9,
                  delay: 0.5
                }}
              />
            ))}

            {/* Cross Lines */}
            <motion.div
              className="absolute"
              style={{
                height: 1.5,
                background: "#166534",
                borderRadius: 2
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: ["0vw", "88vw", "0vw"],
                opacity: [0, 0.55, 0]
              }}
              transition={{
                delay: 1.5,
                duration: 0.85
              }}
            />

            <motion.div
              className="absolute"
              style={{
                width: 1.5,
                background: "#166534",
                borderRadius: 2
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: ["0vh", "88vh", "0vh"],
                opacity: [0, 0.55, 0]
              }}
              transition={{
                delay: 1.5,
                duration: 0.85
              }}
            />

            {/* Logo */}
            <motion.img
              src={logo}
              alt="SkillSharper"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: [0.5, 1.12, 1]
              }}
              transition={{
                delay: 2.4,
                duration: 0.7
              }}
              className="absolute z-10"
              style={{
                width: "78vmin",
                height: "78vmin",
                maxWidth: 480,
                maxHeight: 480,
                objectFit: "contain"
              }}
            />

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.9,
                duration: 0.5
              }}
              className="absolute z-10 text-white font-bold tracking-[0.4em]"
              style={{
                top: "calc(50% + min(40vmin, 265px))"
              }}
            >
              SKILLSHARPER
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LOGIN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen grid lg:grid-cols-2 bg-[#14532D]"
      >
        {/* LEFT PANEL COMBINED PREMIUM */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">

          {/* Glow Layer 1 */}
          <motion.div
            animate={{
              x: [-60, 60, -60],
              y: [-20, 30, -20],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity
            }}
            className="absolute w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl"
          />

          {/* Glow Layer 2 */}
          <motion.div
            animate={{
              x: [50, -40, 50],
              y: [20, -20, 20],
              scale: [1.1, 1.35, 1.1]
            }}
            transition={{
              duration: 16,
              repeat: Infinity
            }}
            className="absolute w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl"
          />

          {/* Outer Orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[580px] h-[580px] border border-white/15 rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
          </motion.div>

          {/* Inner Orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-[430px] h-[430px] border border-white/12 rounded-full"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
          </motion.div>

          {/* Floating Stars */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -25, 0],
                opacity: [0.15, 0.75, 0.15]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${10 + i * 8}%`,
                top: `${12 + i * 7}%`
              }}
            />
          ))}

          {/* Center Logo */}
          <motion.img
            src={logo}
            alt="SkillSharper"
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity
            }}
            className="relative z-10 h-[410px] w-auto drop-shadow-2xl"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex justify-center items-center px-6 py-10 bg-[#F8FAFC]">
          <motion.form
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: showSplash ? 0 : 1,
              x: showSplash ? 100 : 0
            }}
            transition={{ duration: 1 }}
            onSubmit={submit}
            className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl"
          >
            <img
              src={logo}
              alt="SkillSharper"
              className="h-28 mx-auto mb-6"
            />

            <p className="text-center text-gray-500 mb-8 text-lg">
              Welcome back. Continue your success journey.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl mb-5"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl mb-6"
              required
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#14532D] text-white p-4 rounded-xl font-semibold text-lg"
            >
              {loading ? "Please wait..." : "Login"}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="w-full mt-4 border border-[#14532D] text-[#14532D] py-4 rounded-xl font-semibold"
            >
              Admin Login
            </button>

            <p className="text-center mt-6 text-gray-600">
              New user?{" "}
              <Link
                to="/register"
                className="text-[#14532D] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
}