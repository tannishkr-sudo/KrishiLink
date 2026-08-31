import { useMemo, useState } from "react";
import { Download, IndianRupee, Package, Truck } from "lucide-react";
import { EmptyState, Modal, PageHeader, Toolbar, inr } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const toneFor = (status) => (status === "Completed" ? "green" : status === "In transit" ? "blue" : "gold");

export default function Orders() {
  const { orders, updateOrder, toast } = useApp();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState(null);

  const rows = useMemo(() => orders.filter((o) => {
    if (tab !== "All" && o.status !== tab) return false;
    return `${o.code} ${o.buyer} ${o.item}`.toLowerCase().includes(query.toLowerCase());
  }), [orders, tab, query]);

  const totals = useMemo(() => ({
    open: orders.filter((o) => o.status !== "Completed").length,
    earned: orders.filter((o) => o.status === "Completed").reduce((s, o) => s + o.amount, 0),
    pipeline: orders.filter((o) => o.status !== "Completed").reduce((s, o) => s + o.amount, 0),
  }), [orders]);

  return (
    <>
      <PageHeader eyebrow="Operations / 08" title="Orders"
        description="Review every active and completed order, and keep buyers updated."
        action={<button type="button" className="btn btn-outline" data-testid="export-orders-button" onClick={() => toast("Order statement exported")}><Download size={16} /> Export statement</button>} />

      <section className="grid-3" data-testid="orders-stats">
        <div className="stat"><div className="stat-icon gold"><Package size={18} /></div><div><span className="stat-label">Open orders</span><strong className="stat-value">{totals.open}</strong><span className="stat-detail">Awaiting delivery or payment</span></div></div>
        <div className="stat"><div className="stat-icon blue"><Truck size={18} /></div><div><span className="stat-label">In pipeline</span><strong className="stat-value">{inr(totals.pipeline)}</strong><span className="stat-detail">Value yet to be settled</span></div></div>
        <div className="stat"><div className="stat-icon"><IndianRupee size={18} /></div><div><span className="stat-label">Earned</span><strong className="stat-value">{inr(totals.earned)}</strong><span className="stat-detail">From completed orders</span></div></div>
      </section>

      <div className="mt">
        <Toolbar slug="orders" tabs={["All", "Pending", "In transit", "Completed"]} tab={tab} onTab={setTab}
          query={query} onQuery={setQuery} placeholder="Search by order, buyer or crop" />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Package} title="No orders in this view" message="Change the filter or clear your search to see all orders." />
      ) : (
        <section className="panel" data-testid="orders-table-panel">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Buyer</th><th>Produce</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} data-testid={`order-row-${o.code}`}>
                    <td><strong>#{o.code}</strong><br /><span style={{ fontSize: 11, color: "var(--muted)" }}>{o.date}</span></td>
                    <td>{o.buyer}</td>
                    <td>{o.item}<br /><span style={{ fontSize: 11, color: "var(--muted)" }}>{o.qty}</span></td>
                    <td className="num">{inr(o.amount)}</td>
                    <td><span className={`badge ${toneFor(o.status)}`}>{o.status}</span></td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" data-testid={`view-order-${o.code}-button`} onClick={() => setViewing(o)}>View</button>
                        {o.status !== "Completed" && (
                          <button type="button" className="btn btn-outline btn-sm" data-testid={`advance-order-${o.code}-button`}
                            onClick={() => updateOrder(o.id, { status: o.status === "Pending" ? "In transit" : "Completed" })}>
                            {o.status === "Pending" ? "Dispatch" : "Mark delivered"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} testId="order-detail-modal"
        title={viewing ? `Order #${viewing.code}` : ""} subtitle={viewing?.buyer}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setViewing(null)} data-testid="close-order-modal-button">Close</button>
          <button type="button" className="btn btn-primary" data-testid="download-invoice-button" onClick={() => { toast(`Invoice for #${viewing.code} downloaded`); setViewing(null); }}><Download size={15} /> Download invoice</button>
        </>}>
        {viewing && (
          <div className="detail-list">
            <div className="detail-row"><span>Produce</span><strong>{viewing.item}</strong></div>
            <div className="detail-row"><span>Quantity</span><strong>{viewing.qty}</strong></div>
            <div className="detail-row"><span>Order value</span><strong>{inr(viewing.amount)}</strong></div>
            <div className="detail-row"><span>Order date</span><strong>{viewing.date}</strong></div>
            <div className="detail-row"><span>Status</span><strong>{viewing.status}</strong></div>
          </div>
        )}
      </Modal>
    </>
  );
}
