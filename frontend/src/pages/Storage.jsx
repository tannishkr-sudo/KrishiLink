import { useState } from "react";
import { MapPin, Plus, Thermometer, Trash2, Warehouse } from "lucide-react";
import { ConfirmDialog, EmptyState, Field, Meter, Modal, PageHeader, Toolbar } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const blank = { name: "", type: "On-farm shed", distance: "", capacity: "", used: "0", temp: "Ambient" };

export default function Storage() {
  const { storage, addStorage, bookStorage, removeStorage } = useApp();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const [bookQty, setBookQty] = useState("");
  const [bookError, setBookError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const rows = storage.filter((s) => `${s.name} ${s.type}`.toLowerCase().includes(query.toLowerCase()));

  const submit = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.capacity || Number(form.capacity) <= 0) next.capacity = "Enter total capacity";
    setErrors(next);
    if (Object.keys(next).length) return;
    addStorage({ ...form, distance: Number(form.distance || 0), capacity: Number(form.capacity), used: Number(form.used || 0) });
    setCreating(false); setForm(blank);
  };

  const confirmBooking = () => {
    if (!bookQty || Number(bookQty) <= 0) { setBookError("Enter quantity in kg"); return; }
    bookStorage(booking.id, bookQty);
    setBooking(null); setBookQty(""); setBookError("");
  };

  return (
    <>
      <PageHeader eyebrow="Logistics / 06" title="Storage"
        description="Manage where your harvest is kept, how much space is left, and at what temperature."
        action={<button type="button" className="btn btn-primary" data-testid="add-storage-button" onClick={() => { setForm(blank); setErrors({}); setCreating(true); }}><Plus size={17} /> Add storage</button>} />

      <Toolbar slug="storage" query={query} onQuery={setQuery} placeholder="Search storage locations" />

      {rows.length === 0 ? (
        <EmptyState icon={Warehouse} title="No storage found" message="Add a farm shed or cold room to track available space."
          action={<button type="button" className="btn btn-primary" data-testid="empty-add-storage-button" onClick={() => setCreating(true)}><Plus size={16} /> Add storage</button>} />
      ) : (
        <section className="grid-3" data-testid="storage-grid">
          {rows.map((s) => {
            const pct = Math.round((s.used / s.capacity) * 100);
            return (
              <article className="card" style={{ padding: 22 }} key={s.id} data-testid={`storage-card-${s.id}`}>
                <div className="prod-top">
                  <div className={`crop-icon ${pct > 80 ? "gold" : "blue"}`}><Warehouse size={19} /></div>
                  <div style={{ flex: 1 }}><h3 style={{ fontSize: 17 }}>{s.name}</h3><p style={{ margin: "5px 0 0", fontSize: 11.5, color: "var(--muted)" }}>{s.type}</p></div>
                  <span className={`badge ${pct > 80 ? "gold" : "green"}`}>{s.status}</span>
                </div>
                <div style={{ margin: "22px 0 8px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontFamily: "var(--font-head)", fontSize: 26 }}>{s.used.toLocaleString("en-IN")} kg</strong>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>of {s.capacity.toLocaleString("en-IN")} kg · {pct}%</span>
                </div>
                <Meter value={pct} tone={pct > 80 ? "gold" : "green"} />
                <div className="prod-meta" style={{ marginTop: 16 }}>
                  <span><MapPin size={14} /> {s.distance} km away</span>
                  <span><Thermometer size={14} /> {s.temp}</span>
                </div>
                <div className="prod-actions">
                  <button type="button" className="btn btn-primary btn-sm" style={{ flex: 1 }} data-testid={`book-storage-${s.id}-button`} onClick={() => { setBooking(s); setBookQty(""); setBookError(""); }}>Book space</button>
                  <button type="button" className="row-btn" data-testid={`delete-storage-${s.id}-button`} aria-label="Remove storage" onClick={() => setDeleting(s)}><Trash2 size={15} /></button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} wide testId="add-storage-modal"
        title="Add a storage location" subtitle="Keep an accurate picture of where your harvest sits."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)} data-testid="cancel-storage-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submit} data-testid="submit-storage-button">Save location</button>
        </>}>
        <div className="form-grid">
          <Field label="Location name" error={errors.name}>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Farm Storage 3" data-testid="storage-name-input" />
          </Field>
          <Field label="Type">
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} data-testid="storage-type-select">
              <option>On-farm shed</option><option>Cold storage</option><option>Shared cold room</option>
            </select>
          </Field>
          <Field label="Total capacity (kg)" error={errors.capacity}>
            <input className="input" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} data-testid="storage-capacity-input" />
          </Field>
          <Field label="Currently used (kg)">
            <input className="input" type="number" min="0" value={form.used} onChange={(e) => setForm({ ...form, used: e.target.value })} data-testid="storage-used-input" />
          </Field>
          <Field label="Distance from farm (km)">
            <input className="input" type="number" min="0" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} data-testid="storage-distance-input" />
          </Field>
          <Field label="Temperature">
            <input className="input" value={form.temp} onChange={(e) => setForm({ ...form, temp: e.target.value })} placeholder="e.g. 4°C" data-testid="storage-temp-input" />
          </Field>
        </div>
      </Modal>

      <Modal open={Boolean(booking)} onClose={() => setBooking(null)} testId="book-storage-modal"
        title={`Book space at ${booking?.name ?? ""}`} subtitle={booking ? `${(booking.capacity - booking.used).toLocaleString("en-IN")} kg available` : ""}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setBooking(null)} data-testid="cancel-booking-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={confirmBooking} data-testid="confirm-booking-button">Confirm booking</button>
        </>}>
        <Field label="Quantity to store (kg)" error={bookError} hint="Space is reserved immediately in your workspace">
          <input className="input" type="number" min="1" value={bookQty} onChange={(e) => setBookQty(e.target.value)} placeholder="e.g. 200" data-testid="booking-quantity-input" />
        </Field>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => removeStorage(deleting.id)}
        title={`Remove ${deleting?.name ?? "location"}?`} message="This storage location will no longer appear in your workspace." testId="delete-storage-dialog" confirmLabel="Remove" />
    </>
  );
}
