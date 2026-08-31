import { useState } from "react";
import { BadgeCheck, MapPin, Save, Star, Truck } from "lucide-react";
import { Field, PageHeader, Toggle, inr } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

export default function Profile() {
  const { profile, saveProfile, orders, produce, language, setLanguage, toast } = useApp();
  const [form, setForm] = useState(profile);
  const [tab, setTab] = useState("Farm details");
  const [prefs, setPrefs] = useState({ priceAlerts: true, buyerRequests: true, transportUpdates: false, publicProfile: true });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const earned = orders.filter((o) => o.status === "Completed").reduce((s, o) => s + o.amount, 0);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[+0-9 -]{8,}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length) return;
    saveProfile(form);
  };

  const togglePref = (key) => (value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    toast(`${key === "publicProfile" ? "Profile visibility" : "Notification preference"} updated`);
  };

  return (
    <>
      <PageHeader eyebrow="Account / 10" title="Profile"
        description="Your farm identity, preferences, and account details."
        action={<button type="button" className="btn btn-outline" data-testid="share-profile-button" onClick={() => toast("Profile link copied")}>Share profile</button>} />

      <div className="split">
        <section className="panel" data-testid="profile-form-panel">
          <div className="tabs" style={{ marginBottom: 22 }}>
            {["Farm details", "Preferences"].map((t) => (
              <button type="button" key={t} className={tab === t ? "tab active" : "tab"} data-testid={`profile-tab-${t.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {tab === "Farm details" ? (
            <form onSubmit={submit}>
              <div className="form-grid">
                <Field label="Full name" error={errors.name}><input className="input" value={form.name} onChange={set("name")} data-testid="profile-name-input" /></Field>
                <Field label="Phone" error={errors.phone}><input className="input" value={form.phone} onChange={set("phone")} data-testid="profile-phone-input" /></Field>
                <Field label="Email"><input className="input" type="email" value={form.email} onChange={set("email")} data-testid="profile-email-input" /></Field>
                <Field label="Village"><input className="input" value={form.village} onChange={set("village")} data-testid="profile-village-input" /></Field>
                <Field label="District"><input className="input" value={form.district} onChange={set("district")} data-testid="profile-district-input" /></Field>
                <Field label="State"><input className="input" value={form.state} onChange={set("state")} data-testid="profile-state-input" /></Field>
                <Field label="Farm size (acres)"><input className="input" type="number" min="0" step="0.1" value={form.farmSize} onChange={set("farmSize")} data-testid="profile-farm-size-input" /></Field>
                <Field label="Primary crops"><input className="input" value={form.crops} onChange={set("crops")} data-testid="profile-crops-input" /></Field>
                <div className="full">
                  <Field label="About your farm" hint="Buyers read this before contacting you">
                    <textarea className="textarea" value={form.about} onChange={set("about")} data-testid="profile-about-input" />
                  </Field>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" data-testid="save-profile-button"><Save size={15} /> Save profile</button>
                <button type="button" className="btn btn-ghost" data-testid="reset-profile-button" onClick={() => { setForm(profile); setErrors({}); toast("Changes reverted"); }}>Reset</button>
              </div>
            </form>
          ) : (
            <div data-testid="profile-preferences">
              {[["priceAlerts", "Price alerts", "Get notified when mandi rates move sharply."], ["buyerRequests", "Buyer request matches", "Alert me when a request matches my produce."], ["transportUpdates", "Transport updates", "Notify me on pickup and delivery changes."], ["publicProfile", "Public profile", "Let buyers discover my farm in the marketplace."]].map(([key, title, copy]) => (
                <div className="list-row" key={key}>
                  <div className="row-main"><strong>{title}</strong><span>{copy}</span></div>
                  <Toggle checked={prefs[key]} onChange={togglePref(key)} label={title} testId={`toggle-${key}`} />
                </div>
              ))}
              <div className="list-row">
                <div className="row-main"><strong>Preferred language</strong><span>Used across the app and notifications.</span></div>
                <select className="select" style={{ width: 160 }} value={language} onChange={(e) => { setLanguage(e.target.value); toast("Language updated"); }} data-testid="profile-language-select">
                  <option value="EN">English</option><option value="हिं">हिन्दी</option><option value="मर">मराठी</option>
                </select>
              </div>
            </div>
          )}
        </section>

        <aside className="stack">
          <div className="panel" data-testid="profile-summary-card">
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span className="avatar lg">AS</span>
              <div><h3 style={{ fontSize: 19 }}>{profile.name}</h3><p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>{profile.village}, {profile.district}</p></div>
            </div>
            <div className="chips" style={{ marginTop: 18 }}>
              <span className="badge green"><BadgeCheck size={12} /> Verified farmer</span>
              <span className="badge gold"><Star size={12} /> 4.9 rating</span>
            </div>
            <div className="detail-list" style={{ marginTop: 18 }}>
              <div className="detail-row"><span><MapPin size={13} /> Farm size</span><strong>{profile.farmSize} acres</strong></div>
              <div className="detail-row"><span>Active lots</span><strong>{produce.filter((p) => p.status !== "Sold").length}</strong></div>
              <div className="detail-row"><span>Completed orders</span><strong>{orders.filter((o) => o.status === "Completed").length}</strong></div>
              <div className="detail-row"><span>Lifetime earnings</span><strong>{inr(earned)}</strong></div>
            </div>
          </div>
          <div className="aside-card">
            <div className="aside-icon"><Truck size={20} /></div>
            <p className="eyebrow">Profile strength</p>
            <h3>86% complete</h3>
            <p>Add a farm photo and bank details to unlock priority buyer matching.</p>
            <button type="button" className="btn btn-primary btn-sm" data-testid="complete-profile-button" onClick={() => toast("We will guide you through the last steps")}>Finish setup</button>
          </div>
        </aside>
      </div>
    </>
  );
}
