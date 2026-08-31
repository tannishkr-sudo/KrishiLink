import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, Edit3, Eye, Leaf, MapPin, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog, EmptyState, Field, Modal, PageHeader, Toolbar, inr } from "@/components/UIKit";
import { GRADES, LOCATIONS, UNITS } from "@/data/seed";
import { useApp } from "@/store/AppStore";

const blank = { name: "", variety: "", grade: "Grade A", quantity: "", unit: "kg", price: "", location: LOCATIONS[0], harvest: "", notes: "" };

function ProduceForm({ value, onChange, errors }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div className="form-grid">
      <Field label="Produce name" error={errors.name}>
        <input className="input" value={value.name} onChange={set("name")} placeholder="e.g. Tomato" data-testid="produce-name-input" />
      </Field>
      <Field label="Variety" hint="Optional but helps buyers">
        <input className="input" value={value.variety} onChange={set("variety")} placeholder="e.g. Hybrid Ruchi" data-testid="produce-variety-input" />
      </Field>
      <Field label="Grade">
        <select className="select" value={value.grade} onChange={set("grade")} data-testid="produce-grade-select">
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </Field>
      <Field label="Quantity" error={errors.quantity}>
        <input className="input" type="number" min="1" value={value.quantity} onChange={set("quantity")} placeholder="e.g. 500" data-testid="produce-quantity-input" />
      </Field>
      <Field label="Unit">
        <select className="select" value={value.unit} onChange={set("unit")} data-testid="produce-unit-select">
          {UNITS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </Field>
      <Field label="Expected price (₹ per kg)" error={errors.price}>
        <input className="input" type="number" min="1" value={value.price} onChange={set("price")} placeholder="e.g. 42" data-testid="produce-price-input" />
      </Field>
      <Field label="Storage location">
        <select className="select" value={value.location} onChange={set("location")} data-testid="produce-location-select">
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </Field>
      <Field label="Harvest date">
        <input className="input" type="date" value={value.harvest} onChange={set("harvest")} data-testid="produce-harvest-input" />
      </Field>
      <div className="full">
        <Field label="Notes for buyers">
          <textarea className="textarea" value={value.notes} onChange={set("notes")} placeholder="Packing, quality, or delivery details" data-testid="produce-notes-input" />
        </Field>
      </div>
    </div>
  );
}

