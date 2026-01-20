import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded p-6">

        <h1 className="text-2xl font-bold mb-4">
          Dashboard
        </h1>

        <p className="mb-4">
          Bienvenue <span className="font-semibold">{user?.username}</span>
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>

      </div>

    </div>
  );
};

export default Dashboard;
