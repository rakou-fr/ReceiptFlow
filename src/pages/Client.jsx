import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import { MessageCircle, ShoppingCart, Bot, LogIn } from "lucide-react";
import SupportButton from "../components/common/SupportButton";

const DISCORD_LINK = "https://discord.gg/TONLIEN";
const WHOP_LINK = "https://whop.com/TONLIEN";

const steps = [
  {
    icon: <MessageCircle size={22} />,
    title: "Rejoindre le Discord",
    desc: "Intégrez notre communauté privée pour accéder aux informations, annonces et support.",
    button: {
      label: "Rejoindre Discord",
      link: DISCORD_LINK,
    },
  },
  {
    icon: <ShoppingCart size={22} />,
    title: "Souscrire via Whop",
    desc: "Rendez-vous sur la page de vente Whop et choisissez l’abonnement adapté à vos besoins.",
    button: {
      label: "Accéder à Whop",
      link: WHOP_LINK,
    },
  },
  {
    icon: <Bot size={22} />,
    title: "Réception des identifiants",
    desc: "Notre bot Discord vous enverra automatiquement vos identifiants d’accès au site.",
  },
  {
    icon: <LogIn size={22} />,
    title: "Connexion & utilisation",
    desc: "Connectez-vous à votre espace client et commencez à générer vos documents immédiatement.",
  },
];

const Client = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 text-silver-200">
      <Navbar />

      <section className="relative pt-40 pb-32 px-6 overflow-hidden">

        {/* Glow subtil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-silver-300 opacity-5 blur-[220px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
                Comment devenir client ?
              </span>
            </h1>

            <p className="text-silver-400 text-lg leading-relaxed">
              Suivez ces étapes simples pour accéder à la plateforme et commencer à générer vos documents professionnels.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-8">

            {steps.map((step, i) => (
              <div
                key={i}
                className="relative rounded-3xl p-8
                bg-glass-bg backdrop-blur-2xl
                border border-glass-border
                shadow-[0_15px_50px_rgba(0,0,0,0.6)]
                hover:bg-white/[0.08]
                transition-all duration-500"
              >
                {/* Numéro */}
                <div className="absolute -top-5 -left-5 w-12 h-12 flex items-center justify-center
                                rounded-full bg-dark-800 border border-glass-border
                                text-silver-300 font-semibold shadow-lg">
                  {i + 1}
                </div>

                {/* Icône */}
                <div className="mb-6 text-silver-300">
                  {step.icon}
                </div>

                {/* Titre */}
                <h3 className="text-xl font-medium mb-3 text-silver-100">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-silver-400 text-sm leading-relaxed mb-6">
                  {step.desc}
                </p>

                {/* Bouton optionnel */}
                {step.button && (
                  <a
                    href={step.button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-xl text-sm font-medium
                    bg-white/10 hover:bg-white/20
                    border border-white/15
                    text-silver-100
                    transition-all duration-300"
                  >
                    {step.button.label}
                  </a>
                )}
              </div>
            ))}

          </div>

          {/* CTA Final */}
          <div className="mt-24 text-center">

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
              Se connecter
            </button>

            <p className="mt-6 text-silver-500 text-sm">
              Accès rapide • Interface professionnelle • Support inclus
            </p>

          </div>

        </div>
      </section>
      <SupportButton />
    </div>
  );
};

export default Client;
