import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const GlassSelect = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Select button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl
        bg-white/5 border border-white/10
        text-sm text-silver-100
        flex justify-between items-center"
      >
        {value || placeholder}
        <ChevronDown size={16} className={`transition ${open && "rotate-180"}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute mt-2 w-full rounded-xl
          bg-glass-bg backdrop-blur-2xl
          border border-glass-border
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          overflow-hidden z-50"
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-3 text-sm text-silver-100
              hover:bg-white/10 cursor-pointer transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlassSelect;