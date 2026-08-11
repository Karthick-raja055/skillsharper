import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Reports() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/scores/${user?.email}`
      );

      setScores(res.data);
      setLoading(false);
    } catch {
      alert("Failed to load reports");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading Reports...
      </div>
    );
  }

  const total =
    scores.reduce((sum, item) => sum + item.score, 0);

  const average =
    scores.length > 0
      ? Math.round(total / scores.length)
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-5xl font-bold text-[#14532D]">
            Performance Reports
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#14532D] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Dashboard
          </button>

        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Rounds Completed</p>
            <h2 className="text-4xl font-bold text-[#14532D] mt-2">
              {scores.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Overall Average</p>
            <h2 className="text-4xl font-bold text-[#14532D] mt-2">
              {average}%
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Performance</p>
            <h2 className="text-4xl font-bold text-[#14532D] mt-2">
              {average >= 80 ? "Excellent" :
               average >= 60 ? "Good" : "Average"}
            </h2>
          </div>

        </div>

        {/* Scores */}
        <div className="grid md:grid-cols-2 gap-6">

          {scores.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <div className="flex justify-between mb-4">

                <h2 className="text-2xl font-bold text-black">
                  {item.round_name}
                </h2>

                <h2 className="text-2xl font-bold text-[#14532D]">
                  {item.score}%
                </h2>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#14532D]"
                  style={{
                    width: `${item.score}%`
                  }}
                />
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}