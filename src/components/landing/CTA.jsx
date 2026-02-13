import React from "react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 px-6 bg-dark-900 text-silver-200 overflow-hidden">

      {/* Glow subtil */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[700px] bg-silver-300 opacity-5 blur-[200px] rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">
          <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
            Un outil essentiel pour les resellers
          </span>
        </h2>

        <p className="text-silver-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
          Générez des factures, tickets et documents professionnels en quelques secondes.
          Optimisez votre temps, augmentez votre crédibilité et développez votre activité
          grâce à une solution complète à prix réduit.
        </p>

        {/* Avantages rapides */}
        <div className="flex flex-wrap justify-center gap-6 mb-14 text-sm text-silver-400">
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            ✔ Production rapide
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            ✔ Export PNG & PDF HD
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            ✔ Accès bibliothèque communautaire
          </span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
            ✔ Prix accessible
          </span>
        </div>

        {/* Bouton principal */}
        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 rounded-2xl text-lg font-medium
          bg-glass-bg backdrop-blur-2xl
          border border-glass-border
          text-silver-100
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          hover:bg-white/10
          hover:scale-[1.03]
          transition-all duration-300"
        >
          Commencer maintenant
        </button>

        {/* Sous-texte */}
        <p className="mt-6 text-silver-500 text-sm">
          Accès instantané • Sans installation • Interface rapide et moderne
        </p>

      </div>
    </section>
  );
};

export default CTA;
