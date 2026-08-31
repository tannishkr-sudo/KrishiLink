import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, MessageCircle, Plus, Star, Store } from "lucide-react";
import { EmptyState, Field, Modal, PageHeader, Toolbar } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const blank = { title: "", type: "Seller", detail: "", location: "", distance: "", price: "" };

export default function Marketplace() {
  const { listings, toggleSaveListing, addListing, startConversation, sendMessage, toast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [contacting, setContacting] = useState(null);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => listings.filter((l) => {
    if (tab === "Buyers" && l.type !== "Buyer") return false;
    if (tab === "Sellers" && l.type !== "Seller") return false;
    if (tab === "Saved" && !l.saved) return false;
    return `${l.title} ${l.detail} ${l.location}`.toLowerCase().includes(query.toLowerCase());
  }), [listings, tab, query]);

  const submit = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Add a listing title";
    if (!form.detail.trim()) next.detail = "Describe what you offer or need";
    setErrors(next);
    if (Object.keys(next).length) return;
    addListing({ ...form, distance: Number(form.distance || 0), price: form.price || "Negotiable", location: form.location || "Pune" });
    setCreating(false); setForm(blank);
  };

  const send = () => {
    if (!message.trim()) return;
    const id = startConversation(contacting.title, `${contacting.type} · ${contacting.location}`);
    sendMessage(id, { type: "text", text: message });
    setContacting(null); setMessage("");
    toast(`Message sent to ${contacting.title}`);
    navigate("/messages");
  };

  return (
    <>
      <PageHeader eyebrow="Discover / 02" title="Marketplace"
        description="Find trusted buyers, sellers, and fresh opportunities near your farm."
        action={<button type="button" className="btn btn-primary" data-testid="marketplace-create-button" onClick={() => { setForm(blank); setErrors({}); setCreating(true); }}><Plus size={17} /> New listing</button>} />

      <Toolbar slug="marketplace" tabs={["All", "Buyers", "Sellers", "Saved"]} tab={tab} onTab={setTab}
        query={query} onQuery={setQuery} placeholder="Search buyers, sellers or crops" />

      {rows.length === 0 ? (
        <EmptyState icon={Store} title="Nothing here yet" message="Try another tab or publish your own listing to attract buyers."
          action={<button type="button" className="btn btn-primary" data-testid="empty-create-listing-button" onClick={() => setCreating(true)}><Plus size={16} /> New listing</button>} />
      ) : (
        <section className="grid-2" data-testid="marketplace-grid">
          {rows.map((l) => (
            <article className="card" style={{ padding: 22 }} key={l.id} data-testid={`listing-card-${l.id}`}>
              <div className="req-top">
                <div className={`crop-photo ${l.tone}`}><Store size={20} /></div>
                <div style={{ flex: 1 }}><h3 style={{ fontSize: 17 }}>{l.title}</h3><p style={{ margin: "5px 0 0", fontSize: 11.5, color: "var(--muted)" }}>{l.detail}</p></div>
                <span className={`badge ${l.type === "Buyer" ? "blue" : "gold"}`}>{l.type}</span>
              </div>
              <div className="req-meta" style={{ margin: "18px 0" }}>
                <span><MapPin size={15} /> {l.location} · {l.distance} km away</span>
                <span><Star size={15} /> {l.rating} rating · {l.price}</span>
              </div>
              <div className="req-foot">
                <button type="button" className="btn btn-primary" style={{ flex: 1 }} data-testid={`contact-listing-${l.id}-button`} onClick={() => { setContacting(l); setMessage(`Hello ${l.title}, I would like to discuss ${l.detail.toLowerCase()}.`); }}><MessageCircle size={15} /> Contact</button>
                <button type="button" className={l.saved ? "row-btn saved" : "row-btn"} data-testid={`save-listing-${l.id}-button`} aria-label="Save listing" onClick={() => toggleSaveListing(l.id)}><Bookmark size={15} fill={l.saved ? "currentColor" : "none"} /></button>
              </div>
            </article>
          ))}
        </section>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} wide testId="create-listing-modal"
        title="Publish a marketplace listing" subtitle="Tell the network what you are selling or looking for."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)} data-testid="cancel-listing-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submit} data-testid="submit-listing-button">Publish listing</button>
        </>}>
        <div className="form-grid">
          <Field label="Listing title" error={errors.title}>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Arjun Farms" data-testid="listing-title-input" />
          </Field>
          <Field label="I am a">
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} data-testid="listing-type-select">
              <option>Seller</option><option>Buyer</option>
            </select>
          </Field>
          <Field label="Location">
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Pune" data-testid="listing-location-input" />
          </Field>
          <Field label="Distance (km)">
            <input className="input" type="number" min="0" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} data-testid="listing-distance-input" />
          </Field>
          <Field label="Price">
            <input className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. ₹40 / kg" data-testid="listing-price-input" />
          </Field>
          <div className="full">
            <Field label="Details" error={errors.detail}>
              <textarea className="textarea" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Grade A tomato, 1,200 kg ready this week" data-testid="listing-detail-input" />
            </Field>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(contacting)} onClose={() => setContacting(null)} testId="contact-listing-modal"
        title={`Message ${contacting?.title ?? ""}`} subtitle={contacting ? `${contacting.type} · ${contacting.location}` : ""}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setContacting(null)} data-testid="cancel-contact-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={send} data-testid="send-contact-message-button"><MessageCircle size={15} /> Send message</button>
        </>}>
        <Field label="Your message">
          <textarea className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} data-testid="contact-message-input" />
        </Field>
      </Modal>
    </>
  );
}
