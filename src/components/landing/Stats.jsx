import React from "react";
import { Zap, Download, Users, Headphones, LayoutTemplate } from "lucide-react";

const stats = [
  {
    icon: <Zap size={22} />,
    value: "< 150ms",
    label: "Temps moyen de génération",
  },
  {
    icon: <Download size={22} />,
    value: "Instantané",
    label: "Téléchargement PNG & PDF HD",
  },
  {
    icon: <LayoutTemplate size={22} />,
    value: "200+",
    label: "Modèles de factures disponibles",
  },
  {
    icon: <Users size={22} />,
    value: "92%",
    label: "Clients satisfaits",
  },
  {
    icon: <Headphones size={22} />,
    value: "< 24h",
    label: "Support réactif",
  },
];

const Stats = () => {
  return (
    <section className="relative py-28 px-6 bg-dark-900 text-silver-200 overflow-hidden">

      {/* Glow subtil */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-silver-300 opacity-5 blur-[200px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              Performance & Fiabilité
            </span>
          </h2>
          <p className="text-silver-400">
            Une plateforme pensée pour la rapidité et la simplicité.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-5 gap-8">

          {stats.map((stat, i) => (
            <div
              key={i}
              className="group rounded-3xl p-8 text-center
              bg-glass-bg backdrop-blur-2xl
              border border-glass-border
              shadow-[0_15px_50px_rgba(0,0,0,0.6)]
              transition-all duration-500
              hover:bg-white/[0.08]
              hover:-translate-y-1"
            >
              <div className="mb-6 flex justify-center text-silver-300 group-hover:text-white transition">
                {stat.icon}
              </div>

              <p className="text-3xl font-semibold text-silver-100 mb-2">
                {stat.value}
              </p>

              <p className="text-silver-400 text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Stats;
