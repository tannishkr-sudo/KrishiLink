import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { activitySeed, conversationsSeed, listingsSeed, notificationsSeed, ordersSeed, pricesSeed, produceSeed, profileSeed, requestsSeed, storageSeed, transportSeed } from "@/data/seed";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const uid = (prefix) => `${prefix}${Math.random().toString(36).slice(2, 8)}`;

export function AppProvider({ children }) {
  const [produce, setProduce] = useState(produceSeed);
  const [requests, setRequests] = useState(requestsSeed);
  const [listings, setListings] = useState(listingsSeed);
  const [prices] = useState(pricesSeed);
  const [alerts, setAlerts] = useState([]);
  const [storage, setStorage] = useState(storageSeed);
  const [transport, setTransport] = useState(transportSeed);
  const [orders, setOrders] = useState(ordersSeed);
  const [conversations, setConversations] = useState(conversationsSeed);
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [activity, setActivity] = useState(activitySeed);
  const [profile, setProfile] = useState(profileSeed);
  const [language, setLanguage] = useState("EN");
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, tone = "success") => {
    const id = uid("t");
    setToasts((list) => [...list, { id, message, tone }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const logActivity = useCallback((title, tone = "green") => {
    setActivity((list) => [{ id: uid("a"), title, time: "Just now", tone }, ...list].slice(0, 8));
  }, []);

  const value = useMemo(() => ({
    produce, requests, listings, prices, alerts, storage, transport, orders,
    conversations, notifications, activity, profile, language, toasts,
    toast, dismissToast, setLanguage,

    addProduce: (item) => { setProduce((l) => [{ ...item, id: uid("p"), tone: "green", status: "Available" }, ...l]); logActivity(`${item.name} lot added to inventory`); toast(`${item.name} added to your produce`); },
    updateProduce: (id, patch) => { setProduce((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p))); toast("Produce lot updated"); },
    removeProduce: (id) => { const found = produce.find((p) => p.id === id); setProduce((l) => l.filter((p) => p.id !== id)); toast(`${found?.name ?? "Lot"} removed`, "error"); },
    toggleSold: (id) => { setProduce((l) => l.map((p) => (p.id === id ? { ...p, status: p.status === "Sold" ? "Available" : "Sold" } : p))); },

    toggleSaveRequest: (id) => setRequests((l) => l.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r))),
    toggleSaveListing: (id) => setListings((l) => l.map((x) => (x.id === id ? { ...x, saved: !x.saved } : x))),
    addListing: (item) => { setListings((l) => [{ ...item, id: uid("l"), rating: 5, tone: "green", saved: false }, ...l]); toast("Listing published to marketplace"); },

    addAlert: (alert) => { setAlerts((l) => [...l, { ...alert, id: uid("al") }]); toast(`Alert set for ${alert.crop} at ₹${alert.target}/kg`); },
    removeAlert: (id) => setAlerts((l) => l.filter((a) => a.id !== id)),

    addStorage: (item) => { setStorage((l) => [...l, { ...item, id: uid("s"), status: "Healthy" }]); toast(`${item.name} added to storage`); },
    bookStorage: (id, qty) => { setStorage((l) => l.map((s) => (s.id === id ? { ...s, used: Math.min(s.capacity, s.used + Number(qty)) } : s))); toast(`${qty} kg space booked`); },
    removeStorage: (id) => { setStorage((l) => l.filter((s) => s.id !== id)); toast("Storage location removed", "error"); },

    addTrip: (item) => { setTransport((l) => [{ ...item, id: uid("t"), status: "Scheduled" }, ...l]); logActivity(`Pickup scheduled: ${item.route}`, "gold"); toast("Pickup scheduled"); },
    updateTrip: (id, patch) => { setTransport((l) => l.map((t) => (t.id === id ? { ...t, ...patch } : t))); toast("Trip updated"); },
    removeTrip: (id) => { setTransport((l) => l.filter((t) => t.id !== id)); toast("Trip cancelled", "error"); },

    updateOrder: (id, patch) => { setOrders((l) => l.map((o) => (o.id === id ? { ...o, ...patch } : o))); toast(`Order marked ${patch.status ?? "updated"}`); },

    sendMessage: (conversationId, message) => {
      setConversations((list) => list.map((c) => (c.id === conversationId
        ? { ...c, messages: [...c.messages, { ...message, id: uid("m"), from: "me", time: "Just now" }] }
        : c)));
    },
    readConversation: (conversationId) => setConversations((list) => list.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))),
    startConversation: (name, role) => { const id = uid("c"); setConversations((l) => [{ id, name, role, initials: name.slice(0, 2).toUpperCase(), online: false, unread: 0, messages: [] }, ...l]); toast(`Conversation started with ${name}`); return id; },

    markNotificationsRead: () => setNotifications((l) => l.map((n) => ({ ...n, read: true }))),
    dismissNotification: (id) => setNotifications((l) => l.filter((n) => n.id !== id)),

    saveProfile: (patch) => { setProfile((p) => ({ ...p, ...patch })); toast("Profile saved"); },
  }), [produce, requests, listings, prices, alerts, storage, transport, orders, conversations, notifications, activity, profile, language, toasts, toast, dismissToast, logActivity]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
