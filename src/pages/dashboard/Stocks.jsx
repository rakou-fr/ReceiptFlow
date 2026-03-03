import React, { useState, useEffect } from "react";
import {
  Package, TrendingUp, ShoppingCart, CheckCircle2,
  Clock, DollarSign, Eye, Edit3, Trash2, Image as ImageIcon,
  X, Plus, Save,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const fmtEur = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

const getToken = () => localStorage.getItem("token");

// ─── Helpers dates ────────────────────────────────────────────────────────────
const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const startOfNDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ─── Calculs ventes depuis les items ─────────────────────────────────────────
// Un item "vendu" = status === "sold" et soldAt renseigné
const computeSalesStats = (items) => {
  const sold = items.filter((i) => i.status === "sold" && i.soldAt);

  const todayStart = startOfDay();
  const weekStart = startOfNDaysAgo(7);
  const monthStart = startOfNDaysAgo(30);

  const filter = (from) =>
    sold.filter((i) => new Date(i.soldAt) >= from);

  const sum = (arr) =>
    arr.reduce((s, i) => s + (i.quantity || 1) * (i.sellPrice || 0), 0);

  const todayItems = filter(todayStart);
  const weekItems = filter(weekStart);
  const monthItems = filter(monthStart);

  return {
    today: todayItems.length,
    week: weekItems.length,
    month: monthItems.length,
    revenueToday: sum(todayItems),
    revenueWeek: sum(weekItems),
    revenueMonth: sum(monthItems),
  };
};

// ─── Modal d'édition ──────────────────────────────────────────────────────────
const EditModal = ({ item, onSave, onClose }) => {
  const isNew = !item._id;
  const [form, setForm] = useState({
    name: item?.name || "",
    group: item?.group || "",
    quantity: item?.quantity ?? 0,
    reserved: item?.reserved ?? 0,
    ordered: item?.ordered ?? 0,
    buyPrice: item?.buyPrice ?? 0,
    sellPrice: item?.sellPrice ?? 0,
    status: item?.status || "available",
    image: item?.image || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition";
  const labelClass = "text-[10px] text-white/40 mb-1 block";

  const marginEur = (form.sellPrice - form.buyPrice) * form.quantity;
  const marginPct = form.sellPrice > 0
    ? (((form.sellPrice - form.buyPrice) / form.sellPrice) * 100).toFixed(1)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">
            {isNew ? "Nouvel article" : "Modifier l'article"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nom de l'article *</label>
              <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Bague Argent 925" />
            </div>
            <div>
              <label className={labelClass}>Groupe / Catégorie</label>
              <input className={inputClass} value={form.group} onChange={(e) => set("group", e.target.value)} placeholder="Ex: Bijoux Classiques" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Quantité en stock</label>
              <input type="number" min="0" className={inputClass} value={form.quantity} onChange={(e) => set("quantity", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Réservé</label>
              <input type="number" min="0" className={inputClass} value={form.reserved} onChange={(e) => set("reserved", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>En commande</label>
              <input type="number" min="0" className={inputClass} value={form.ordered} onChange={(e) => set("ordered", Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Prix d'achat (€)</label>
              <input type="number" min="0" step="0.01" className={inputClass} value={form.buyPrice} onChange={(e) => set("buyPrice", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Prix de vente (€)</label>
              <input type="number" min="0" step="0.01" className={inputClass} value={form.sellPrice} onChange={(e) => set("sellPrice", Number(e.target.value))} />
            </div>
          </div>

          {(form.buyPrice > 0 || form.sellPrice > 0) && (
            <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Marge estimée</span>
              <span className={`text-xs font-semibold ${marginEur >= 0 ? "text-green-400" : "text-red-400"}`}>
                {fmtEur(marginEur)} ({marginPct}%)
              </span>
            </div>
          )}

          <div>
            <label className={labelClass}>Statut</label>
            <div className="flex gap-2">
              {[
                { v: "available", label: "Disponible", color: "text-green-400 border-green-400/30 bg-green-400/10" },
                { v: "ordered", label: "En commande", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
                { v: "sold", label: "Vendu", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
              ].map(({ v, label, color }) => (
                <button key={v} onClick={() => set("status", v)}
                  className={`flex-1 py-1.5 rounded-lg border text-[10px] font-medium transition ${form.status === v ? color : "text-white/30 border-white/10 bg-white/5 hover:bg-white/8"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>URL de l'image (optionnel)</label>
            <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
            {form.image && (
              <div className="mt-2 rounded-lg overflow-hidden border border-white/10 h-24 bg-white/5">
                <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={saving || !form.name.trim()}
            className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5">
            <Save size={11} />
            {saving ? "Enregistrement..." : isNew ? "Créer l'article" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, onClick }) => {
  const cfg = {
    available: { label: "Disponible", color: "text-green-400 bg-green-400/10 border-green-400/20" },
    ordered:   { label: "En commande", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    sold:      { label: "Vendu", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  };
  const { label, color } = cfg[status] || cfg.available;
  return (
    <button onClick={onClick} className={`px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-medium transition hover:opacity-80 ${color}`}>
      {label}
    </button>
  );
};

// ─── Stock Item Card ──────────────────────────────────────────────────────────
const StockItemCard = ({ item, onStatusChange, onEdit, onDelete }) => {
  const [showImage, setShowImage] = useState(false);
  const available = (item.quantity || 0) - (item.reserved || 0);
  const totalValue = (item.quantity || 0) * (item.buyPrice || 0);
  const potentialRevenue = (item.quantity || 0) * (item.sellPrice || 0);
  const margin = potentialRevenue - totalValue;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-[56px_1fr_auto] gap-2 p-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/[0.08] transition">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
          {item.image ? (
            <>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition" onClick={() => setShowImage(true)} />
              <button onClick={() => setShowImage(true)} className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white/80 hover:text-white transition">
                <Eye size={10} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={16} /></div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.name}</h3>
              <p className="text-[10px] sm:text-xs text-white/40 truncate">{item.group}</p>
            </div>
            <StatusBadge status={item.status} onClick={() => onStatusChange(item._id, item.status)} />
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[10px] sm:text-xs">
            <div><span className="text-white/30">Stock: </span><span className="text-white font-medium">{item.quantity}</span></div>
            <div><span className="text-white/30">Dispo: </span><span className={available > 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>{available}</span></div>
            <div><span className="text-white/30">Rés.: </span><span className="text-yellow-400 font-medium">{item.reserved}</span></div>
            <div><span className="text-white/30">Cmd: </span><span className="text-blue-400 font-medium">{item.ordered}</span></div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[10px] sm:text-xs pt-0.5 border-t border-white/5">
            <div><span className="text-white/30">Achat: </span><span className="text-white font-medium">{fmtEur(item.buyPrice)}</span></div>
            <div><span className="text-white/30">Vente: </span><span className="text-white font-medium">{fmtEur(item.sellPrice)}</span></div>
            <div><span className="text-white/30">Val.: </span><span className="text-white font-medium">{fmtEur(totalValue)}</span></div>
            <div><span className="text-white/30">Marge: </span><span className={margin >= 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>{fmtEur(margin)}</span></div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-1 justify-end">
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition" title="Modifier">
            <Edit3 size={12} />
          </button>
          <button onClick={() => onDelete(item._id)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition" title="Supprimer">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {showImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowImage(false)}>
          <div className="relative max-w-2xl w-full">
            <button onClick={() => setShowImage(false)} className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
              <X size={20} />
            </button>
            <img src={item.image} alt={item.name} className="w-full h-auto rounded-2xl border border-white/20" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
export default function StockManagementPage() {
  const [stockItems, setStockItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── KPIs globaux (tous les items) ──
  const itemsArray = Array.isArray(stockItems) ? stockItems : [];
  const totalItems      = itemsArray.reduce((s, i) => s + (i.quantity || 0), 0);
  const availableItems  = itemsArray.reduce((s, i) => s + ((i.quantity || 0) - (i.reserved || 0)), 0);
  const orderedItems    = itemsArray.reduce((s, i) => s + (i.ordered || 0), 0);
  const totalValue      = itemsArray.reduce((s, i) => s + ((i.quantity || 0) * (i.buyPrice || 0)), 0);
  const potentialRevenue= itemsArray.reduce((s, i) => s + ((i.quantity || 0) * (i.sellPrice || 0)), 0);
  const totalMargin     = potentialRevenue - totalValue;
  const marginPercent   = potentialRevenue > 0 ? (totalMargin / potentialRevenue) * 100 : 0;

  // ── Stats ventes calculées depuis les items vendus ──
  const salesStats = computeSalesStats(itemsArray);

  // ── Top 3 par quantité décroissante (seulement les non-vendus) ──
  const top3 = [...itemsArray]
    .filter((i) => i.status !== "sold")
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 3);

  // ── Indicateurs ──
  const disponibilite = totalItems > 0 ? (availableItems / totalItems) * 100 : 0;

  useEffect(() => { fetchStock(); }, []);

  const fetchStock = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/stock`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStockItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur fetch stock:", err);
      setError("Impossible de charger le stock.");
      setStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => setEditItem({ name: "", group: "", quantity: 0, reserved: 0, ordered: 0, buyPrice: 0, sellPrice: 0, status: "available", image: "" });
  const handleEdit   = (item) => setEditItem(item);

  const handleSave = async (formData) => {
    try {
      const isNew = !editItem._id;
      const url    = isNew ? `${API_URL}/stock` : `${API_URL}/stock/${editItem._id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setStockItems((prev) => isNew ? [saved, ...prev] : prev.map((i) => i._id === saved._id ? saved : i));
      setEditItem(null);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const cycle = { available: "ordered", ordered: "sold", sold: "available" };
    try {
      const res = await fetch(`${API_URL}/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: cycle[currentStatus] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setStockItems((prev) => prev.map((i) => i._id === id ? updated : i));
    } catch (err) { console.error("Erreur status:", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      await fetch(`${API_URL}/stock/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      setStockItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) { console.error("Erreur suppression:", err); }
  };

  const filteredItems = itemsArray.filter((i) => filter === "all" || i.status === filter);

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col text-white overflow-hidden">

      {editItem && <EditModal item={editItem} onSave={handleSave} onClose={() => setEditItem(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-2 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg sm:text-xl font-semibold">Gestion du Stock</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden px-2 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] hover:bg-white/15 transition flex items-center gap-1">
              <TrendingUp size={12} /> Stats
            </button>
            <button onClick={handleCreate} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-xs hover:bg-white/15 transition flex items-center gap-1">
              <Plus size={12} /> Nouvel article
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {[
            { icon: <Package size={10} className="text-white/40" />,    label: "Stock",    value: totalItems,              color: "" },
            { icon: <CheckCircle2 size={10} className="text-green-400"/>,label: "Dispo",    value: availableItems,          color: "text-green-400" },
            { icon: <Clock size={10} className="text-yellow-400" />,    label: "Cmd",      value: orderedItems,            color: "text-yellow-400" },
            { icon: <DollarSign size={10} className="text-white/40" />, label: "Valeur",   value: fmtEur(totalValue),      color: "" },
            { icon: <TrendingUp size={10} className="text-white/40" />, label: "CA Pot.",  value: fmtEur(potentialRevenue),color: "" },
            { icon: <TrendingUp size={10} className={totalMargin >= 0 ? "text-green-400" : "text-red-400"} />, label: "Marge", value: fmtEur(totalMargin), color: totalMargin >= 0 ? "text-green-400" : "text-red-400" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl px-2 py-1.5">
              <div className="flex items-center gap-1 mb-0.5">{icon}<p className="text-[9px] text-white/40">{label}</p></div>
              <p className={`text-sm sm:text-base font-semibold truncate ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {[
            { key: "all",       label: "Tous",  count: itemsArray.length },
            { key: "available", label: "Dispo", count: itemsArray.filter((i) => i.status === "available").length },
            { key: "ordered",   label: "Cmd",   count: itemsArray.filter((i) => i.status === "ordered").length },
            { key: "sold",      label: "Vendu", count: itemsArray.filter((i) => i.status === "sold").length },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition whitespace-nowrap ${filter === key ? "bg-white/15 border border-white/25 text-white" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"}`}>
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-2 sm:gap-3 p-2 sm:p-3 overflow-hidden relative">

        {/* Liste */}
        <div className="flex-1 min-w-0 space-y-1.5 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-2" />
              <p className="text-xs">Chargement...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-400/70">
              <p className="text-xs">{error}</p>
              <button onClick={fetchStock} className="mt-2 text-[10px] underline hover:text-red-400">Réessayer</button>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <StockItemCard key={item._id} item={item} onStatusChange={handleStatusChange} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <Package size={40} className="mb-2 opacity-30" />
              <p className="text-xs">Aucun article</p>
              <button onClick={handleCreate} className="mt-3 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] hover:bg-white/15 transition flex items-center gap-1">
                <Plus size={10} /> Créer un article
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar droite ── */}
        <div className={`
          lg:block lg:relative lg:w-56 xl:w-64 flex-shrink-0 space-y-2 overflow-y-auto pr-1
          ${showSidebar ? "fixed" : "hidden"} lg:static
          inset-y-0 right-0 w-72 z-40 bg-black/95 backdrop-blur-xl border-l border-white/10 p-3 lg:p-0 lg:bg-transparent lg:border-0
        `}>
          <button onClick={() => setShowSidebar(false)} className="lg:hidden absolute top-2 right-2 p-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
            <X size={14} />
          </button>

          {/* Ventes calculées depuis les items vendus */}
          {[
            { title: "Ventes du jour",      icon: <ShoppingCart size={11} className="text-white/40" />, nb: salesStats.today,  ca: salesStats.revenueToday,  cls: "mt-8 lg:mt-0" },
            { title: "7 derniers jours",    icon: null, nb: salesStats.week,   ca: salesStats.revenueWeek,  cls: "" },
            { title: "30 derniers jours",   icon: null, nb: salesStats.month,  ca: salesStats.revenueMonth, cls: "" },
          ].map(({ title, icon, nb, ca, cls }) => (
            <div key={title} className={`rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-2 ${cls}`}>
              <h3 className="text-xs font-medium mb-1.5 flex items-center gap-1.5">{icon}{title}</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/50">Nombre</span>
                  <span className="text-sm font-semibold">{nb}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/50">CA</span>
                  <span className="text-sm font-semibold text-green-400">{fmtEur(ca)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Indicateurs */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-2">
            <h3 className="text-xs font-medium mb-1.5">Indicateurs</h3>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-white/50">Marge moy.</span>
                  <span className="text-[10px] font-semibold text-green-400">{marginPercent.toFixed(1)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${Math.min(marginPercent, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-white/50">Disponibilité</span>
                  <span className="text-[10px] font-semibold">{disponibilite.toFixed(0)}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${Math.min(disponibilite, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-white/50">Taux de vente</span>
                  <span className="text-[10px] font-semibold text-blue-400">
                    {itemsArray.length > 0 ? ((itemsArray.filter(i => i.status === "sold").length / itemsArray.length) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${itemsArray.length > 0 ? (itemsArray.filter(i => i.status === "sold").length / itemsArray.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top articles par quantité */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-2">
            <h3 className="text-xs font-medium mb-1.5">Top stock</h3>
            {top3.length === 0 ? (
              <p className="text-[10px] text-white/30">Aucun article disponible</p>
            ) : (
              <div className="space-y-1.5">
                {top3.map((item, idx) => {
                  const margin = ((item.sellPrice - item.buyPrice) / (item.sellPrice || 1)) * 100;
                  return (
                    <div key={item._id} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-medium text-white/50 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] truncate">{item.name}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-[9px] text-white/40">{item.quantity} en stock</p>
                          <span className="text-[9px] text-white/20">·</span>
                          <p className={`text-[9px] ${margin >= 0 ? "text-green-400/70" : "text-red-400/70"}`}>
                            {margin.toFixed(0)}% marge
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}