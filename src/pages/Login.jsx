import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {

      const user = {
        username,
        role: "admin"
      };

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");

    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">

      <h2 className="text-2xl font-bold mb-4 text-center">
        Connexion
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">

        <div>
          <input
            className="w-full border p-2 rounded"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Se connecter
        </button>

      </form>
    </div>
  );
};

export default Login;
