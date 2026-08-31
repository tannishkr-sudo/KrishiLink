import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Search, X } from "lucide-react";
import { useApp } from "@/store/AppStore";

export function Modal({ open, onClose, title, subtitle, children, footer, testId, wide }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={wide ? "modal wide" : "modal"} role="dialog" aria-modal="true" data-testid={testId}>
        <header className="modal-head">
          <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog" data-testid={`${testId}-close-button`}><X size={17} /></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>, document.body);
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", testId }) {
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={message} testId={testId}
      footer={<>
        <button type="button" className="btn btn-ghost" onClick={onClose} data-testid={`${testId}-cancel-button`}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }} data-testid={`${testId}-confirm-button`}>{confirmLabel}</button>
      </>}>
      <p className="confirm-copy">This action updates your workspace immediately. You can always add the record again later.</p>
    </Modal>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <label className={error ? "field has-error" : "field"}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <em className="field-error">{error}</em> : hint ? <em className="field-hint">{hint}</em> : null}
    </label>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-head">
      <div className="page-head-text">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="lede">{description}</p>}
      </div>
      {action && <div className="head-actions">{action}</div>}
    </div>
  );
}

export function Toolbar({ tabs, tab, onTab, query, onQuery, placeholder, slug, right }) {
  return (
    <div className="toolbar">
      {tabs && (
        <div className="tabs" role="tablist">
          {tabs.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tab === item}
              className={tab === item ? "tab active" : "tab"}
              data-testid={`${slug}-tab-${item.toLowerCase().replaceAll(" ", "-")}`}
              onClick={() => onTab(item)}>{item}</button>
          ))}
        </div>
      )}
      {onQuery && (
        <label className="search">
          <Search size={16} />
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder={placeholder} data-testid={`${slug}-search-input`} />
          {query && <button type="button" onClick={() => onQuery("")} aria-label="Clear search" data-testid={`${slug}-clear-search-button`}><X size={14} /></button>}
        </label>
      )}
      {right}
    </div>
  );
}

export function EmptyState({ icon: Icon = Search, title, message, action }) {
  return (
    <div className="empty" data-testid="empty-state">
      <div className="empty-icon"><Icon size={22} /></div>
      <strong>{title}</strong>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function Badge({ tone = "neutral", children, testId }) {
  return <span className={`badge ${tone}`} data-testid={testId}>{children}</span>;
}

export function Meter({ value, tone = "green" }) {
  return <div className={`meter ${tone}`}><i style={{ width: `${Math.min(100, value)}%` }} /></div>;
}

export function Toggle({ checked, onChange, label, testId }) {
  return (
    <button type="button" className={checked ? "toggle on" : "toggle"} onClick={() => onChange(!checked)} data-testid={testId} aria-pressed={checked} aria-label={label}>
      <i />
    </button>
  );
}

export function Menu({ trigger, children, align = "right", testId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  return (
    <div className="menu-wrap" ref={ref}>
      {trigger(() => setOpen((v) => !v), open)}
      {open && <div className={`menu ${align}`} data-testid={testId} onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toasts" data-testid="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`} data-testid="toast">
          <span className="toast-mark">{t.tone === "error" ? <X size={13} /> : <Check size={13} />}</span>
          <p>{t.message}</p>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss notification" data-testid="dismiss-toast-button"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
