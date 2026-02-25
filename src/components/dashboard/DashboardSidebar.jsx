import React, { useState } from "react";
import { Home, Users, FileText, Settings, LogOut, Menu, X, Ticket, Mail, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Accueil", icon: <Home size={20} />, path: "/dashboard" },
    {},
    { label: "Facture", icon: <FileText size={20} />, path: "/dashboard/receipts" },
    // { label: "Ticket de caisse", icon: <Ticket size={20} />, path: "/dashboard/ticket" },
    // { label: "Mail", icon: <Mail size={20} />, path: "/dashboard/mail" },
    { label: "Communauté", icon: <Users size={20} />, path: "/dashboard/group" },
    {},
    { label: "Mon compte", icon: <Settings size={20} />, path: "/dashboard/users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-screen 
                      bg-glass-bg backdrop-blur-2xl 
                      border border-glass-border shadow-[0_15px_50px_rgba(0,0,0,0.6)] 
                      text-silver-200 flex-col">
        {/* Logo */}
        <div className="text-center py-6 font-bold text-xl border-b border-glass-border 
                        bg-gradient-to-r from-silver-100 via-silver-300 to-silver-500 bg-clip-text text-transparent">
          FTMRFlow
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
                         hover:bg-white/10 transition-all duration-300"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-glass-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
                       hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 
                      bg-glass-bg backdrop-blur-2xl border-b border-glass-border
                      shadow-[0_10px_30px_rgba(0,0,0,0.5)] fixed w-full z-50">
        <div className="font-bold text-lg text-silver-100">FTMRFlow</div>
        <button onClick={() => setOpen(true)}>
          <Menu size={24} className="text-silver-200" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="relative w-64 h-full bg-glass-bg backdrop-blur-2xl 
                          border border-glass-border shadow-[0_15px_50px_rgba(0,0,0,0.6)] 
                          text-silver-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="font-bold text-xl text-silver-100">FTMRFlow</div>
              <button onClick={() => setOpen(false)}>
                <X size={24} className="text-silver-200" />
              </button>
            </div>

            <nav className="flex-1 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
                             hover:bg-white/10 transition-all duration-300"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl
                           hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
