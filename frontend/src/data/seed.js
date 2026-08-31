export const GRADES = ["Grade A", "Grade B", "Organic", "Premium", "Standard"];
export const UNITS = ["kg", "quintal", "tonne"];
export const LOCATIONS = ["Farm Storage 1", "Farm Storage 2", "Warehouse B", "Cold Chain Hub, Pune"];

export const produceSeed = [
  { id: "p1", name: "Tomato", variety: "Hybrid Ruchi", grade: "Grade A", quantity: 800, unit: "kg", price: 42, location: "Farm Storage 1", harvest: "2026-06-08", status: "Available", tone: "red", notes: "Hand picked, packed in 20 kg crates." },
  { id: "p2", name: "Onion", variety: "Nashik Red", grade: "Standard", quantity: 500, unit: "kg", price: 36, location: "Warehouse B", harvest: "2026-06-02", status: "Available", tone: "gold", notes: "Cured for 6 days, low moisture." },
  { id: "p3", name: "Potato", variety: "Russet", grade: "Premium", quantity: 350, unit: "kg", price: 28, location: "Farm Storage 2", harvest: "2026-05-28", status: "Reserved", tone: "stone", notes: "Reserved for FreshRoute weekly contract." },
];

export const requestsSeed = [
  { id: "r1", crop: "Tomato", title: "Need 500 kg Tomato", grade: "Grade A", buyer: "Green Basket Co.", quantity: 500, price: 44, verified: true, distance: 20, delivery: "Delivery preferred", posted: "2 hours ago", tone: "red", saved: false, note: "Weekly retail supply for 14 stores across Pune." },
  { id: "r2", crop: "Onion", title: "Need 1,000 kg Onion", grade: "Standard", buyer: "Sahyadri Organics", quantity: 1000, price: 35, verified: false, distance: 46, delivery: "Pickup from farm", posted: "5 hours ago", tone: "purple", saved: false, note: "Bulk export consolidation, tolerance for mixed sizes." },
  { id: "r3", crop: "Potato", title: "Need 2,000 kg Potato", grade: "Premium", buyer: "FreshRoute Foods", quantity: 2000, price: 30, verified: true, distance: 28, delivery: "Delivery preferred", posted: "Yesterday", tone: "stone", saved: true, note: "Processing plant contract, monthly repeat volume." },
  { id: "r4", crop: "Tomato", title: "Need 250 kg Tomato", grade: "Organic", buyer: "Urban Harvest Kitchens", quantity: 250, price: 52, verified: true, distance: 12, delivery: "Pickup from farm", posted: "Yesterday", tone: "red", saved: false, note: "Chef-driven kitchens, premium pricing for organic lots." },
];

export const listingsSeed = [
  { id: "l1", title: "Green Basket Co.", type: "Buyer", detail: "Looking for 500 kg tomato weekly", location: "Pune", distance: 12, price: "₹44 / kg", rating: 4.8, tone: "green", saved: false },
  { id: "l2", title: "Sahyadri Organics", type: "Seller", detail: "Organic onion, 3,000 kg available", location: "Nashik", distance: 64, price: "₹38 / kg", rating: 4.6, tone: "gold", saved: false },
  { id: "l3", title: "FreshRoute Foods", type: "Buyer", detail: "Weekly potato processing contract", location: "Satara", distance: 28, price: "₹30 / kg", rating: 4.9, tone: "blue", saved: true },
  { id: "l4", title: "Krishna Valley Farms", type: "Seller", detail: "Grade A tomato, 1,200 kg ready", location: "Baramati", distance: 41, price: "₹40 / kg", rating: 4.4, tone: "red", saved: false },
];

export const pricesSeed = [
  { crop: "Tomato", mandi: "Pune", price: 42, change: 12, tone: "red", series: [{ d: "Mon", p: 34 }, { d: "Tue", p: 36 }, { d: "Wed", p: 35 }, { d: "Thu", p: 38 }, { d: "Fri", p: 40 }, { d: "Sat", p: 41 }, { d: "Sun", p: 42 }] },
  { crop: "Onion", mandi: "Nashik", price: 36, change: 4, tone: "gold", series: [{ d: "Mon", p: 33 }, { d: "Tue", p: 34 }, { d: "Wed", p: 34 }, { d: "Thu", p: 35 }, { d: "Fri", p: 35 }, { d: "Sat", p: 36 }, { d: "Sun", p: 36 }] },
  { crop: "Potato", mandi: "Satara", price: 28, change: -2, tone: "stone", series: [{ d: "Mon", p: 30 }, { d: "Tue", p: 30 }, { d: "Wed", p: 29 }, { d: "Thu", p: 29 }, { d: "Fri", p: 28 }, { d: "Sat", p: 28 }, { d: "Sun", p: 28 }] },
  { crop: "Cabbage", mandi: "Pune", price: 18, change: 6, tone: "green", series: [{ d: "Mon", p: 15 }, { d: "Tue", p: 16 }, { d: "Wed", p: 16 }, { d: "Thu", p: 17 }, { d: "Fri", p: 17 }, { d: "Sat", p: 18 }, { d: "Sun", p: 18 }] },
];

