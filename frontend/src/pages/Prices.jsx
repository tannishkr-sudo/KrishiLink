import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BellPlus, TrendingDown, TrendingUp, X } from "lucide-react";
import { Field, Modal, PageHeader, Toolbar, inr } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tip"><span>{label}</span><strong>₹{payload[0].value}/kg</strong></div>;
}

export default function Prices() {
  const { prices, alerts, addAlert, removeAlert } = useApp();
  const [crop, setCrop] = useState(prices[0].crop);
  const [range, setRange] = useState("7 days");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ crop: prices[0].crop, target: "", direction: "Above" });
  const [error, setError] = useState("");

  const selected = prices.find((p) => p.crop === crop) ?? prices[0];
  const series = useMemo(() => (range === "7 days" ? selected.series : selected.series.map((d, i) => ({ ...d, p: d.p - (6 - i) }))), [selected, range]);
  const rows = prices.filter((p) => `${p.crop} ${p.mandi}`.toLowerCase().includes(query.toLowerCase()));

  const submit = () => {
    if (!form.target || Number(form.target) <= 0) { setError("Enter a target price"); return; }
    addAlert({ ...form, target: Number(form.target) });
    setCreating(false); setForm({ crop: selected.crop, target: "", direction: "Above" }); setError("");
  };

  return (
    <>
      <PageHeader eyebrow="Signals / 03" title="Market Prices"
        description="Track the latest mandi rates for crops in your region and set alerts before you sell."
        action={<button type="button" className="btn btn-primary" data-testid="create-price-alert-button" onClick={() => { setForm({ crop: selected.crop, target: "", direction: "Above" }); setError(""); setCreating(true); }}><BellPlus size={17} /> Set price alert</button>} />

      <div className="toolbar">
        <div className="chips">
          {prices.map((p) => (
            <button type="button" key={p.crop} className={crop === p.crop ? "chip active" : "chip"} data-testid={`price-crop-${p.crop.toLowerCase()}`} onClick={() => setCrop(p.crop)}>{p.crop}</button>
          ))}
        </div>
        <div className="tabs">
          {["7 days", "30 days"].map((r) => (
            <button type="button" key={r} className={range === r ? "tab active" : "tab"} data-testid={`price-range-${r.split(" ")[0]}`} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="split">
        <section className="chart-card" data-testid="price-trend-chart">
          <div className="chart-head">
            <div><p className="eyebrow">{selected.mandi} mandi · last {range}</p><h2>{selected.crop} price trend</h2></div>
            <span className={selected.change >= 0 ? "delta up" : "delta down"}>{selected.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {Math.abs(selected.change)}%</span>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e4d9" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="p" stroke="#c05a30" strokeWidth={2.6} dot={{ r: 3, fill: "#c05a30" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card" data-testid="price-comparison-chart">
          <div className="chart-head"><div><p className="eyebrow">Today across crops</p><h3>Rate comparison</h3></div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prices.map((p) => ({ name: p.crop, price: p.price }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e4d9" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(31,61,43,.05)" }} />
                <Bar dataKey="price" fill="#1f3d2b" radius={[8, 8, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel mt" data-testid="price-table-panel">
        <Toolbar slug="prices" query={query} onQuery={setQuery} placeholder="Search crop or mandi" />
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Crop</th><th>Mandi</th><th>Today</th><th>Weekly change</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.crop} data-testid={`price-row-${p.crop.toLowerCase()}`}>
                  <td><strong>{p.crop}</strong></td>
                  <td>{p.mandi}</td>
                  <td className="num">{inr(p.price)} / kg</td>
                  <td><span className={p.change >= 0 ? "delta up" : "delta down"}>{p.change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(p.change)}%</span></td>
                  <td><button type="button" className="btn btn-ghost btn-sm" data-testid={`view-price-${p.crop.toLowerCase()}-button`} onClick={() => setCrop(p.crop)}>View trend</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel mt" data-testid="price-alerts-panel">
        <div className="section-title">
          <div><p className="eyebrow">Alerts</p><h2>Your price alerts</h2></div>
          <button type="button" className="btn btn-outline btn-sm" data-testid="add-alert-button" onClick={() => setCreating(true)}><BellPlus size={15} /> Add alert</button>
        </div>
        {alerts.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>No alerts yet. Set one to get notified when a crop crosses your target price.</p> : alerts.map((a) => (
          <div className="list-row" key={a.id} data-testid={`alert-row-${a.id}`}>
            <div className="crop-icon gold"><BellPlus size={17} /></div>
            <div className="row-main"><strong>{a.crop} {a.direction.toLowerCase()} {inr(a.target)}/kg</strong><span>We will notify you as soon as the mandi rate crosses this.</span></div>
            <button type="button" className="row-btn" data-testid={`remove-alert-${a.id}-button`} aria-label="Remove alert" onClick={() => removeAlert(a.id)}><X size={15} /></button>
          </div>
        ))}
      </section>

      <Modal open={creating} onClose={() => setCreating(false)} testId="price-alert-modal"
        title="Set a price alert" subtitle="We will notify you when the mandi rate crosses your target."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)} data-testid="cancel-alert-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submit} data-testid="submit-alert-button">Create alert</button>
        </>}>
        <div className="form-grid">
          <Field label="Crop">
            <select className="select" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} data-testid="alert-crop-select">
              {prices.map((p) => <option key={p.crop}>{p.crop}</option>)}
            </select>
          </Field>
          <Field label="Direction">
            <select className="select" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} data-testid="alert-direction-select">
              <option>Above</option><option>Below</option>
            </select>
          </Field>
          <div className="full">
            <Field label="Target price (₹ per kg)" error={error}>
              <input className="input" type="number" min="1" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="e.g. 48" data-testid="alert-target-input" />
            </Field>
          </div>
        </div>
      </Modal>
    </>
  );
}
