import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Leaderboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/leaderboard"
    );

    setLeaders(res.data);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between mb-8">
          <h1 className="text-5xl font-bold text-[#14532D]">
            Leaderboard
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#14532D] text-white px-6 py-3 rounded-xl"
          >
            Dashboard
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="grid grid-cols-3 bg-[#14532D] text-white p-5 font-bold">
            <div>Rank</div>
            <div>Name</div>
            <div className="text-right">Score</div>
          </div>

          {leaders.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-3 p-5 border-b"
            >
              <div className="text-black font-bold">
                #{i + 1}
              </div>

              <div className="text-black font-semibold">
                {item.name}
              </div>

              <div className="text-right text-[#14532D] font-bold">
                {item.score}%
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}