export const storageSeed = [
  { id: "s1", name: "Farm Storage 1", type: "On-farm shed", distance: 1.2, capacity: 1200, used: 800, temp: "Ambient", status: "Healthy" },
  { id: "s2", name: "Warehouse B", type: "Cold storage", distance: 8, capacity: 2000, used: 500, temp: "4°C", status: "Healthy" },
  { id: "s3", name: "Cold Chain Hub, Pune", type: "Shared cold room", distance: 22, capacity: 5000, used: 4300, temp: "2°C", status: "Filling up" },
];

export const transportSeed = [
  { id: "t1", route: "Farm → Green Basket Co.", when: "Tomorrow · 09:00 AM", distance: 18, load: "800 kg", vehicle: "Tata Ace", driver: "Ramesh P.", status: "Scheduled" },
  { id: "t2", route: "Farm → Warehouse B", when: "Friday · 02:30 PM", distance: 8, load: "500 kg", vehicle: "Mahindra Pickup", driver: "Sunil K.", status: "Scheduled" },
  { id: "t3", route: "Farm → FreshRoute Foods", when: "12 Jun · 07:15 AM", distance: 28, load: "350 kg", vehicle: "Eicher 1110", driver: "Imran S.", status: "Delivered" },
];

export const ordersSeed = [
  { id: "o1", code: "KL-2048", buyer: "Green Basket Co.", item: "Tomato · Grade A", qty: "800 kg", amount: 33600, status: "In transit", date: "2026-06-14" },
  { id: "o2", code: "KL-2044", buyer: "Urban Harvest Kitchens", item: "Tomato · Organic", qty: "250 kg", amount: 13000, status: "Pending", date: "2026-06-13" },
  { id: "o3", code: "KL-2041", buyer: "FreshRoute Foods", item: "Potato · Premium", qty: "350 kg", amount: 9800, status: "Completed", date: "2026-06-12" },
  { id: "o4", code: "KL-2036", buyer: "Sahyadri Organics", item: "Onion · Standard", qty: "500 kg", amount: 18000, status: "Completed", date: "2026-06-08" },
];

export const conversationsSeed = [
  {
    id: "c1", name: "Green Basket Co.", role: "Buyer · Pune", initials: "GB", online: true, unread: 1,
    messages: [
      { id: "m1", from: "them", type: "text", text: "Can we confirm the delivery window for tomorrow?", time: "10:42 AM" },
      { id: "m2", from: "me", type: "text", text: "Yes, loading at 8 AM. Should reach you by 10:30.", time: "10:45 AM" },
      { id: "m3", from: "them", type: "text", text: "Perfect. Please share the crate count once packed.", time: "10:52 AM" },
    ],
  },
  {
    id: "c2", name: "Sahyadri Organics", role: "Seller · Nashik", initials: "SO", online: false, unread: 0,
    messages: [{ id: "m4", from: "them", type: "text", text: "Your onion listing looks great. Any price flexibility?", time: "Yesterday" }],
  },
  {
    id: "c3", name: "FreshRoute Foods", role: "Buyer · Satara", initials: "FR", online: true, unread: 2,
    messages: [
      { id: "m5", from: "them", type: "text", text: "Monthly contract renewal starts next week.", time: "Yesterday" },
      { id: "m6", from: "them", type: "text", text: "Can you hold 2,000 kg potato for us?", time: "Yesterday" },
    ],
  },
];

export const notificationsSeed = [
  { id: "n1", title: "Tomato price up 12% in Pune mandi", time: "12 minutes ago", read: false, tone: "green" },
  { id: "n2", title: "Order KL-2048 is ready for pickup", time: "Yesterday, 4:30 PM", read: false, tone: "gold" },
  { id: "n3", title: "You matched with Green Basket Co.", time: "Yesterday, 11:12 AM", read: true, tone: "blue" },
];

export const activitySeed = [
  { id: "a1", title: "Tomato listing viewed by 3 buyers", time: "12 minutes ago", tone: "green" },
  { id: "a2", title: "Order #KL-2048 is ready for pickup", time: "Yesterday, 4:30 PM", tone: "gold" },
  { id: "a3", title: "You matched with Green Basket Co.", time: "Yesterday, 11:12 AM", tone: "blue" },
  { id: "a4", title: "Warehouse B confirmed 500 kg intake", time: "2 days ago", tone: "blue" },
];

export const revenueSeries = [
  { m: "Jan", value: 42000, volume: 900 }, { m: "Feb", value: 51000, volume: 1100 },
  { m: "Mar", value: 47000, volume: 1020 }, { m: "Apr", value: 63000, volume: 1350 },
  { m: "May", value: 71000, volume: 1480 }, { m: "Jun", value: 82400, volume: 1650 },
];

export const profileSeed = {
  name: "Arjun Singh", phone: "+91 98220 41188", email: "arjun@krishilink.in",
  village: "Wagholi", district: "Pune", state: "Maharashtra", farmSize: "6.5",
  crops: "Tomato, Onion, Potato", language: "English", about: "Third generation farmer focused on graded, traceable vegetable lots for retail buyers.",
};
