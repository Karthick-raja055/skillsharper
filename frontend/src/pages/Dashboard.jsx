import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cards = [
    {
      title: "Aptitude Round",
      desc: "Logical & quantitative preparation",
      path: "/aptitude"
    },
    {
      title: "Technical Round",
      desc: "Coding challenges & DSA practice",
      path: "/technical"
    },
    {
      title: "Communication",
      desc: "Speech confidence & interview fluency",
      path: "/communication"
    },
    {
      title: "Group Discussion",
      desc: "AI based GD topic preparation",
      path: "/gd"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black flex">

      {/* Sidebar */}
      <aside className="w-72 bg-[#14532D] text-white p-6 hidden md:flex flex-col">

        <img
          src={logo}
          alt="SkillSharper"
          className="h-32 w-auto mb-10 object-contain mx-auto"
        />

        <div className="space-y-3 flex-1">

          <div className="p-3 rounded-xl bg-[#166534] text-white font-semibold">
            Dashboard
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="p-3 rounded-xl hover:bg-[#166534] cursor-pointer transition"
          >
            Profile
          </div>

          <div
            onClick={() => navigate("/reports")}
            className="p-3 rounded-xl hover:bg-[#166534] cursor-pointer transition"
          >
            Reports
          </div>

        </div>

        <button
          onClick={logout}
          className="w-full bg-white text-[#14532D] p-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Logout
        </button>

      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#F8FAFC] px-8 py-8 md:px-10 md:py-10 flex flex-col min-h-screen">

        {/* Welcome */}
        <div className="text-center mb-8">

          <h2 className="text-5xl font-bold text-black">
            Welcome, {user?.name || "Student"}
          </h2>

          <p className="text-gray-600 mt-3 text-lg">
            Continue your placement preparation journey
          </p>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 flex-1">

          {cards.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{
                y: -6,
                scale: 1.01
              }}
              transition={{
                duration: 0.2
              }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm min-h-[280px] flex flex-col justify-between text-center"
            >

              <div className="flex-1 flex flex-col justify-center">

                <h3 className="text-2xl font-bold text-black mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-base leading-7">
                  {item.desc}
                </p>

              </div>

              <button
                onClick={() => navigate(item.path)}
                className="w-full bg-[#14532D] hover:bg-[#166534] text-white py-3 rounded-xl font-semibold transition"
              >
                Start Round
              </button>

            </motion.div>
          ))}

        </div>

      </main>

    </div>
  );
}