import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Bookmark, Clock, Filter, Leaf, MapPin, RotateCcw, Send, ShoppingBasket } from "lucide-react";
import { EmptyState, Field, Modal, PageHeader, inr } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const defaultFilters = { crop: "All crops", quantity: "", distance: "Anywhere", sort: "Newest" };

export default function Requests() {
  const { requests, toggleSaveRequest, startConversation, sendMessage, toast } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [viewing, setViewing] = useState(null);
  const [reply, setReply] = useState({ price: "", quantity: "", note: "" });
  const [replyError, setReplyError] = useState("");

  const rows = useMemo(() => {
    let list = requests.filter((r) => {
      if (filters.crop !== "All crops" && r.crop !== filters.crop) return false;
      if (filters.quantity && r.quantity < Number(filters.quantity)) return false;
      if (filters.distance === "Within 20 km" && r.distance > 20) return false;
      if (filters.distance === "Within 50 km" && r.distance > 50) return false;
      return true;
    });
    if (filters.sort === "Highest price") list = [...list].sort((a, b) => b.price - a.price);
    if (filters.sort === "Largest quantity") list = [...list].sort((a, b) => b.quantity - a.quantity);
    if (filters.sort === "Nearest") list = [...list].sort((a, b) => a.distance - b.distance);
    return list;
  }, [requests, filters]);

  const apply = (e) => { e.preventDefault(); setFilters(draft); toast("Filters applied"); };
  const reset = () => { setDraft(defaultFilters); setFilters(defaultFilters); toast("Filters cleared"); };

  const submitReply = () => {
    if (!reply.price || Number(reply.price) <= 0) { setReplyError("Enter the price you can offer"); return; }
    const id = startConversation(viewing.buyer, `Buyer · ${viewing.crop}`);
    sendMessage(id, { type: "text", text: `I can supply ${reply.quantity || viewing.quantity} kg ${viewing.crop} at ₹${reply.price}/kg. ${reply.note}`.trim() });
    setViewing(null); setReply({ price: "", quantity: "", note: "" }); setReplyError("");
    toast(`Offer sent to ${viewing.buyer}`);
    navigate("/messages");
  };

  return (
    <>
      <PageHeader eyebrow="Opportunities / 05" title="Buyer requests"
        description="Connect with buyers looking for specific produce in your area."
        action={<button type="button" className="btn btn-outline" data-testid="saved-requests-button" onClick={() => setDraft({ ...draft, sort: "Highest price" })}><Bookmark size={16} /> {requests.filter((r) => r.saved).length} saved</button>} />

      <form className="filters" onSubmit={apply} data-testid="buyer-request-filter-form">
        <Field label="Crop type">
          <select className="select" value={draft.crop} onChange={(e) => setDraft({ ...draft, crop: e.target.value })} data-testid="crop-type-select">
            {["All crops", "Tomato", "Onion", "Potato"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Minimum quantity (kg)">
          <input className="input" type="number" min="0" value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: e.target.value })} placeholder="e.g. 500" data-testid="minimum-quantity-input" />
        </Field>
        <Field label="Distance">
          <select className="select" value={draft.distance} onChange={(e) => setDraft({ ...draft, distance: e.target.value })} data-testid="distance-select">
            {["Anywhere", "Within 20 km", "Within 50 km"].map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn btn-primary" data-testid="apply-filters-button"><Filter size={15} /> Apply</button>
          <button type="button" className="btn btn-ghost" onClick={reset} data-testid="reset-filters-button" aria-label="Reset filters"><RotateCcw size={15} /></button>
        </div>
      </form>

      <div className="toolbar">
        <div className="chips">
          {["Newest", "Highest price", "Largest quantity", "Nearest"].map((s) => (
            <button type="button" key={s} className={filters.sort === s ? "chip active" : "chip"} data-testid={`sort-${s.toLowerCase().replaceAll(" ", "-")}`}
              onClick={() => { setDraft({ ...draft, sort: s }); setFilters({ ...filters, sort: s }); }}>{s}</button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }} data-testid="requests-count">{rows.length} open requests</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={ShoppingBasket} title="No matching requests" message="Widen your distance or lower the minimum quantity to see more buyers."
          action={<button type="button" className="btn btn-primary" onClick={reset} data-testid="empty-reset-filters-button">Clear filters</button>} />
      ) : (
        <section className="grid-2" data-testid="requests-grid">
          {rows.map((r) => (
            <article className="card req-card" key={r.id} data-testid={`request-card-${r.id}`}>
              <div className="req-top">
                <div className={`crop-photo ${r.tone}`}><Leaf size={22} /></div>
                <div style={{ flex: 1 }}><h3>{r.title}</h3><p>{r.grade} · {r.buyer}</p></div>
                {r.verified && <span className="badge green"><BadgeCheck size={12} /> Verified</span>}
              </div>
              <div className="req-meta">
                <span><MapPin size={15} /> {r.distance} km away · {r.delivery}</span>
                <span><Clock size={15} /> Posted {r.posted}</span>
                <span><ShoppingBasket size={15} /> {r.quantity.toLocaleString("en-IN")} kg at {inr(r.price)}/kg · worth {inr(r.price * r.quantity)}</span>
              </div>
              <div className="req-foot">
                <button type="button" className="btn btn-primary" style={{ flex: 1 }} data-testid={`view-request-${r.id}-button`} onClick={() => { setViewing(r); setReply({ price: String(r.price), quantity: String(r.quantity), note: "" }); }}>View request</button>
                <button type="button" className={r.saved ? "row-btn saved" : "row-btn"} data-testid={`save-request-${r.id}-button`} aria-label="Save request" onClick={() => toggleSaveRequest(r.id)}><Bookmark size={15} fill={r.saved ? "currentColor" : "none"} /></button>
              </div>
            </article>
          ))}
        </section>
      )}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} wide testId="request-detail-modal"
        title={viewing?.title} subtitle={viewing?.note}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setViewing(null)} data-testid="close-request-modal-button">Close</button>
          <button type="button" className="btn btn-primary" onClick={submitReply} data-testid="send-offer-button"><Send size={15} /> Send offer</button>
        </>}>
        {viewing && (
          <>
            <div className="detail-list">
              <div className="detail-row"><span>Buyer</span><strong>{viewing.buyer} {viewing.verified ? "· Verified" : ""}</strong></div>
              <div className="detail-row"><span>Quantity needed</span><strong>{viewing.quantity.toLocaleString("en-IN")} kg</strong></div>
              <div className="detail-row"><span>Quality</span><strong>{viewing.grade}</strong></div>
              <div className="detail-row"><span>Buyer price</span><strong>{inr(viewing.price)} / kg</strong></div>
              <div className="detail-row"><span>Logistics</span><strong>{viewing.delivery} · {viewing.distance} km</strong></div>
            </div>
            <div className="form-grid mt">
              <Field label="Your price (₹ per kg)" error={replyError}>
                <input className="input" type="number" min="1" value={reply.price} onChange={(e) => setReply({ ...reply, price: e.target.value })} data-testid="offer-price-input" />
              </Field>
              <Field label="Quantity you can supply (kg)">
                <input className="input" type="number" min="1" value={reply.quantity} onChange={(e) => setReply({ ...reply, quantity: e.target.value })} data-testid="offer-quantity-input" />
              </Field>
              <div className="full">
                <Field label="Message to buyer" hint="Mention packing, grading or delivery timing">
                  <textarea className="textarea" value={reply.note} onChange={(e) => setReply({ ...reply, note: e.target.value })} placeholder="I can deliver within 2 days in 20 kg crates." data-testid="offer-note-input" />
                </Field>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
