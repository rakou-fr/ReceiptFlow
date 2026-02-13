import React, { useState } from "react";
import { X, LifeBuoy } from "lucide-react";

const SupportButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50
        w-14 h-14 flex items-center justify-center
        rounded-full
        bg-glass-bg backdrop-blur-2xl
        border border-glass-border
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        hover:bg-white/10
        transition-all duration-300"
      >
        <LifeBuoy size={20} className="text-silver-200" />
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
                Support
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
                placeholder="Nom"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100"
              />

              <textarea
                rows="4"
                placeholder="Votre message..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-silver-100 resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-medium
                bg-white/10 hover:bg-white/20
                border border-white/15
                text-silver-100 transition-all duration-300"
              >
                Envoyer le ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportButton;
