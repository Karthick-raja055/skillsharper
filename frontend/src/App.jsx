import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Communication from "./pages/Communication";
import Aptitude from "./pages/Aptitude";
import Coding from "./pages/Coding";
import GD from "./pages/GD";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Leaderboard from "./pages/Leaderboard";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>

      {/* STUDENT */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/aptitude" element={<Aptitude />} />
      <Route path="/technical" element={<Coding />} />
      <Route path="/gd" element={<GD />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      {/* ADMIN */}
      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}