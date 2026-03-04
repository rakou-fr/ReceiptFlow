import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronLeft } from "lucide-react";
import jsPDF from "jspdf";
import mockTemplates from "../../json/Models.json";

export default function InvoicePage() {
  const [search,   setSearch  ] = useState("");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [scale,    setScale   ] = useState(1);

  const imgRef     = useRef(null);
  const wrapperRef = useRef(null);

  const filtered = mockTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = tpl => { setSelected(tpl); setFormData({}); setScale(1); };
  const handleChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  const updateScale = useCallback(() => {
    if (!imgRef.current || !selected) return;
    const renderedW = imgRef.current.getBoundingClientRect().width;
    if (renderedW && selected.naturalWidth) setScale(renderedW / selected.naturalWidth);
  }, [selected]);

  useEffect(() => {
    if (!imgRef.current) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(imgRef.current);
    return () => ro.disconnect();
  }, [selected, updateScale]);

  // ── Export canvas natif ───────────────────────────────────────
  const renderToCanvas = () =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const W = selected.naturalWidth;
        const H = selected.naturalHeight;
        const cv = document.createElement("canvas");
        cv.width = W; cv.height = H;
        const ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0, W, H);
        selected.fields.forEach(field => {
          const value = formData[field.name];
          if (!value) return;
          const fs = Math.max(4, field.fontSize || 28);
          const fw = field.fontWeight === "bold" ? "bold" : "normal";
          const ff = field.fontFamily ? `'${field.fontFamily}', Arial` : "Arial";
          ctx.save();
          ctx.font = `${fw} ${fs}px ${ff}`;
          ctx.fillStyle = field.color || "#000";
          ctx.globalAlpha = field.opacity !== undefined ? field.opacity : 1;
          ctx.textBaseline = "middle";
          ctx.textAlign = field.align || "left";
          String(value).split("\n").forEach((line, i, arr) => {
            ctx.fillText(line, field.x, field.y + (i - (arr.length - 1) / 2) * fs * 1.3);
          });
          ctx.restore();
        });
        resolve(cv);
      };
      img.onerror = reject;
      img.src = selected.image;
    });

  const downloadPNG = async () => {
    const cv = await renderToCanvas();
    const a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = `${selected.name}_invoice.png`;
    a.click();
  };

  const downloadPDF = async () => {
    const cv = await renderToCanvas();
    const pdf = new jsPDF({
      orientation: cv.width > cv.height ? "landscape" : "portrait",
      unit: "px", format: [cv.width, cv.height],
    });
    pdf.addImage(cv.toDataURL("image/png"), "PNG", 0, 0, cv.width, cv.height);
    pdf.save(`${selected.name}_invoice.pdf`);
  };

  const fieldStyle = field => {
    let transform = "translate(0, -50%)";
    if (field.align === "center") transform = "translate(-50%, -50%)";
    if (field.align === "right")  transform = "translate(-100%, -50%)";
    return {
      position: "absolute",
      left: field.x * scale + "px",
      top: field.y * scale + "px",
      transform,
      fontSize: Math.max(6, field.fontSize * scale) + "px",
      color: field.color,
      fontWeight: field.fontWeight || "normal",
      fontFamily: field.fontFamily ? `'${field.fontFamily}', sans-serif` : undefined,
      textAlign: field.align || "left",
      opacity: field.opacity !== undefined ? field.opacity : 1,
      whiteSpace: "pre-line",
      lineHeight: 1.3,
      pointerEvents: "none",
    };
  };

  // ─────────────────────────────────────────────────────────────
  // VUE SÉLECTION
  // Toute la page est fixe en hauteur — seule la grille de cartes scroll
  // ─────────────────────────────────────────────────────────────
  if (!selected) return (
    <div
      style={{ height: "100vh", overflow: "hidden" }}
      className="flex flex-col text-white"
    >
      {/* Header fixe */}
      <div className="flex-shrink-0 px-6 pt-5 pb-3">
        <h1 className="text-base font-semibold text-white/90 mb-3">Créer une facture</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un modèle…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 outline-none focus:border-white/20 transition"
          />
        </div>
      </div>

      {/* Grille scrollable — prend tout l'espace restant */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="grid grid-cols-4 gap-3">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => handleSelect(tpl)}
              className="cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-white/[0.03]">
                <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-2.5 py-2 text-xs text-white/50 group-hover:text-white/80 truncate transition">{tpl.name}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 py-12 text-center text-sm text-white/25">Aucun modèle trouvé</div>
          )}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // VUE ÉDITION
  // Toute la page tient en 100vh — aucun scroll global
  // Champs : grille 2 colonnes compacte
  // Aperçu : image contrainte pour tenir dans la hauteur restante
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{ height: "100%", overflow: "hidden" }}
      className="flex flex-col text-white"
    >
      {/* Topbar — fixe, très compact */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-white/[0.07]">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 transition"
        >
          <ChevronLeft size={13} />
          Modèles
        </button>
        <span className="text-white/15 text-xs">·</span>
        <span className="text-xs text-white/60 font-medium">{selected.name}</span>
        <div className="ml-auto flex gap-1.5">
          <button
            onClick={downloadPNG}
            className="px-2.5 py-1 text-xs rounded-md bg-white/6 hover:bg-white/12 border border-white/10 transition"
          >
            PNG
          </button>
          <button
            onClick={downloadPDF}
            className="px-2.5 py-1 text-xs rounded-md bg-white/6 hover:bg-white/12 border border-white/10 transition"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Corps principal — flex row, hauteur restante, overflow hidden */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Panneau gauche : champs en grille 2 col ── */}
        <div className="flex-shrink-0 flex flex-col overflow-hidden border-r border-white/[0.07]" style={{ width: 260 }}>
          <div className="flex-shrink-0 px-3 pt-3 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Champs</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {selected.fields.map(field => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/35 leading-none truncate" title={field.name}>
                    {field.name}
                  </label>
                  <input
                    type={field.type}
                    placeholder="—"
                    value={formData[field.name] || ""}
                    onChange={e => handleChange(field.name, e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 outline-none focus:border-white/25 transition placeholder-white/15 text-white/80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panneau droit : aperçu ── */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-3 bg-white/[0.015] min-w-0">
          <div
            ref={wrapperRef}
            className="relative rounded-lg overflow-hidden border border-white/10 shadow-xl"
            style={{ maxHeight: "100%", maxWidth: "100%", width: "" }}
          >
            <img
              ref={imgRef}
              src={selected.image}
              alt="preview"
              onLoad={updateScale}
              style={{
                display: "block",
                maxHeight: "calc(80vh - 56px)",
                maxWidth: "100%",
                width: "auto",
                height: "auto",
              }}
            />
            {selected.fields.map(field => (
              <div key={field.name} style={fieldStyle(field)}>
                {formData[field.name]}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}