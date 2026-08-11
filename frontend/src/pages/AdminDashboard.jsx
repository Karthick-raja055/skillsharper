import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    admins: 0,
    reports: 0
  });

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await api.get(
        "/admin/stats"
      );

      const studentRes = await api.get(
        "/admin/students"
      );

      setStats(statsRes.data);
      setStudents(studentRes.data);

    } catch {
      alert("Access denied");
      navigate("/admin-login");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const createAdmin = async () => {
    try {
      await api.post(
        "/admin/create-admin",
        form
      );

      alert("Admin created");

      setForm({
        name: "",
        email: "",
        password: ""
      });

      loadData();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed"
      );
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await api.delete(
      `/admin/delete-student/${id}`
    );

    loadData();
  };

  const resetPassword = async (id, name) => {
    try {
      const res = await api.post(
        `/admin/reset-password/${id}`
      );

      alert(
        `${name} New Temporary Password:\n\n${res.data.temp_password}`
      );

    } catch {
      alert("Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        <div className="bg-white rounded-3xl shadow p-6 flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold text-[#14532D]">
              Admin Portal
            </h1>

            <p className="text-black mt-1">
              Manage students, admins and reports
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-black">
              Total Students
            </p>
            <h2 className="text-4xl mt-3 font-bold text-[#14532D]">
              {stats.students}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-black">
              Total Admins
            </p>
            <h2 className="text-4xl mt-3 font-bold text-[#14532D]">
              {stats.admins}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-black">
              Reports Generated
            </p>
            <h2 className="text-4xl mt-3 font-bold text-[#14532D]">
              {stats.reports}
            </h2>
          </div>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <h2 className="text-2xl font-bold mb-5">
            Create Admin
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              className="border p-3 rounded-xl text-black"
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              className="border p-3 rounded-xl text-black"
            />

            <input
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              className="border p-3 rounded-xl text-black"
            />

          </div>

          <button
            onClick={createAdmin}
            className="mt-5 bg-[#14532D] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Create Admin
          </button>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-2xl font-bold text-black">
              Student Management
            </h2>

            <button
              onClick={loadData}
              className="bg-[#14532D] text-white px-5 py-2 rounded-xl"
            >
              Refresh
            </button>

          </div>

          <div className="overflow-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 w-20">ID</th>
                  <th className="w-60">Name</th>
                  <th>Email</th>
                  <th className="text-right w-64">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 font-medium">
                      {s.id}
                    </td>

                    <td className="font-semibold text-black">
                      {s.name}
                    </td>

                    <td className="text-black">
                      {s.email}
                    </td>

                    <td className="py-3">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            resetPassword(
                              s.id,
                              s.name
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          Reset
                        </button>

                        <button
                          onClick={() =>
                            deleteStudent(s.id)
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}