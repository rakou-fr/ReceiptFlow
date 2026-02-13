import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import SupportButton from "../components/common/SupportButton";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant: username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiant ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ identifiant: data.identifiant })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erreur serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-silver-200">
      <Navbar />

      <section className="relative flex items-center justify-center px-6 pt-40 pb-20 overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-silver-300 opacity-5 blur-[200px] rounded-full" />

        <div className="relative z-10 w-full max-w-md">
          <div
            className="rounded-3xl p-8
            bg-glass-bg backdrop-blur-2xl
            border border-glass-border
            shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <h2 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              Connexion
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* IDENTIFIANT */}
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm
                bg-white/5
                border
                ${
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-white/20"
                }
                focus:outline-none
                text-silver-100`}
              />

              {/* MOT DE PASSE */}
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm
                bg-white/5
                border
                ${
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-white/20"
                }
                focus:outline-none
                text-silver-100`}
              />

              {/* MESSAGE ERREUR */}
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-medium
                bg-white/10 hover:bg-white/20
                border border-white/15
                text-silver-100
                transition-all duration-300
                hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="my-8 h-px bg-white/10" />

            <div className="text-center space-y-3">
              <p className="text-silver-400 text-sm">
                Pas encore client ?
              </p>

              <button
                onClick={() => navigate("/client")}
                className="inline-flex items-center gap-2 text-sm
                text-silver-200 hover:text-white
                transition"
              >
                Suivre les étapes pour devenir client
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SupportButton />
    </div>
  );
};

export default Login;
