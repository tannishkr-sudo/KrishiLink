import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Bell, IndianRupee, Leaf, LineChart as LineChartIcon, Package, Plus, ShoppingBasket, Truck } from "lucide-react";
import { PageHeader, inr } from "@/components/UIKit";
import { revenueSeries } from "@/data/seed";
import { useApp } from "@/store/AppStore";

function ChartTip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tip"><span>{label}</span><strong>{prefix}{payload[0].value.toLocaleString("en-IN")}</strong></div>;
}

function Stat({ label, value, detail, tone, icon: Icon, testId }) {
  return (
    <div className="stat" data-testid={testId}>
      <div className={`stat-icon ${tone}`}><Icon size={18} /></div>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-detail">{detail}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { produce, requests, activity, orders, prices } = useApp();
  const totals = useMemo(() => {
    const active = produce.filter((p) => p.status !== "Sold");
    const stock = active.reduce((sum, p) => sum + Number(p.quantity), 0);
    const value = active.reduce((sum, p) => sum + Number(p.quantity) * Number(p.price || 0), 0);
    return { stock, value, lots: active.length };
  }, [produce]);
  const stockByCrop = produce.filter((p) => p.status !== "Sold").map((p) => ({ name: p.name, kg: Number(p.quantity) }));
  const inTransit = orders.find((o) => o.status === "In transit");

  return (
    <>
      <PageHeader eyebrow="Overview / 01" title="Good morning, Arjun"
        description="Your harvest, marketplace activity, and next opportunities at a glance."
        action={<>
          <button type="button" className="btn btn-outline" data-testid="home-view-orders-button" onClick={() => navigate("/orders")}>View orders</button>
          <button type="button" className="btn btn-primary" data-testid="home-post-produce-button" onClick={() => navigate("/produce?add=true")}><Plus size={17} /> Post Produce</button>
        </>} />

      <section className="grid-4" data-testid="home-stats">
        <Stat testId="stat-active-stock" label="Active stock" value={`${totals.stock.toLocaleString("en-IN")} kg`} detail={`Across ${totals.lots} produce lots`} tone="green" icon={Leaf} />
        <Stat testId="stat-market-value" label="Market value" value={inr(totals.value)} detail="↑ 8.4% this week" tone="blue" icon={IndianRupee} />
        <Stat testId="stat-open-requests" label="Open requests" value={String(requests.length)} detail={`${requests.filter((r) => r.verified).length} verified buyers`} tone="peach" icon={ShoppingBasket} />
        <Stat testId="stat-next-delivery" label="Next delivery" value="Tomorrow" detail={inTransit ? `To ${inTransit.buyer}` : "Nothing scheduled"} tone="gold" icon={Truck} />
      </section>

      <div className="split mt">
        <section className="chart-card" data-testid="home-revenue-chart">
          <div className="chart-head">
            <div><p className="eyebrow">Earnings trend</p><h2>Monthly produce value</h2></div>
            <NavLink to="/prices" className="link" data-testid="home-market-prices-link">Market prices <ArrowUpRight size={14} /></NavLink>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2c5238" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#2c5238" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e4d9" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} tickFormatter={(v) => `${v / 1000}k`} width={42} />
                <Tooltip content={<ChartTip prefix="₹" />} />
                <Area type="monotone" dataKey="value" stroke="#1f3d2b" strokeWidth={2.4} fill="url(#areaGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card" data-testid="home-stock-chart">
          <div className="chart-head"><div><p className="eyebrow">Inventory split</p><h3>Stock by crop</h3></div></div>
          <div className="chart-box" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByCrop} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e4d9" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#78867a" }} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(31,61,43,.05)" }} />
                <Bar dataKey="kg" fill="#c05a30" radius={[8, 8, 0, 0]} barSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="split mt">
        <section className="panel" data-testid="home-inventory-panel">
          <div className="section-title">
            <div><p className="eyebrow">Inventory pulse</p><h2>Your produce</h2></div>
            <NavLink to="/produce" className="link" data-testid="home-view-produce-link">View all <ArrowUpRight size={14} /></NavLink>
          </div>
          {produce.map((item) => (
            <div className="list-row" key={item.id} data-testid={`home-produce-${item.name.toLowerCase()}-row`}>
              <div className={`crop-icon ${item.tone}`}><Leaf size={18} /></div>
              <div className="row-main"><strong>{item.name}</strong><span>{item.variety} · {item.grade}</span></div>
              <div className="row-value"><strong>{item.quantity} <small style={{ fontWeight: 400 }}>{item.unit}</small></strong><small>{inr(item.price)}/kg</small></div>
              <span className={`badge ${item.status === "Sold" ? "" : item.status === "Reserved" ? "gold" : "green"}`}>{item.status}</span>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-block mt" data-testid="home-add-lot-button" onClick={() => navigate("/produce?add=true")}><Plus size={16} /> Add a new lot</button>
        </section>

        <section className="panel" data-testid="home-activity-panel">
          <div className="section-title">
            <div><p className="eyebrow">Recent activity</p><h2>Stay in the loop</h2></div>
            <Bell size={18} color="#78867a" />
          </div>
          {activity.slice(0, 5).map((item) => (
            <div className="activity-row" key={item.id}>
              <i className={`dot ${item.tone}`} />
              <div><strong>{item.title}</strong><small>{item.time}</small></div>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-block mt" data-testid="home-open-messages-button" onClick={() => navigate("/messages")}>Open messages</button>
        </section>
      </div>

      <section className="band" data-testid="home-insight-band">
        <div>
          <p className="eyebrow">Market insight</p>
          <h2>{prices[0].crop} demand is up {prices[0].change}% in {prices[0].mandi} this week — a good moment to list Grade A lots.</h2>
          <p>Better information makes for better harvests.</p>
        </div>
        <button type="button" className="btn btn-outline" data-testid="home-explore-prices-button" onClick={() => navigate("/prices")}>Explore prices <LineChartIcon size={15} /></button>
      </section>

      <section className="grid-3 mt">
        {[["Buyer requests", "See who needs your crops today", "/requests", ShoppingBasket], ["Schedule transport", "Plan the next pickup or delivery", "/transport", Truck], ["Track orders", "Follow payments and deliveries", "/orders", Package]].map(([title, copy, to, Icon]) => (
          <button type="button" key={to} className="card" style={{ padding: 22, textAlign: "left" }} data-testid={`home-shortcut-${to.slice(1)}`} onClick={() => navigate(to)}>
            <div className="aside-icon" style={{ marginBottom: 14 }}><Icon size={19} /></div>
            <strong style={{ fontFamily: "var(--font-head)", fontSize: 16 }}>{title}</strong>
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{copy}</p>
          </button>
        ))}
      </section>
    </>
  );
}
