import { useState } from "react";
import { CheckCircle2, Clock, Plus, Route, Trash2, Truck, User } from "lucide-react";
import { ConfirmDialog, EmptyState, Field, Modal, PageHeader, Toolbar } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const blank = { route: "", date: "", time: "09:00", load: "", vehicle: "Tata Ace", driver: "", distance: "" };

export default function Transport() {
  const { transport, addTrip, updateTrip, removeTrip } = useApp();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [cancelling, setCancelling] = useState(null);
  const [viewing, setViewing] = useState(null);

  const rows = transport.filter((t) => {
    if (tab !== "All" && t.status !== tab) return false;
    return `${t.route} ${t.vehicle} ${t.driver}`.toLowerCase().includes(query.toLowerCase());
  });

  const submit = () => {
    const next = {};
    if (!form.route.trim()) next.route = "Where is this trip going?";
    if (!form.date) next.date = "Pick a date";
    if (!form.load.trim()) next.load = "Add the load, e.g. 500 kg";
    setErrors(next);
    if (Object.keys(next).length) return;
    addTrip({ route: form.route, when: `${form.date} · ${form.time}`, load: form.load, vehicle: form.vehicle, driver: form.driver || "To be assigned", distance: Number(form.distance || 0) });
    setCreating(false); setForm(blank);
  };

  return (
    <>
      <PageHeader eyebrow="Logistics / 07" title="Transport"
        description="Coordinate pickups and deliveries so every lot moves on time."
        action={<button type="button" className="btn btn-primary" data-testid="schedule-pickup-button" onClick={() => { setForm(blank); setErrors({}); setCreating(true); }}><Plus size={17} /> Schedule pickup</button>} />

      <Toolbar slug="transport" tabs={["All", "Scheduled", "In transit", "Delivered"]} tab={tab} onTab={setTab}
        query={query} onQuery={setQuery} placeholder="Search routes, vehicles or drivers" />

      {rows.length === 0 ? (
        <EmptyState icon={Truck} title="No trips found" message="Schedule a pickup to keep your deliveries on track."
          action={<button type="button" className="btn btn-primary" data-testid="empty-schedule-button" onClick={() => setCreating(true)}><Plus size={16} /> Schedule pickup</button>} />
      ) : (
        <section className="panel" data-testid="transport-list">
          {rows.map((t) => (
            <div className="list-row" key={t.id} data-testid={`transport-row-${t.id}`}>
              <div className={`crop-icon ${t.status === "Delivered" ? "green" : t.status === "In transit" ? "blue" : "gold"}`}><Truck size={18} /></div>
              <div className="row-main"><strong>{t.route}</strong><span>{t.when} · {t.vehicle} · {t.driver}</span></div>
              <div className="row-value"><strong>{t.load}</strong><small>{t.distance} km</small></div>
              <span className={`badge ${t.status === "Delivered" ? "green" : t.status === "In transit" ? "blue" : "gold"}`}>{t.status}</span>
              <div className="row-actions">
                <button type="button" className="btn btn-ghost btn-sm" data-testid={`view-trip-${t.id}-button`} onClick={() => setViewing(t)}>Details</button>
                {t.status !== "Delivered" && (
                  <button type="button" className="row-btn" data-testid={`advance-trip-${t.id}-button`} aria-label="Advance trip status"
                    onClick={() => updateTrip(t.id, { status: t.status === "Scheduled" ? "In transit" : "Delivered" })}><CheckCircle2 size={15} /></button>
                )}
                <button type="button" className="row-btn" data-testid={`cancel-trip-${t.id}-button`} aria-label="Cancel trip" onClick={() => setCancelling(t)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </section>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} wide testId="schedule-trip-modal"
        title="Schedule a pickup" subtitle="Add the route, load and vehicle so your buyer knows when to expect delivery."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)} data-testid="cancel-schedule-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submit} data-testid="submit-trip-button">Schedule trip</button>
        </>}>
        <div className="form-grid">
          <div className="full">
            <Field label="Route" error={errors.route}>
              <input className="input" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} placeholder="Farm → Green Basket Co." data-testid="trip-route-input" />
            </Field>
          </div>
          <Field label="Date" error={errors.date}>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="trip-date-input" />
          </Field>
          <Field label="Time">
            <input className="input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} data-testid="trip-time-input" />
          </Field>
          <Field label="Load" error={errors.load}>
            <input className="input" value={form.load} onChange={(e) => setForm({ ...form, load: e.target.value })} placeholder="e.g. 500 kg" data-testid="trip-load-input" />
          </Field>
          <Field label="Distance (km)">
            <input className="input" type="number" min="0" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} data-testid="trip-distance-input" />
          </Field>
          <Field label="Vehicle">
            <select className="select" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} data-testid="trip-vehicle-select">
              <option>Tata Ace</option><option>Mahindra Pickup</option><option>Eicher 1110</option><option>Tractor trolley</option>
            </select>
          </Field>
          <Field label="Driver">
            <input className="input" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} placeholder="e.g. Ramesh P." data-testid="trip-driver-input" />
          </Field>
        </div>
      </Modal>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} testId="trip-detail-modal"
        title={viewing?.route} subtitle={viewing?.when}
        footer={<button type="button" className="btn btn-primary" onClick={() => setViewing(null)} data-testid="close-trip-modal-button">Close</button>}>
        {viewing && (
          <div className="detail-list">
            <div className="detail-row"><span><Route size={13} /> Distance</span><strong>{viewing.distance} km</strong></div>
            <div className="detail-row"><span><Truck size={13} /> Vehicle</span><strong>{viewing.vehicle}</strong></div>
            <div className="detail-row"><span><User size={13} /> Driver</span><strong>{viewing.driver}</strong></div>
            <div className="detail-row"><span><Clock size={13} /> Status</span><strong>{viewing.status}</strong></div>
            <div className="detail-row"><span>Load</span><strong>{viewing.load}</strong></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(cancelling)} onClose={() => setCancelling(null)} onConfirm={() => removeTrip(cancelling.id)}
        title="Cancel this trip?" message={cancelling?.route} testId="cancel-trip-dialog" confirmLabel="Cancel trip" />
    </>
  );
}
