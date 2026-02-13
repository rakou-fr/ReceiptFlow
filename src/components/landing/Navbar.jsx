import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4">
        <div
          className="max-w-7xl mx-auto flex items-center justify-between
          rounded-2xl px-6 py-3
          bg-glass-bg backdrop-blur-2xl
          border border-glass-border
          shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer text-lg font-semibold tracking-tight"
          >
            <span className="bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              FTMR Flow
            </span>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-silver-300 hover:text-white transition text-sm"
            >
              Se connecter
            </button>

            <button
              onClick={() => navigate("/Client")}
              className="px-5 py-2 rounded-xl text-sm font-medium
              bg-white/10 hover:bg-white/20
              border border-white/15
              text-silver-100
              transition-all duration-300"
            >
              Devenir client
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden text-silver-200"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col">

          {/* Top bar */}
          <div className="flex justify-between items-center p-6">
            <span className="text-lg font-semibold bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
              ReceiptFlow
            </span>

            <button onClick={() => setOpen(false)}>
              <X size={28} className="text-silver-200" />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex flex-col items-center justify-center flex-1 gap-8 text-lg">

            <button
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
              className="text-silver-300 hover:text-white transition"
            >
              Se connecter
            </button>

            <button
              onClick={() => {
                navigate("/Client");
                setOpen(false);
              }}
              className="px-8 py-3 rounded-2xl
              bg-glass-bg backdrop-blur-2xl
              border border-glass-border
              text-silver-100
              shadow-[0_8px_30px_rgba(0,0,0,0.6)]
              hover:bg-white/10
              transition-all duration-300"
            >
              Devenir client
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
