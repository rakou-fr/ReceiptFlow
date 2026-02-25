import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mockTemplates from "../../json/Models.json";

export default function InvoicePage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const previewRef = useRef(null);

  const filtered = mockTemplates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (tpl) => {
    setSelected(tpl);
    setFormData({});
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Télécharger le rendu en PNG */
  const downloadPNG = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${selected.name}_invoice.png`;
    link.click();
  };

  /** Télécharger le rendu en PDF */
  const downloadPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const dataURL = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataURL, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${selected.name}_invoice.pdf`);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-semibold mb-6">Créer une facture</h1>

      {!selected && (
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-300" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un modèle..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
          />
        </div>
      )}

      {!selected && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelect(tpl)}
              className="cursor-pointer rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl hover:scale-105 hover:border-white/20 transition"
            >
              <div className="w-full h-52 flex items-center justify-center overflow-hidden rounded-t-2xl">
                <img
                    src={tpl.image}
                    alt={tpl.name}
                    className="h-full object-contain"
                />
            </div>
              <div className="p-3 text-sm">{tpl.name}</div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-sm hover:bg-white/10 transition"
            >
              ← Changer de modèle
            </button>

            <p className="text-sm text-silver-300">Modèle : {selected.name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h2 className="text-xl font-medium">Informations facture</h2>

                {selected.fields.map((field) => (
                    <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.label}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
                    />
                ))}

                {/* Remplacement du bouton "Générer la facture" */}
                <div className="flex gap-4 mt-2">
                    <button
                    onClick={downloadPNG}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15"
                    >
                    Télécharger PNG
                    </button>
                    <button
                    onClick={downloadPDF}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15"
                    >
                    Télécharger PDF
                    </button>
                </div>
            </div>

            <div
                ref={previewRef}
                className="relative rounded-2xl overflow-hidden border border-white/10 w-full flex justify-center"
                style={{ maxHeight: "80vh" }}
                >
                <img
                    src={selected.image}
                    alt="preview"
                    className="w-full h-auto max-h-[75vh] object-contain"
                />

                {selected.fields.map((field) => (
                    <div
                    key={field.name}
                    style={{
                        position: "absolute",
                        top: `${field.y}%`,
                        left: `${field.x}%`,
                        transform:
                        field.align === "center"
                            ? "translate(-50%, -50%)"
                            : field.align === "right"
                            ? "translate(-100%, -50%)"
                            : "translate(0, -50%)",
                        fontSize: field.fontSize,
                        color: field.color,
                        fontWeight: field.fontWeight || 400,
                        textAlign: field.align || "left",
                        whiteSpace: "nowrap",
                    }}
                    >
                    {formData[field.name]}
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}