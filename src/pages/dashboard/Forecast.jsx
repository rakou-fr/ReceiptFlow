import React, { useState, useEffect, useRef } from "react";
import {
  Plus, CheckCircle2, AlertCircle, Edit3,
  Save, X, ChevronRight, Loader2, Package,
} from "lucide-react";

const API = "http://localhost:5000/api";

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.token || localStorage.getItem("token") || "";
  } catch {
    return localStorage.getItem("token") || "";
  }
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: getToken(),
  };
}

const fmtEur = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fmtPct = (n) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n) + "%";

function computeStats(g) {
  const items = Array.isArray(g?.items) ? g.items : [];
  const buyCostPerUnit = items.reduce((s, it) => s + (Number(it?.buyPrice) || 0), 0);
  const units = items.length > 0 ? Math.min(...items.map((it) => Number(it?.qty) || 1)) : 1;
  const sellPricePerUnit = Number(g?.sellPrice) || 0;
  const buyTotal = buyCostPerUnit * units;
  const revenue = sellPricePerUnit * units;
  const margin = revenue - buyTotal;
  const marginPerUnit = sellPricePerUnit - buyCostPerUnit;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : 0;
  const roi = buyTotal > 0 ? (margin / buyTotal) * 100 : 0;
  const totalCycle = (Number(g?.deliveryDays) || 0) + (Number(g?.saleDays) || 0) + (Number(g?.paymentDays) || 0);
  const cyclesPerYear = g?.reinvest && totalCycle > 0 ? 365 / totalCycle : 1;
  const annualROI = roi * cyclesPerYear;
  const finalValue = g?.reinvest && buyTotal > 0
    ? buyTotal * Math.pow(1 + margin / buyTotal, cyclesPerYear)
    : buyTotal + margin;
  const profitPerYear = g?.reinvest ? finalValue - buyTotal : margin * cyclesPerYear;
  return { buyCostPerUnit, units, buyTotal, revenue, margin, marginPerUnit, marginPct, roi, annualROI, totalCycle, cyclesPerYear, finalValue, profitPerYear };
}

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10
                backdrop-blur-xl text-white placeholder-white/20 outline-none text-xs sm:text-sm
                focus:border-white/25 focus:bg-white/8 transition
                [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none ${className}`}
  />
);

// ─── Detail View ──────────────────────────────────────────────────────────────
function DetailView({ group: initialGroup, onBack, onGroupUpdated, onGroupDeleted }) {
  const [group, setGroup] = useState(initialGroup);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(initialGroup?.name || "");
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setGroup(initialGroup);
    setNameVal(initialGroup?.name || "");
    isFirstRender.current = true;
  }, [initialGroup?._id]);

  useEffect(() => {
    if (!group?._id) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await fetch(`${API}/forecast/groups/${group._id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(group),
        });
        if (res.ok) onGroupUpdated(await res.json());
      } catch (e) { console.error(e); }
      finally { setSaving(false); }
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [group]);

  const upd = (f, v) => setGroup((g) => ({ ...g, [f]: v }));
  const updItem = (id, f, v) => setGroup((g) => ({
    ...g,
    items: (g.items || []).map((it) => (it._id || it.tmpId) === id ? { ...it, [f]: v } : it),
  }));
  const addItem = () => setGroup((g) => ({
    ...g,
    items: [...(g.items || []), { tmpId: `tmp_${Date.now()}`, label: "Nouvel article", buyPrice: 0, qty: 1 }],
  }));
  const rmItem = (id) => setGroup((g) => ({
    ...g,
    items: (g.items || []).filter((it) => (it._id || it.tmpId) !== id),
  }));
  const saveName = () => { upd("name", nameVal); setEditingName(false); };

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer "${group.name}" ?`)) return;
    try {
      await fetch(`${API}/forecast/groups/${group._id}`, { method: "DELETE", headers: authHeaders() });
      onGroupDeleted(group._id);
      onBack();
    } catch (e) { console.error(e); }
  };

  const s = computeStats(group);

  const statCards = [
    { label: "Coût / unité",      value: fmtEur(s.buyCostPerUnit) },
    { label: "Prix vente / unité", value: fmtEur(group?.sellPrice || 0) },
    { label: "Marge / unité",     value: fmtEur(s.marginPerUnit),  highlight: s.marginPerUnit >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Unités vendables",  value: String(s.units) },
    { label: "CA total",          value: fmtEur(s.revenue) },
    { label: "Marge totale",      value: fmtEur(s.margin),         highlight: s.margin >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Marge %",           value: fmtPct(s.marginPct),      highlight: s.margin >= 0 ? "text-green-400" : "text-red-400" },
    { label: "ROI / cycle",       value: fmtPct(s.roi),            highlight: s.roi >= 10 ? "text-green-400" : "text-red-400" },
    { label: "Cycle total",       value: `${s.totalCycle} j` },
    { label: "Cycles / an",       value: s.cyclesPerYear.toFixed(1) },
    { label: "ROI annualisé",     value: fmtPct(s.annualROI),      highlight: s.annualROI >= 20 ? "text-green-400" : s.annualROI >= 0 ? "text-yellow-400" : "text-red-400" },
    { label: "Profit / an",       value: fmtEur(s.profitPerYear),  highlight: s.profitPerYear >= 0 ? "text-green-400" : "text-red-400" },
  ];

  return (
    <div className="flex flex-col text-white h-full overflow-hidden">

      {/* ── Header fixe — ne scrolle pas ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.08] flex-wrap gap-2">

        <button
          onClick={onBack}
          className="px-2 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs hover:bg-white/10 transition"
        >
          ← Retour
        </button>

        {editingName ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="flex-1 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl text-white text-base sm:text-lg outline-none focus:border-white/25 min-w-0"
            />
            <button onClick={saveName} className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex-shrink-0">
              <Save size={14} />
            </button>
            <button onClick={() => setEditingName(false)} className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold truncate">{group?.name}</h1>
            <button
              onClick={() => { setEditingName(true); setNameVal(group?.name || ""); }}
              className="text-white/30 hover:text-white/70 transition flex-shrink-0"
            >
              <Edit3 size={12} />
            </button>
            {saving && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-white/30">
                <Loader2 size={10} className="animate-spin" /> Sauvegarde…
              </span>
            )}
          </div>
        )}

        <button
          onClick={handleDelete}
          className="px-2 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition"
        >
          Supprimer
        </button>

      </div>
      {/* ── Fin header fixe ── */}

      {/* ── Zone compacte — pas de scroll ── */}
      <div className="flex-1 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">

          {/* Left — Configuration */}
          <div className="space-y-2 overflow-y-auto pr-2">
            <h2 className="text-sm sm:text-base font-medium mb-1">Configuration</h2>

            {/* Composition */}
            <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 p-2.5 sm:p-3 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                  <Package size={12} /> Composition
                </p>
                <span className="text-[10px] text-white/30 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                  {s.units} unité{s.units > 1 ? "s" : ""}
                </span>
              </div>

              {/* Mobile: Stacked items, Desktop: Grid */}
              <div className="space-y-2">
                {(group?.items || []).map((it) => {
                  const itemId = it._id || it.tmpId;
                  return (
                    <div key={itemId} className="space-y-1.5">
                      {/* Mobile layout */}
                      <div className="sm:hidden space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <Input
                            value={it.label || ""}
                            onChange={(e) => updItem(itemId, "label", e.target.value)}
                            placeholder="Article"
                            className="flex-1"
                          />
                          <button
                            onClick={() => rmItem(itemId)}
                            className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5 px-1">Stock</label>
                            <Input
                              type="number" min="1" value={it.qty ?? 1}
                              onChange={(e) => updItem(itemId, "qty", +e.target.value)}
                              className="text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-white/30 uppercase tracking-wider block mb-0.5 px-1">Coût/u</label>
                            <Input
                              type="number" min="0" step="0.01" value={it.buyPrice ?? 0}
                              onChange={(e) => updItem(itemId, "buyPrice", +e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid sm:grid-cols-[1fr_70px_90px_32px] gap-1.5 items-center">
                        <Input
                          value={it.label || ""}
                          onChange={(e) => updItem(itemId, "label", e.target.value)}
                        />
                        <Input
                          type="number" min="1" value={it.qty ?? 1}
                          onChange={(e) => updItem(itemId, "qty", +e.target.value)}
                          className="text-center"
                        />
                        <Input
                          type="number" min="0" step="0.01" value={it.buyPrice ?? 0}
                          onChange={(e) => updItem(itemId, "buyPrice", +e.target.value)}
                        />
                        <button
                          onClick={() => rmItem(itemId)}
                          className="p-1 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition flex items-center justify-center"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addItem}
                className="w-full py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl text-xs text-white/40 hover:bg-white/10 hover:text-white/70 transition flex items-center justify-center gap-1.5"
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>

            {/* Prix de vente + Délais + Réinvestissement en une seule card */}
            <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 p-2.5 sm:p-3 space-y-2">
              <p className="text-xs text-white/60 font-medium">Prix & Délais</p>
              <Input
                type="number" min="0" step="0.01"
                placeholder="Prix de vente/unité (€)"
                value={group?.sellPrice || ""}
                onChange={(e) => upd("sellPrice", +e.target.value)}
              />
              <div className="grid grid-cols-3 gap-1.5">
                <Input type="number" min="0" placeholder="Livr. (j)" value={group?.deliveryDays || ""} onChange={(e) => upd("deliveryDays", +e.target.value)} />
                <Input type="number" min="0" placeholder="Vente (j)" value={group?.saleDays || ""} onChange={(e) => upd("saleDays", +e.target.value)} />
                <Input type="number" min="0" placeholder="Paiem. (j)" value={group?.paymentDays || ""} onChange={(e) => upd("paymentDays", +e.target.value)} />
              </div>
              
              <div className="flex gap-2 pt-1">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => upd("reinvest", val)}
                    className={`flex-1 py-1.5 rounded-lg border backdrop-blur-xl text-[10px] sm:text-xs transition ${
                      group?.reinvest === val
                        ? "bg-white/10 border-white/25 text-white"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {val ? "Réinvestir" : "Pas réinvest."}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Fin Left */}

          {/* Right — Rapport */}
          <div className="space-y-2 overflow-y-auto pr-2">
            <h2 className="text-sm sm:text-base font-medium mb-1">Analyse</h2>

            {/* Stats compactes en 3 colonnes */}
            <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 p-2.5 sm:p-3">
              <div className="grid grid-cols-3 gap-1.5">
                {statCards.map(({ label, value, highlight }) => (
                  <div key={label} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5">
                    <p className="text-[9px] text-white/40 mb-0.5 truncate">{label}</p>
                    <p className={`text-xs font-semibold truncate ${highlight || "text-white"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projection compacte */}
            <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 p-2.5 sm:p-3 space-y-1.5">
              <p className="text-xs text-white/60 font-medium">
                Projection 1 an
              </p>
              {[
                ["Capital engagé",         fmtEur(s.buyTotal),      "text-white"],
                ["CA total",               fmtEur(s.revenue),       "text-white"],
                ["Profit / an",            fmtEur(s.profitPerYear), s.profitPerYear >= 0 ? "text-green-400" : "text-red-400"],
                ...(group?.reinvest ? [["Valeur finale", fmtEur(s.finalValue), "text-white"]] : []),
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0 gap-2">
                  <span className="text-[10px] sm:text-xs text-white/50 truncate">{label}</span>
                  <span className={`text-[10px] sm:text-xs font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Badge rentabilité */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-xl text-xs font-medium ${
              s.margin > 0
                ? "bg-green-400/5 border-green-400/20 text-green-400"
                : "bg-red-400/5 border-red-400/20 text-red-400"
            }`}>
              {s.margin > 0
                ? <><CheckCircle2 size={13} className="flex-shrink-0" /> <span>Rentable</span></>
                : <><AlertCircle size={13} className="flex-shrink-0" /> <span>Non rentable</span></>
              }
            </div>
          </div>
          {/* Fin Right */}

        </div>
        {/* Fin grid */}

      </div>
      {/* Fin zone compacte */}

    </div>
  );
}

// ─── Hub View ─────────────────────────────────────────────────────────────────
function HubView({ groups, onSelect, onAdd, loading }) {
  const totalRevenue = groups.reduce((s, g) => s + computeStats(g).revenue, 0);
  const totalProfit  = groups.reduce((s, g) => s + computeStats(g).profitPerYear, 0);
  const avgROI       = groups.length > 0
    ? groups.reduce((s, g) => s + computeStats(g).annualROI, 0) / groups.length
    : 0;

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center gap-3 text-white/40">
        <Loader2 size={20} className="animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 p-4 sm:p-8 text-white overflow-y-auto">

      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Prévision & Rentabilité</h1>

      {groups.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Groupements",    value: String(groups.length), color: "text-white" },
            { label: "CA total stock", value: fmtEur(totalRevenue),  color: "text-white" },
            { label: "Profit / an",    value: fmtEur(totalProfit),   color: totalProfit >= 0 ? "text-green-400" : "text-red-400" },
            { label: "ROI moyen / an", value: fmtPct(avgROI),        color: avgROI >= 30 ? "text-green-400" : avgROI >= 10 ? "text-yellow-400" : "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 px-4 sm:px-5 py-3 sm:py-4">
              <p className="text-xs sm:text-sm text-white/50 mb-1">{label}</p>
              <p className={`text-lg sm:text-2xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

        {groups.map((g) => {
          const s = computeStats(g);
          const dotColor = s.margin >= 0 ? "#4ade80" : "#f87171";
          return (
            <div
              key={g._id}
              onClick={() => onSelect(g._id)}
              className="cursor-pointer rounded-2xl border border-white/10 backdrop-blur-xl hover:scale-105 hover:border-white/20 transition bg-white/5"
            >
              <div className="w-full h-48 sm:h-52 flex flex-col items-center justify-center gap-3 px-3 sm:px-4 bg-white/[0.03]">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dotColor, boxShadow: `0 0 10px ${dotColor}99` }} />
                <div className="grid grid-cols-2 gap-2 w-full">
                  {[
                    ["Marge/u",     fmtEur(s.marginPerUnit),  s.marginPerUnit >= 0 ? "text-green-400" : "text-red-400"],
                    ["ROI / an",    fmtPct(s.annualROI),      s.annualROI >= 20 ? "text-green-400" : "text-yellow-400"],
                    ["Unités",      String(s.units),           "text-white/70"],
                    ["Profit / an", fmtEur(s.profitPerYear),  s.profitPerYear >= 0 ? "text-green-400" : "text-red-400"],
                  ].map(([lbl, val, cls]) => (
                    <div key={lbl} className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{lbl}</p>
                      <p className={`text-xs sm:text-sm font-semibold ${cls} truncate`}>{val}</p>
                    </div>
                  ))}
                </div>
                <span className={`text-[10px] sm:text-xs flex items-center gap-1 px-2 py-0.5 rounded-full ${s.margin > 0 ? "text-green-400" : "text-red-400"}`}>
                  {s.margin > 0
                    ? <><CheckCircle2 size={10} /> Rentable</>
                    : <><AlertCircle size={10} /> Non rentable</>
                  }
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex items-center justify-between">
                <span className="truncate">{g.name}</span>
                <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
              </div>
            </div>
          );
        })}

        <div
          onClick={onAdd}
          className="cursor-pointer rounded-2xl border border-dashed border-white/10 backdrop-blur-xl hover:scale-105 hover:border-white/20 transition bg-white/[0.02] flex flex-col items-center justify-center min-h-[220px] sm:min-h-[240px] gap-3 text-white/30 hover:text-white/60"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-xs sm:text-sm">Nouveau groupement</span>
        </div>

      </div>
      {/* Fin grid hub */}

    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function ForecastPage() {
  const [groups, setGroups]         = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/forecast`, { headers: authHeaders() });
        const data = await res.json();
        if (Array.isArray(data)) setGroups(data);
      } catch (e) {
        console.error("Erreur chargement forecast :", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addGroup = async () => {
    try {
      const res = await fetch(`${API}/forecast/groups`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: `Groupement ${groups.length + 1}` }),
      });
      const created = await res.json();
      if (created._id) {
        setGroups((p) => [...p, created]);
        setSelectedId(created._id);
      }
    } catch (e) { console.error(e); }
  };

  const handleGroupUpdated = (updated) =>
    setGroups((p) => p.map((g) => (g._id === updated._id ? updated : g)));

  const handleGroupDeleted = (id) => {
    setGroups((p) => p.filter((g) => g._id !== id));
    setSelectedId(null);
  };

  const selectedGroup = groups.find((g) => g._id === selectedId) || null;

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col text-white">
      {selectedGroup ? (
        <DetailView
          group={selectedGroup}
          onBack={() => setSelectedId(null)}
          onGroupUpdated={handleGroupUpdated}
          onGroupDeleted={handleGroupDeleted}
        />
      ) : (
        <HubView
          groups={groups}
          onSelect={setSelectedId}
          onAdd={addGroup}
          loading={loading}
        />
      )}
    </div>
  );
}