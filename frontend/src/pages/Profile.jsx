import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full bg-[#14532D] text-white flex items-center justify-center text-4xl font-bold mb-6">
            {(user?.name || "S").charAt(0).toUpperCase()}
          </div>

          <h1 className="text-4xl font-bold text-black mb-2">
            {user?.name || "Student"}
          </h1>

          <p className="text-gray-500 text-lg mb-8">
            {user?.email || "No Email"}
          </p>

        </div>

        <div className="grid gap-5">

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-gray-500">Account Type</p>
            <h2 className="text-xl font-bold text-black">Student</h2>
          </div>

          <div className="bg-gray-100 p-5 rounded-2xl">
            <p className="text-gray-500">Platform Status</p>
            <h2 className="text-xl font-bold text-[#14532D]">Active</h2>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#14532D] text-white py-4 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>

          <button
            onClick={logout}
            className="bg-red-600 text-white py-4 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}