import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, CircleUserRound, Home as HomeIcon, Leaf, LineChart, LogOut, Menu as MenuIcon, MessageCircle, Package, Plus, Settings, ShoppingBasket, Sparkles, Store, Truck, Warehouse, X } from "lucide-react";
import { Menu, Toaster } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const navItems = [
  ["/", "Home", HomeIcon], ["/marketplace", "Marketplace", Store], ["/prices", "Market Prices", LineChart],
  ["/produce", "My Produce", Leaf], ["/requests", "Buyer Requests", ShoppingBasket], ["/storage", "Storage", Warehouse],
  ["/transport", "Transport", Truck], ["/orders", "Orders", Package], ["/messages", "Messages", MessageCircle], ["/profile", "Profile", CircleUserRound],
];

export default function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const { notifications, markNotificationsRead, dismissNotification, language, setLanguage, profile, conversations, requests, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const badges = { "/messages": conversations.reduce((sum, c) => sum + c.unread, 0), "/requests": requests.length };
  const crumb = navItems.find(([to]) => to !== "/" && location.pathname.startsWith(to))?.[1] ?? "Home";

  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <button type="button" className="mobile-toggle" data-testid="mobile-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={18} /> : <MenuIcon size={18} />}</button>
      {open && <div className="side-scrim" onClick={() => setOpen(false)} />}

      <aside className={open ? "sidebar is-open" : "sidebar"} data-testid="app-sidebar">
        <div className="brand">
          <div className="brand-mark"><Leaf size={18} /></div>
          <div><strong>KrishiLink</strong><span>Agricultural Marketplace</span></div>
        </div>
        <nav className="nav">
          {navItems.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {badges[to] ? <em className="nav-badge">{badges[to]}</em> : null}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="side-cta" data-testid="sidebar-post-produce-button" onClick={() => { setOpen(false); navigate("/produce?add=true"); }}>
          <Plus size={17} /> Post Produce
        </button>
        <button type="button" className="side-user" data-testid="sidebar-profile-button" onClick={() => { setOpen(false); navigate("/profile"); }}>
          <span className="avatar">AS</span>
          <span className="side-user-text"><strong>{profile.name}</strong><span>Farmer account</span></span>
          <Settings size={15} />
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumbs">
            <button type="button" className="crumb-link" data-testid="crumb-workspace-button" onClick={() => navigate("/")}>Workspace</button>
            <ChevronDown size={13} className="crumb-sep" />
            <span data-testid="crumb-current">{crumb}</span>
          </div>
          <div className="top-actions">
            <Menu testId="language-menu" trigger={(t) => <button type="button" className="lang-btn" onClick={t} data-testid="language-button">{language}</button>}>
              {["EN", "हिं", "मर"].map((code) => (
                <button key={code} type="button" className="menu-item" data-testid={`language-option-${code}`} onClick={() => { setLanguage(code); toast(`Language set to ${code}`); }}>{code === "EN" ? "English" : code === "हिं" ? "हिन्दी" : "मराठी"}</button>
              ))}
            </Menu>

            <Menu testId="notifications-panel" trigger={(t) => (
              <button type="button" className={unreadNotifications ? "icon-btn has-dot" : "icon-btn"} onClick={t} data-testid="notifications-button" aria-label="Notifications"><Bell size={18} /></button>
            )}>
              <div className="menu-head"><strong>Notifications</strong><button type="button" onClick={markNotificationsRead} data-testid="mark-all-read-button">Mark all read</button></div>
              {notifications.length === 0 && <p className="menu-empty">You are all caught up.</p>}
              {notifications.map((n) => (
                <div key={n.id} className={n.read ? "notif" : "notif unread"} data-testid={`notification-${n.id}`}>
                  <i className={`dot ${n.tone}`} />
                  <div><strong>{n.title}</strong><small>{n.time}</small></div>
                  <button type="button" onClick={() => dismissNotification(n.id)} aria-label="Dismiss" data-testid={`dismiss-notification-${n.id}`}><X size={13} /></button>
                </div>
              ))}
            </Menu>

            <Menu testId="profile-menu" trigger={(t) => (
              <button type="button" className="profile-btn" onClick={t} data-testid="profile-menu-button">
                <span className="avatar sm">AS</span><span className="profile-name">{profile.name}</span><ChevronDown size={13} />
              </button>
            )}>
              <div className="menu-head"><strong>{profile.name}</strong><span className="menu-sub">{profile.email}</span></div>
              <button type="button" className="menu-item" data-testid="profile-menu-view-profile" onClick={() => navigate("/profile")}><CircleUserRound size={15} /> View profile</button>
              <button type="button" className="menu-item" data-testid="profile-menu-settings" onClick={() => navigate("/profile/settings")}><Settings size={15} /> Account settings</button>
              <button type="button" className="menu-item" data-testid="profile-menu-upgrade" onClick={() => toast("KrishiLink Pro waitlist joined")}><Sparkles size={15} /> Join Pro waitlist</button>
              <button type="button" className="menu-item danger" data-testid="profile-menu-signout" onClick={() => toast("Signed out of this device", "error")}><LogOut size={15} /> Sign out</button>
            </Menu>
          </div>
        </header>
        <div className="page" key={location.pathname}>{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
