import React, { useEffect, useState } from "react";
import { FileText, Users, Layout, Plus, RefreshCw } from "lucide-react";

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalFactures: 0,
    clients: 0,
    modelesFacture: 0,
  });

  const [newsUpdates, setNewsUpdates] = useState([]);

  useEffect(() => {
    // Simuler fetch API
    setStats({
      totalFactures: 128,
      clients: 42,
      modelesFacture: 5,
    });

    setNewsUpdates([
      "Version 2.1 : Nouveau design épuré",
      "Ajout des modèles de facture personnalisés",
      "Optimisation du générateur PDF",
    ]);
  }, []);

  return (
    <div className="space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold text-silver-100">
          Bienvenue {user?.identifiant || "Utilisateur"} 👋
        </h1>
        <p className="text-silver-400 mt-2">
          Aperçu rapide de votre activité.
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FileText size={22} />}
          title="Factures"
          value={stats.totalFactures}
          subtitle="Générées"
        />
        <StatCard
          icon={<Users size={22} />}
          title="Clients"
          value={stats.clients}
          subtitle="Actifs"
        />
        <StatCard
          icon={<Layout size={22} />}
          title="Modèles"
          value={stats.modelesFacture}
          subtitle="Disponibles"
        />
      </div>

      {/* ===== ACTIONS RAPIDES ===== */}
      <div className="rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
        <h2 className="text-lg font-semibold text-silver-100 mb-4">
          Actions rapides
        </h2>

        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-white/10 hover:bg-white/20 
                             border border-white/15 transition-all">
            <Plus size={18} />
            Nouvelle facture
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-white/10 hover:bg-white/20 
                             border border-white/15 transition-all">
            Voir les reçus
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-white/10 hover:bg-white/20 
                             border border-white/15 transition-all">
            Ajouter un client
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-white/10 hover:bg-white/20 
                             border border-white/15 transition-all">
            Mettre à jour modèles
          </button>
        </div>
      </div>

      {/* ===== NEWS / UPDATES + VIDEO ===== */}
      <div className="md:flex md:gap-6 items-start">

        {/* Liste des news – 40% */}
        <div className="md:w-2/5 rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
          <h2 className="text-lg font-semibold text-silver-100 mb-4">
            Nouvelles mises à jour
          </h2>

          <ul className="space-y-2 text-sm text-silver-300">
            {newsUpdates.map((news, i) => (
              <li key={i} className="flex items-center gap-2">
                <RefreshCw size={14} className="text-brand" />
                <span>{news}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne vidéo – 60% */}
        <div className="mt-4 md:mt-0 md:w-3/5 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-56 md:h-7 lg:h-80"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Tutoriel vidéo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

    </div>
  );
};

// ===== COMPONENT STAT CARD =====
const StatCard = ({ icon, title, value, subtitle }) => {
  return (
    <div className="rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl 
                    border border-glass-border shadow-lg 
                    hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 text-silver-300 mb-3">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <div className="text-2xl font-bold text-silver-100">
        {value}
      </div>

      <div className="text-xs text-silver-400 mt-1">
        {subtitle}
      </div>
    </div>
  );
};

export default DashboardHome;
