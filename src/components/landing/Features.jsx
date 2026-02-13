import React from "react";
import { FileText, Download, Database, Mail, Search, BookOpen } from "lucide-react";

const features = [
  {
    icon: <FileText size={22} />,
    title: "Génération instantanée",
    desc: "Créez vos factures en quelques clics grâce à une interface rapide, fluide et intuitive.",
  },
  {
    icon: <Download size={22} />,
    title: "Export haute qualité",
    desc: "Téléchargez vos documents en PNG ou PDF avec un rendu professionnel prêt à l’usage.",
  },
  {
    icon: <Database size={22} />,
    title: "Bibliothèque communautaire",
    desc: "Accédez à toutes les factures partagées par la communauté via une recherche rapide.",
  },
  {
    icon: <Mail size={22} />,
    title: "Envoi par email",
    desc: "Recevez vos documents directement par email en un clic.",
  },
  {
    icon: <Search size={22} />,
    title: "Recherche intelligente",
    desc: "Trouvez tickets de caisse, reçus, duplicatas ou certificats en quelques secondes.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Documentation complète",
    desc: "Accédez à une aide claire pour savoir quelles informations renseigner selon le document.",
  },
];

const Features = () => {
  return (
    <section className="relative py-28 px-6 bg-dark-900 text-silver-200 overflow-hidden">

      {/* Glow subtil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-silver-300 opacity-5 blur-[180px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              Une plateforme complète
            </span>
          </h2>

          <p className="text-silver-400 text-lg leading-relaxed">
            Générez, exportez, recherchez et partagez vos documents professionnels
            dans un environnement rapide, moderne et sécurisé.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {features.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-8
              bg-glass-bg backdrop-blur-2xl
              border border-glass-border
              shadow-[0_15px_50px_rgba(0,0,0,0.6)]
              transition-all duration-500
              hover:bg-white/[0.08]
              hover:-translate-y-1"
            >
              {/* Icône */}
              <div className="mb-6 w-12 h-12 flex items-center justify-center
                              rounded-xl bg-white/5 border border-white/10
                              text-silver-300 group-hover:text-white transition">
                {f.icon}
              </div>

              {/* Titre */}
              <h3 className="text-xl font-medium mb-3 text-silver-100">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-silver-400 leading-relaxed text-sm">
                {f.desc}
              </p>

              {/* Reflet subtil */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none
                              bg-gradient-to-t from-white/5 to-transparent opacity-0
                              group-hover:opacity-100 transition duration-500" />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Features;