export default function Produce() {
  const { produce, addProduce, updateProduce, removeProduce, toggleSold } = useApp();
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");

  useEffect(() => { if (params.get("add") === "true") { setAdding(true); setParams({}, { replace: true }); } }, [params, setParams]);

  const rows = useMemo(() => produce.filter((p) => {
    const matchesTab = tab === "All" || p.status === tab;
    const text = `${p.name} ${p.variety} ${p.grade} ${p.location}`.toLowerCase();
    return matchesTab && text.includes(query.toLowerCase());
  }), [produce, tab, query]);

  const totalStock = produce.filter((p) => p.status !== "Sold").reduce((s, p) => s + Number(p.quantity), 0);

  const validate = (data) => {
    const next = {};
    if (!data.name.trim()) next.name = "Produce name is required";
    if (!data.quantity || Number(data.quantity) <= 0) next.quantity = "Enter a quantity above 0";
    if (data.price && Number(data.price) <= 0) next.price = "Price must be above 0";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitAdd = () => {
    if (!validate(form)) return;
    addProduce({ ...form, quantity: Number(form.quantity), price: Number(form.price || 0), harvest: form.harvest || "Not set" });
    setAdding(false); setForm(blank); setErrors({});
  };
  const submitEdit = () => {
    if (!validate(form)) return;
    updateProduce(editing.id, { ...form, quantity: Number(form.quantity), price: Number(form.price || 0) });
    setEditing(null); setErrors({});
  };

  const openEdit = (item) => { setEditing(item); setForm({ ...blank, ...item, quantity: String(item.quantity), price: String(item.price) }); setErrors({}); };

  return (
    <>
      <PageHeader eyebrow="Inventory / 04" title="My Produce"
        description={<>Total active stock: <b>{totalStock.toLocaleString("en-IN")} kg</b> across {produce.length} lots.</>}
        action={<button type="button" className="btn btn-primary" data-testid="add-produce-button" onClick={() => { setForm(blank); setErrors({}); setAdding(true); }}><Plus size={17} /> Add Produce</button>} />

      <Toolbar slug="produce" tabs={["All", "Available", "Reserved", "Sold"]} tab={tab} onTab={setTab}
        query={query} onQuery={setQuery} placeholder="Search lots by crop, grade or storage" />

      {rows.length === 0 ? (
        <EmptyState icon={Leaf} title="No produce lots here" message="Add a lot or change the filter to see your inventory."
          action={<button type="button" className="btn btn-primary" data-testid="empty-add-produce-button" onClick={() => setAdding(true)}><Plus size={16} /> Add Produce</button>} />
      ) : (
        <section className="grid-3 prod-grid" data-testid="produce-grid">
          {rows.map((item) => (
            <article className="card prod-card" key={item.id} data-testid={`produce-card-${item.id}`}>
              <div className="prod-top">
                <div className={`crop-icon ${item.tone}`}><Leaf size={19} /></div>
                <div style={{ flex: 1 }}><h3>{item.name}</h3><p>{item.variety || "Fresh stock"} · {item.grade}</p></div>
                <span className={`badge ${item.status === "Sold" ? "" : item.status === "Reserved" ? "gold" : "green"}`} data-testid={`produce-status-${item.id}`}>{item.status}</span>
              </div>
              <div className="prod-qty">{Number(item.quantity).toLocaleString("en-IN")}<small>{item.unit}</small></div>
              <div className="prod-meta">
                <span><MapPin size={14} /> {item.location}</span>
                <span><CalendarDays size={14} /> {item.harvest}</span>
                <span>{inr(item.price)}/kg</span>
              </div>
              <div className="prod-actions">
                <button type="button" className="btn btn-ghost btn-sm" style={{ flex: 1 }} data-testid={`view-lot-${item.id}-button`} onClick={() => setViewing(item)}><Eye size={15} /> View Lot</button>
                <button type="button" className="row-btn" data-testid={`edit-lot-${item.id}-button`} aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)}><Edit3 size={15} /></button>
                <button type="button" className="row-btn" data-testid={`delete-lot-${item.id}-button`} aria-label={`Delete ${item.name}`} onClick={() => setDeleting(item)}><Trash2 size={15} /></button>
              </div>
              <button type="button" className={item.status === "Sold" ? "btn btn-primary btn-sm mt" : "btn btn-outline btn-sm mt"} data-testid={`mark-sold-${item.id}-button`} onClick={() => toggleSold(item.id)}>
                {item.status === "Sold" ? "Mark as available" : "Mark as Sold"}
              </button>
            </article>
          ))}
        </section>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} wide testId="add-produce-modal"
        title="Add a produce lot" subtitle="Buyers see this information when they search the marketplace."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)} data-testid="cancel-add-produce-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submitAdd} data-testid="submit-produce-button">Save lot</button>
        </>}>
        <ProduceForm value={form} onChange={setForm} errors={errors} />
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} wide testId="edit-produce-modal"
        title={`Edit ${editing?.name ?? "lot"}`} subtitle="Update quantity, pricing or storage details."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)} data-testid="cancel-edit-produce-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submitEdit} data-testid="save-produce-changes-button">Save changes</button>
        </>}>
        <ProduceForm value={form} onChange={setForm} errors={errors} />
      </Modal>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} testId="view-lot-modal"
        title={viewing ? `${viewing.name} · ${viewing.grade}` : ""} subtitle={viewing?.notes}
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setViewing(null)} data-testid="close-view-lot-button">Close</button>
          <button type="button" className="btn btn-primary" data-testid="view-lot-edit-button" onClick={() => { openEdit(viewing); setViewing(null); }}><Edit3 size={15} /> Edit lot</button>
        </>}>
        {viewing && (
          <div className="detail-list">
            <div className="detail-row"><span>Quantity</span><strong>{viewing.quantity} {viewing.unit}</strong></div>
            <div className="detail-row"><span>Expected price</span><strong>{inr(viewing.price)} / kg</strong></div>
            <div className="detail-row"><span>Lot value</span><strong>{inr(Number(viewing.quantity) * Number(viewing.price || 0))}</strong></div>
            <div className="detail-row"><span>Storage</span><strong>{viewing.location}</strong></div>
            <div className="detail-row"><span>Harvest date</span><strong>{viewing.harvest}</strong></div>
            <div className="detail-row"><span>Status</span><strong>{viewing.status}</strong></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => removeProduce(deleting.id)}
        title={`Delete ${deleting?.name ?? "lot"}?`} message="This lot will be removed from your inventory." testId="delete-produce-dialog" />
    </>
  );
}
