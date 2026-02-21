import React, { useState } from "react";
import { User, Image as ImageIcon, Save, Ticket, FileText, CreditCard } from "lucide-react";

const UsersPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    identifiant: "Utilisateur",
    profileImage: null,
  };

  const [pseudo, setPseudo] = useState(user.identifiant);
  const [profileImage, setProfileImage] = useState(user.profileImage);

  const stats = {
    factures: 128,
    creditsJour: 5,
    creditsMois: 120,
    tickets: 2,
  };

  const tickets = [
    {
      id: 1,
      sujet: "Problème PDF",
      message: "Mon PDF ne se génère pas correctement",
      reponse: "Nous avons corrigé le problème, merci de réessayer.",
      status: "Répondu",
    },
    {
      id: 2,
      sujet: "Bug interface",
      message: "Le bouton ne fonctionne pas",
      reponse: null,
      status: "Ouvert",
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      identifiant: pseudo,
      profileImage,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profil mis à jour");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-silver-100 flex items-center gap-3">
          <User size={28} />
          Mon profil
        </h1>
        <p className="text-silver-400 mt-2">
          Gérez vos informations et consultez votre activité.
        </p>
      </div>

      {/* Profil */}
      <div className="rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
        <h2 className="text-lg font-semibold text-silver-100 mb-6">
          Informations du profil
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-silver-400" />
              )}
            </div>

            <label className="text-sm cursor-pointer px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              Changer
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Infos */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm text-silver-400">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-silver-200 outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              <Save size={18} />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText size={20} />}
          title="Factures générées"
          value={stats.factures}
        />
        <StatCard
          icon={<CreditCard size={20} />}
          title="Crédits / jour"
          value={stats.creditsJour}
        />
        <StatCard
          icon={<CreditCard size={20} />}
          title="Crédits / mois"
          value={stats.creditsMois}
        />
        <StatCard
          icon={<Ticket size={20} />}
          title="Tickets ouverts"
          value={stats.tickets}
        />
      </div>

      {/* Tickets */}
      <div className="rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
        <h2 className="text-lg font-semibold text-silver-100 mb-4">
          Support
        </h2>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-silver-200 font-medium">
                  {ticket.sujet}
                </div>
                <div className="text-xs px-2 py-1 rounded bg-white/10">
                  {ticket.status}
                </div>
              </div>

              <div className="text-sm text-silver-400 mb-2">
                {ticket.message}
              </div>

              {ticket.reponse && (
                <div className="text-sm text-silver-300 border-t border-white/10 pt-2">
                  <strong>Admin :</strong> {ticket.reponse}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="rounded-2xl p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
      <div className="flex items-center gap-2 text-silver-400 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-2xl font-bold text-silver-100">{value}</div>
    </div>
  );
};

export default UsersPage;