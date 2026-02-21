import React, { useState } from "react";
import { Search, FileText, Image as ImageIcon, X } from "lucide-react";

const GroupPage = () => {
  const [search, setSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  // Mock documents with preview images
  const documents = [
    {
      id: 1,
      marque: "Nike",
      article: "Air Max",
      user: "Jean",
      date: "2026-02-10",
      image: "https://imgv2-2-f.scribdassets.com/img/document/687786051/original/83e00eae7d/1?v=1",
    },
    {
      id: 2,
      marque: "Adidas",
      article: "Ultraboost",
      user: "Marie",
      date: "2026-02-12",
      image: "https://imgv2-1-f.scribdassets.com/img/document/691284435/original/c0cd2fd8ea/1?v=1",
    },
    {
      id: 3,
      marque: "Puma",
      article: "RS-X",
      user: "Paul",
      date: "2026-02-15",
      image: "https://imgv2-1-f.scribdassets.com/img/document/815292278/original/ce5cac4710/1?v=1",
    },
    {
        id: 4,
        marque: "Nike",
        article: "Air Max",
        user: "Jean",
        date: "2026-02-10",
        image: "https://imgv2-2-f.scribdassets.com/img/document/687786051/original/83e00eae7d/1?v=1",
      },
      {
        id: 5,
        marque: "Adidas",
        article: "Ultraboost",
        user: "Marie",
        date: "2026-02-12",
        image: "https://imgv2-1-f.scribdassets.com/img/document/691284435/original/c0cd2fd8ea/1?v=1",
      },
      {
        id: 6,
        marque: "Puma",
        article: "RS-X",
        user: "Paul",
        date: "2026-02-15",
        image: "https://imgv2-1-f.scribdassets.com/img/document/815292278/original/ce5cac4710/1?v=1",
      },
      {
        id: 7,
        marque: "Nike",
        article: "Air Max",
        user: "Jean",
        date: "2026-02-10",
        image: "https://imgv2-2-f.scribdassets.com/img/document/687786051/original/83e00eae7d/1?v=1",
      },
      {
        id: 8,
        marque: "Adidas",
        article: "Ultraboost",
        user: "Marie",
        date: "2026-02-12",
        image: "https://imgv2-1-f.scribdassets.com/img/document/691284435/original/c0cd2fd8ea/1?v=1",
      },
      {
        id: 9,
        marque: "Puma",
        article: "RS-X",
        user: "Paul",
        date: "2026-02-15",
        image: "https://imgv2-1-f.scribdassets.com/img/document/815292278/original/ce5cac4710/1?v=1",
      },
  ];

  const filteredDocs = documents.filter(
    (doc) =>
      doc.marque.toLowerCase().includes(search.toLowerCase()) ||
      doc.article.toLowerCase().includes(search.toLowerCase())
  );

  const downloadFile = (doc, format) => {
    alert(`Téléchargement ${doc.marque} ${doc.article} en ${format}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-silver-100">
          Documents de la communauté
        </h1>
        <p className="text-silver-400 mt-2">
          Consultez et téléchargez les documents générés par les utilisateurs.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-4 bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-silver-400" />
          <input
            type="text"
            placeholder="Rechercher par marque ou article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-silver-200 placeholder-silver-500"
          />
        </div>
      </div>

        {/* Grid View - Scrollable */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 
                        max-h-[70vh] overflow-y-auto p-2">
        {filteredDocs.map((doc) => (
            <div
            key={doc.id}
            className="bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-lg rounded-2xl p-4 flex flex-col items-center hover:shadow-xl transition-all"
            >
            <img
                src={doc.image}
                alt={`${doc.marque} ${doc.article}`}
                className="w-full h-64 object-contain rounded-lg mb-4 cursor-pointer"
                onClick={() => setPreviewDoc(doc)}
            />

            <div className="w-full text-center space-y-1">
                <div className="text-silver-200 font-semibold">{doc.marque}</div>
                <div className="text-silver-300">{doc.article}</div>
                <div className="text-silver-400 text-sm">{doc.user}</div>
                <div className="text-silver-400 text-sm">{doc.date}</div>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                onClick={() => downloadFile(doc, "PDF")}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                >
                <FileText size={16} /> PDF
                </button>

                <button
                onClick={() => downloadFile(doc, "PNG")}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                >
                <ImageIcon size={16} /> PNG
                </button>
            </div>
            </div>
        ))}
        </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-dark-900 rounded-2xl p-4 max-w-4xl w-full">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-silver-200 hover:text-white"
            >
              <X size={24} />
            </button>
            <img
              src={previewDoc.image}
              alt={`${previewDoc.marque} ${previewDoc.article}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="p-6 text-center text-silver-400">
          Aucun document trouvé
        </div>
      )}
    </div>
  );
};

export default GroupPage;
