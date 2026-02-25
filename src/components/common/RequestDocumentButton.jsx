import React, { useState } from "react";
import { X, FilePlus } from "lucide-react";

const RequestDocumentButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant (à gauche du support) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-24 z-50
        w-14 h-14 flex items-center justify-center
        rounded-full
        bg-glass-bg backdrop-blur-2xl
        border border-glass-border
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        hover:bg-white/10
        transition-all duration-300"
      >
        <FilePlus size={20} className="text-silver-200" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            className="relative w-full md:w-[480px]
            rounded-t-3xl md:rounded-3xl
            p-8
            bg-glass-bg backdrop-blur-2xl
            border border-glass-border
            shadow-[0_20px_60px_rgba(0,0,0,0.8)]
            animate-slideUp"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-silver-100">
                Demande de model de facture, ticket ou mail.
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} className="text-silver-300" />
              </button>
            </div>

            <form className="space-y-4">

            <input
                type="text"
                placeholder="Type de document (ex: facture, ticket, mail)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100"
              />

              <input
                type="text"
                placeholder="Marque (ex: Nike, Stussy, Dior)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100"
              />

              <input
                type="number"
                placeholder="Année ou version du modèle (ex: 2023)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100"
              />

              {/* Upload photo */}
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-silver-200"
              />

              <textarea
                rows="3"
                placeholder="Détails supplémentaires..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100 resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-medium
                bg-white/10 hover:bg-white/20
                border border-white/15
                text-silver-100 transition-all duration-300"
              >
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDocumentButton;