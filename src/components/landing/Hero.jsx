import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const images = useMemo(() => {
    const context = require.context(
      "../../assets/invoices",
      false,
      /\.(png|jpg|jpeg|webp)$/
    );
    return context.keys().map(context);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-dark-900 text-silver-200">

      {/* Glow argent subtil */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-silver-300 opacity-10 blur-[200px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* ================= COLONNE GAUCHE ================= */}
        <div>
          <h1 className="text-5xl md:text-6xl font-semibold mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              Générez vos factures
            </span>
            <br />
            <span className="text-silver-400">
              en quelques secondes
            </span>
          </h1>

          <p className="text-silver-400 max-w-lg mb-12 text-lg leading-relaxed">
            Créez, téléchargez et gérez plus de 300 factures rapidement.
            Une solution simple pour freelances et petites entreprises.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-2xl font-medium
            bg-glass-bg backdrop-blur-xl
            border border-glass-border
            text-silver-100
            hover:bg-white/10
            transition-all duration-300
            shadow-[0_8px_30px_rgba(0,0,0,0.4)]
            hover:scale-[1.03]"
          >
            Commencer
          </button>
        </div>

        {/* ================= COLONNE DROITE ================= */}
        <div
          className="relative h-[520px] overflow-hidden select-none"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        >
          {/* Bande gauche */}
          <div className="absolute left-0 w-1/2 space-y-8 animate-scrollSlow">
            {images.concat(images).map((src, i) => (
              <InvoiceImage key={`left-${i}`} src={src} />
            ))}
          </div>

          {/* Bande droite */}
          <div className="absolute right-0 w-1/2 space-y-8 animate-scrollSlow2">
            {images.concat(images).map((src, i) => (
              <InvoiceImage key={`right-${i}`} src={src} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const InvoiceImage = ({ src }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden
                    bg-glass-bg backdrop-blur-xl
                    border border-glass-border
                    shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                    p-4">

      <img
        src={src}
        alt="facture"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-[220px] object-contain pointer-events-none"
      />

      <div className="absolute inset-0 rounded-2xl 
                      bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default Hero;
