import { useState, useEffect, useCallback, useRef } from "react";

// ─── MOTIVATIONAL QUOTES ─────────────────────────────────────────────
const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Your home is the foundation of your story.", author: "Unknown" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "Home is where your story begins.", author: "Annie Danielson" },
  { text: "The best investment on earth is earth.", author: "Louis Glickman" },
  { text: "Don't wait to buy real estate. Buy real estate and wait.", author: "Will Rogers" },
  { text: "Real estate is an imperishable asset, ever increasing in value.", author: "Russell Sage" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Owning a home is a keystone of wealth.", author: "Suze Orman" },
  { text: "To plant a garden is to believe in tomorrow.", author: "Audrey Hepburn" },
];

// ─── MOCK DATA ───────────────────────────────────────────────────────
const MOCK_USERS = {
  admin: { id: "u1", name: "Vickie Mitchell", email: "vickiemitchellFL@gmail.com", role: "admin", avatar: "VM" },
  teammate: { id: "u2", name: "Sarah Johnson", email: "sarah@example.com", role: "teammate", avatar: "SJ" },
  client: { id: "u3", name: "Carlos & Maria Reyes", email: "creyes@example.com", role: "client", avatar: "CR" },
};

const MOCK_CLIENTS = [
  { id: "c1", name: "Carlos & Maria Reyes", email: "creyes@example.com", phone: "813-555-0147", type: "Buyer", status: "Active", stage: "Under Contract", property: "17647 Cortes Creek Blvd", budget: "$540,000", notes: "Relocating from Puerto Rico. Prefer gated community with low HOA. Pre-approved with Veterans United.", lastContact: "2026-04-06", avatar: "CR" },
  { id: "c2", name: "James & Patty O'Brien", email: "jobrien@example.com", phone: "813-555-0298", type: "Seller", status: "Active", stage: "Listed", property: "9821 Talavera Ct", budget: "$489,900", notes: "Motivated sellers — job transfer to Charlotte. Need to close by June 15. Kitchen recently updated.", lastContact: "2026-04-07", avatar: "JO" },
  { id: "c3", name: "Thandiwe Okafor", email: "tokafor@example.com", phone: "813-555-0331", type: "Buyer", status: "Active", stage: "Searching", property: "—", budget: "$350,000–$400,000", notes: "First-time buyer. Interested in Wesley Chapel / Land O' Lakes. Wants new construction if possible.", lastContact: "2026-04-05", avatar: "TO" },
  { id: "c4", name: "Linda Chen", email: "lchen@example.com", phone: "813-555-0412", type: "Seller", status: "Lead", stage: "Pre-Listing", property: "4420 Bayshore Blvd", budget: "$715,000", notes: "Inherited property. Needs estate sale guidance. Considering light staging.", lastContact: "2026-04-02", avatar: "LC" },
  { id: "c5", name: "Derek & Aisha Williams", email: "dwilliams@example.com", phone: "813-555-0589", type: "Buyer", status: "Past", stage: "Closed", property: "2210 Cypress Bend Dr", budget: "$475,000", notes: "Closed March 2026. Happy clients — promised referrals. Follow up Q3 for anniversary.", lastContact: "2026-03-28", avatar: "DW" },
];

const MOCK_TRANSACTIONS = [
  { id: "t1", property: "17647 Cortes Creek Blvd", client: "Carlos & Maria Reyes", type: "Buy", price: "$539,900", status: "Under Contract", closingDate: "2026-05-15", steps: [
    { label: "Offer Submitted", done: true, date: "Mar 20" },
    { label: "Offer Accepted", done: true, date: "Mar 22" },
    { label: "Inspection", done: true, date: "Apr 01" },
    { label: "Appraisal", done: false, date: "Apr 12" },
    { label: "Final Walkthrough", done: false, date: "May 12" },
    { label: "Closing", done: false, date: "May 15" },
  ]},
  { id: "t2", property: "9821 Talavera Ct", client: "James & Patty O'Brien", type: "Sell", price: "$489,900", status: "Listed", closingDate: "—", steps: [
    { label: "Listing Agreement", done: true, date: "Apr 01" },
    { label: "Photos & Staging", done: true, date: "Apr 04" },
    { label: "Listed on MLS", done: true, date: "Apr 07" },
    { label: "Showings", done: false, date: "Active" },
    { label: "Offer Received", done: false, date: "—" },
    { label: "Closing", done: false, date: "—" },
  ]},
  { id: "t3", property: "2210 Cypress Bend Dr", client: "Derek & Aisha Williams", type: "Buy", price: "$475,000", status: "Closed", closingDate: "2026-03-28", steps: [
    { label: "Offer Submitted", done: true, date: "Feb 10" },
    { label: "Offer Accepted", done: true, date: "Feb 12" },
    { label: "Inspection", done: true, date: "Feb 20" },
    { label: "Appraisal", done: true, date: "Mar 05" },
    { label: "Final Walkthrough", done: true, date: "Mar 26" },
    { label: "Closing", done: true, date: "Mar 28" },
  ]},
];

const MOCK_FILES = [
  { id: "f1", name: "Reyes_PreApproval_Letter.pdf", client: "Carlos & Maria Reyes", date: "2026-03-18", size: "245 KB", category: "Finance" },
  { id: "f2", name: "CortesCreek_Inspection_Report.pdf", client: "Carlos & Maria Reyes", date: "2026-04-01", size: "1.8 MB", category: "Inspection" },
  { id: "f3", name: "OBrien_Listing_Agreement.pdf", client: "James & Patty O'Brien", date: "2026-04-01", size: "312 KB", category: "Listing" },
  { id: "f4", name: "OBrien_Property_Photos.zip", client: "James & Patty O'Brien", date: "2026-04-04", size: "48.2 MB", category: "Media" },
  { id: "f5", name: "Williams_Closing_Disclosure.pdf", client: "Derek & Aisha Williams", date: "2026-03-26", size: "198 KB", category: "Closing" },
  { id: "f6", name: "Okafor_Buyer_Preferences.docx", client: "Thandiwe Okafor", date: "2026-04-05", size: "52 KB", category: "General" },
  { id: "f7", name: "Chen_Estate_Docs.pdf", client: "Linda Chen", date: "2026-04-02", size: "3.1 MB", category: "Legal" },
];

const MOCK_MESSAGES = [
  { id: "m1", from: "Vickie Mitchell", to: "Carlos & Maria Reyes", date: "2026-04-06 2:15 PM", text: "Great news — inspection came back clean! Appraisal is scheduled for the 12th. I'll keep you posted." },
  { id: "m2", from: "Carlos & Maria Reyes", to: "Vickie Mitchell", date: "2026-04-06 3:40 PM", text: "That's wonderful! We're so excited. Do we need to be there for the appraisal?" },
  { id: "m3", from: "Vickie Mitchell", to: "Carlos & Maria Reyes", date: "2026-04-06 3:55 PM", text: "Nope, the appraiser handles it independently. You just sit tight — I've got you covered!" },
];

const MOCK_TEAMMATES = [
  { id: "tm1", name: "Sarah Johnson", email: "sarah@example.com", role: "teammate", permissions: ["view_clients", "add_notes", "upload_files"], avatar: "SJ" },
  { id: "tm2", name: "Marcus Rivera", email: "marcus@example.com", role: "teammate", permissions: ["view_clients", "add_notes"], avatar: "MR" },
];

const MOCK_NEWS = [
  { title: "Tampa Bay Housing Inventory Rises 12% in Q1 2026", source: "Tampa Bay Times", date: "Apr 7, 2026", snippet: "New listings across Hillsborough and Pasco counties surged in the first quarter, giving buyers more options..." },
  { title: "Mortgage Rates Hold Steady Near 6.1%", source: "Freddie Mac", date: "Apr 4, 2026", snippet: "The 30-year fixed-rate mortgage averaged 6.12% this week, providing stability for spring buyers..." },
  { title: "Spring Hill Named Top Affordable Suburb in Florida", source: "Realtor.com", date: "Apr 2, 2026", snippet: "Communities like Talavera and Timber Pines continue to attract families priced out of Tampa proper..." },
];

// ─── ICONS (inline SVG) ──────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const icons = {
    dashboard: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    clients: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    transactions: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    files: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    messages: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    team: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    settings: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    chevron: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    news: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/><path d="M21 12h-8"/><path d="M21 16h-8"/><path d="M21 8h-8"/></svg>,
    home: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    star: <svg style={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    logout: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    phone: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    mail: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    saved: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  };
  return icons[name] || null;
};

// ─── STYLES ──────────────────────────────────────────────────────────
const C = {
  black: "#0D0D0D",
  charcoal: "#1A1A1A",
  dark: "#242424",
  mid: "#333333",
  border: "#2A2A2A",
  muted: "#888888",
  light: "#B0B0B0",
  white: "#F5F5F0",
  gold: "#C8A951",
  goldLight: "#D4BC6A",
  goldDim: "rgba(200,169,81,0.12)",
  goldBorder: "rgba(200,169,81,0.25)",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.12)",
  blue: "#60A5FA",
  blueDim: "rgba(96,165,250,0.12)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.12)",
  orange: "#FB923C",
  orangeDim: "rgba(251,146,60,0.12)",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────

const Avatar = ({ initials, size = 38, color = C.gold }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${color}, ${color}88)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: size * 0.35, color: C.black, flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
  }}>{initials}</div>
);

const Badge = ({ children, color = C.gold, bg }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
    color: color, background: bg || `${color}18`,
    fontFamily: "'DM Sans', sans-serif",
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, accent = C.gold }) => (
  <div style={{
    background: C.charcoal, borderRadius: 16, padding: "24px 28px",
    border: `1px solid ${C.border}`, flex: "1 1 200px", minWidth: 180,
  }}>
    <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 36, fontWeight: 800, color: accent, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.light, marginTop: 6 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, action, onAction }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
    <h2 style={{ fontSize: 22, fontWeight: 700, color: C.white, margin: 0, fontFamily: "'Playfair Display', serif" }}>{title}</h2>
    {action && (
      <button onClick={onAction} style={{
        background: C.gold, color: C.black, border: "none", borderRadius: 10,
        padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif",
      }}>
        <Icon name="plus" size={15}/> {action}
      </button>
    )}
  </div>
);

// ─── LOGIN SCREEN ────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: C.black,
      fontFamily: "'DM Sans', sans-serif", padding: 20,
    }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 900, color: C.black,
        }}>VM</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: "0 0 4px", fontFamily: "'Playfair Display', serif" }}>Mitchell Realty Hub</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Realty ONE Group Advantage &middot; Tampa Bay</p>
      </div>
      <div style={{
        background: C.charcoal, borderRadius: 20, padding: 32, width: "100%", maxWidth: 400,
        border: `1px solid ${C.border}`,
      }}>
        <p style={{ fontSize: 13, color: C.light, marginTop: 0, textAlign: "center", marginBottom: 24 }}>Select your role to preview the experience</p>
        {[
          { key: "admin", label: "Vickie Mitchell", sub: "Admin · Full Access", avatar: "VM" },
          { key: "teammate", label: "Sarah Johnson", sub: "Teammate · Limited", avatar: "SJ" },
          { key: "client", label: "Carlos & Maria Reyes", sub: "Client · Portal", avatar: "CR" },
        ].map(u => (
          <button key={u.key} onClick={() => setSelected(u.key)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 14,
            padding: "14px 18px", borderRadius: 14, cursor: "pointer", marginBottom: 10,
            background: selected === u.key ? C.goldDim : "transparent",
            border: `1.5px solid ${selected === u.key ? C.gold : C.border}`,
            transition: "all 0.2s",
          }}>
            <Avatar initials={u.avatar} size={42} />
            <div style={{ textAlign: "left" }}>
              <div style={{ color: C.white, fontWeight: 600, fontSize: 15 }}>{u.label}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{u.sub}</div>
            </div>
          </button>
        ))}
        <button
          disabled={!selected}
          onClick={() => onLogin(selected)}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            marginTop: 16, fontSize: 15, fontWeight: 700, cursor: selected ? "pointer" : "default",
            background: selected ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : C.mid,
            color: selected ? C.black : C.muted, transition: "all 0.25s",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >Sign In</button>
      </div>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 32 }}>
        Supabase Auth · Row-Level Security · Role-Based Access
      </p>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────
const Sidebar = ({ role, active, onNav, onLogout }) => {
  const adminNav = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "clients", icon: "clients", label: "Clients" },
    { id: "transactions", icon: "transactions", label: "Transactions" },
    { id: "files", icon: "files", label: "Files" },
    { id: "messages", icon: "messages", label: "Messages" },
    { id: "team", icon: "team", label: "Team" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];
  const teammateNav = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "clients", icon: "clients", label: "Clients" },
    { id: "transactions", icon: "transactions", label: "Transactions" },
    { id: "files", icon: "files", label: "Files" },
    { id: "messages", icon: "messages", label: "Messages" },
  ];
  const clientNav = [
    { id: "portal", icon: "home", label: "My Home" },
    { id: "my-docs", icon: "files", label: "My Documents" },
    { id: "my-timeline", icon: "transactions", label: "My Timeline" },
    { id: "my-messages", icon: "messages", label: "Messages" },
    { id: "my-searches", icon: "saved", label: "Saved Searches" },
  ];
  const nav = role === "admin" ? adminNav : role === "teammate" ? teammateNav : clientNav;

  return (
    <div style={{
      width: 240, background: C.charcoal, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 14, color: C.black,
          }}>VM</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.white, lineHeight: 1.2 }}>Mitchell Realty</div>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: 1, textTransform: "uppercase" }}>Hub</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {nav.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, cursor: "pointer", marginBottom: 2,
              background: isActive ? C.goldDim : "transparent",
              border: "none", color: isActive ? C.gold : C.light,
              fontWeight: isActive ? 600 : 400, fontSize: 14, transition: "all 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <Icon name={item.icon} size={18}/> {item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "16px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={onLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
          borderRadius: 10, border: "none", background: "transparent", color: C.muted,
          cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        }}>
          <Icon name="logout" size={16}/> Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────
const AdminDashboard = ({ onNav }) => {
  const today = new Date();
  const quote = QUOTES[today.getDate() % QUOTES.length];
  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.dark} 100%)`,
        borderRadius: 20, padding: "32px 36px", marginBottom: 28,
        border: `1px solid ${C.goldBorder}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `${C.gold}08` }}/>
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 13, color: C.gold, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Good {today.getHours() < 12 ? "Morning" : today.getHours() < 17 ? "Afternoon" : "Evening"}, Vickie</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: "0 0 12px", fontFamily: "'Playfair Display', serif" }}>Your Business at a Glance</h1>
          <p style={{ fontSize: 14, color: C.light, margin: 0, fontStyle: "italic", maxWidth: 500 }}>"{quote.text}" — {quote.author}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard label="Active Clients" value="4" sub="2 buyers · 2 sellers"/>
        <StatCard label="Under Contract" value="1" sub="Closing May 15" accent={C.green}/>
        <StatCard label="Listings Active" value="1" sub="9821 Talavera Ct" accent={C.blue}/>
        <StatCard label="Closed YTD" value="1" sub="$475K volume" accent={C.goldLight}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.charcoal, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 16px" }}>Pipeline</h3>
          {MOCK_TRANSACTIONS.filter(t => t.status !== "Closed").map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{t.property}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{t.client} · {t.type}</div>
              </div>
              <Badge color={t.status === "Under Contract" ? C.green : C.blue} bg={t.status === "Under Contract" ? C.greenDim : C.blueDim}>{t.status}</Badge>
            </div>
          ))}
          <button onClick={() => onNav("transactions")} style={{
            marginTop: 14, background: "none", border: "none", color: C.gold,
            fontSize: 13, cursor: "pointer", fontWeight: 600, padding: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>View all transactions →</button>
        </div>

        <div style={{ background: C.charcoal, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="news" size={16}/> Tampa Bay Market News
          </h3>
          {MOCK_NEWS.map((n, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < MOCK_NEWS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 14, color: C.white, fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{n.source} · {n.date}</div>
            </div>
          ))}
          <p style={{ fontSize: 11, color: C.muted, margin: "14px 0 0", fontStyle: "italic" }}>API slot ready — plug in your news feed here</p>
        </div>
      </div>

      <div style={{ marginTop: 24, background: C.charcoal, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 16px" }}>Recent Activity</h3>
        {[
          { action: "Inspection report uploaded", detail: "Cortes Creek Blvd — Carlos & Maria Reyes", time: "2 days ago", color: C.green },
          { action: "New listing published", detail: "9821 Talavera Ct — James & Patty O'Brien", time: "Yesterday", color: C.blue },
          { action: "Message sent", detail: "To Carlos & Maria Reyes re: appraisal", time: "2 days ago", color: C.gold },
          { action: "Client added", detail: "Thandiwe Okafor — First-time buyer", time: "3 days ago", color: C.orange },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.white }}>{a.action}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{a.detail}</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CLIENTS PAGE ────────────────────────────────────────────────────
const ClientsPage = ({ role }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [noteText, setNoteText] = useState("");
  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase()) ||
    c.stage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Clients" action={role === "admin" ? "Add Client" : null}/>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 10,
          background: C.charcoal, borderRadius: 12, padding: "0 16px",
          border: `1px solid ${C.border}`,
        }}>
          <Icon name="search" size={16}/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: C.white, fontSize: 14, padding: "12px 0",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: selected ? "0 0 55%" : "1" }}>
          <div style={{
            background: C.charcoal, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
              fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600,
            }}>
              <span>Client</span><span>Type</span><span>Stage</span><span>Status</span><span>Last Contact</span>
            </div>
            {filtered.map(c => (
              <div key={c.id} onClick={() => setSelected(c)} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                padding: "14px 20px", borderBottom: `1px solid ${C.border}`,
                cursor: "pointer", alignItems: "center",
                background: selected?.id === c.id ? C.goldDim : "transparent",
                transition: "background 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar initials={c.avatar} size={32}/>
                  <div>
                    <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c.email}</div>
                  </div>
                </div>
                <Badge color={c.type === "Buyer" ? C.blue : C.orange} bg={c.type === "Buyer" ? C.blueDim : C.orangeDim}>{c.type}</Badge>
                <span style={{ fontSize: 13, color: C.light }}>{c.stage}</span>
                <Badge color={c.status === "Active" ? C.green : c.status === "Lead" ? C.gold : C.muted}>{c.status}</Badge>
                <span style={{ fontSize: 12, color: C.muted }}>{c.lastContact}</span>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div style={{
            flex: "0 0 42%", background: C.charcoal, borderRadius: 16,
            border: `1px solid ${C.border}`, padding: 24, alignSelf: "flex-start",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={selected.avatar} size={48}/>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, margin: 0 }}>{selected.name}</h3>
                  <Badge color={selected.type === "Buyer" ? C.blue : C.orange}>{selected.type} · {selected.stage}</Badge>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20,
              }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { icon: "phone", label: selected.phone },
                { icon: "mail", label: selected.email },
                { icon: "home", label: selected.property },
                { icon: "star", label: selected.budget },
              ].map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 12px", borderRadius: 10, background: C.dark,
                }}>
                  <span style={{ color: C.gold }}><Icon name={d.icon} size={14}/></span>
                  <span style={{ fontSize: 12, color: C.light }}>{d.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Notes</div>
              <div style={{
                background: C.dark, borderRadius: 10, padding: 14,
                fontSize: 13, color: C.light, lineHeight: 1.6,
                borderLeft: `3px solid ${C.gold}`,
              }}>{selected.notes}</div>
            </div>

            {(role === "admin" || role === "teammate") && (
              <div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={noteText} onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    style={{
                      flex: 1, background: C.dark, border: `1px solid ${C.border}`, borderRadius: 10,
                      padding: "10px 14px", color: C.white, fontSize: 13, outline: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <button style={{
                    background: C.gold, color: C.black, border: "none", borderRadius: 10,
                    padding: "0 16px", fontWeight: 700, cursor: "pointer", fontSize: 13,
                  }}>Save</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TRANSACTIONS PAGE ───────────────────────────────────────────────
const TransactionsPage = ({ role }) => (
  <div>
    <SectionHeader title="Transactions" action={role === "admin" ? "New Transaction" : null}/>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {MOCK_TRANSACTIONS.map(t => (
        <div key={t.id} style={{
          background: C.charcoal, borderRadius: 16, padding: 28,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Playfair Display', serif" }}>{t.property}</h3>
              <div style={{ fontSize: 13, color: C.muted }}>{t.client} · {t.type} · {t.price}</div>
            </div>
            <Badge
              color={t.status === "Under Contract" ? C.green : t.status === "Listed" ? C.blue : C.muted}
              bg={t.status === "Under Contract" ? C.greenDim : t.status === "Listed" ? C.blueDim : `${C.muted}18`}
            >{t.status}{t.closingDate !== "—" ? ` · ${t.closingDate}` : ""}</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
            {t.steps.map((step, i) => {
              const isLast = i === t.steps.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {!isLast && (
                    <div style={{
                      position: "absolute", top: 13, left: "50%", width: "100%", height: 2,
                      background: step.done && t.steps[i+1]?.done ? C.gold : C.border, zIndex: 0,
                    }}/>
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: step.done ? C.gold : C.dark,
                    border: step.done ? "none" : `2px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1, color: step.done ? C.black : C.muted,
                  }}>
                    {step.done ? <Icon name="check" size={14}/> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i+1}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: step.done ? C.white : C.muted, marginTop: 8, textAlign: "center", fontWeight: step.done ? 600 : 400 }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{step.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── FILES PAGE ──────────────────────────────────────────────────────
const FilesPage = ({ role, clientFilter }) => {
  const files = clientFilter ? MOCK_FILES.filter(f => f.client === clientFilter) : MOCK_FILES;
  const cats = [...new Set(files.map(f => f.category))];
  return (
    <div>
      <SectionHeader title={clientFilter ? "My Documents" : "Files"} action={role !== "client" ? "Upload File" : null}/>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(cat => (
          <span key={cat} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}`,
          }}>{cat}</span>
        ))}
      </div>
      <div style={{ background: C.charcoal, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 0.8fr",
          padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
          fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600,
        }}>
          <span>File Name</span><span>Client</span><span>Category</span><span>Date</span><span>Size</span>
        </div>
        {files.map(f => (
          <div key={f.id} style={{
            display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 0.8fr",
            padding: "14px 20px", borderBottom: `1px solid ${C.border}`, alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: C.gold }}><Icon name="files" size={16}/></span>
              <span style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>{f.name}</span>
            </div>
            <span style={{ fontSize: 13, color: C.light }}>{f.client}</span>
            <Badge>{f.category}</Badge>
            <span style={{ fontSize: 12, color: C.muted }}>{f.date}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{f.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MESSAGES PAGE ───────────────────────────────────────────────────
const MessagesPage = ({ user }) => {
  const [msg, setMsg] = useState("");
  return (
    <div>
      <SectionHeader title="Messages"/>
      <div style={{
        background: C.charcoal, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, minHeight: 400, display: "flex", flexDirection: "column",
      }}>
        <div style={{ flex: 1 }}>
          {MOCK_MESSAGES.map(m => {
            const isMine = m.from === user.name;
            return (
              <div key={m.id} style={{
                display: "flex", justifyContent: isMine ? "flex-end" : "flex-start",
                marginBottom: 16,
              }}>
                <div style={{
                  maxWidth: "65%", padding: "14px 18px", borderRadius: 16,
                  background: isMine ? C.goldDim : C.dark,
                  border: `1px solid ${isMine ? C.goldBorder : C.border}`,
                  borderBottomRightRadius: isMine ? 4 : 16,
                  borderBottomLeftRadius: isMine ? 16 : 4,
                }}>
                  <div style={{ fontSize: 14, color: C.white, lineHeight: 1.6 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6, textAlign: isMine ? "right" : "left" }}>{m.date}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <input
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1, background: C.dark, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "12px 16px", color: C.white, fontSize: 14, outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button style={{
            background: C.gold, color: C.black, border: "none", borderRadius: 12,
            padding: "0 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Send</button>
        </div>
      </div>
    </div>
  );
};

// ─── TEAM PAGE ───────────────────────────────────────────────────────
const TeamPage = () => {
  const PERMS = ["view_clients", "add_notes", "upload_files", "edit_clients", "manage_transactions", "send_messages"];
  return (
    <div>
      <SectionHeader title="Team Management" action="Invite Teammate"/>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MOCK_TEAMMATES.map(tm => (
          <div key={tm.id} style={{
            background: C.charcoal, borderRadius: 16, padding: 24,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={tm.avatar} size={44} color={C.blue}/>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{tm.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{tm.email}</div>
                </div>
              </div>
              <Badge color={C.blue} bg={C.blueDim}>Teammate</Badge>
            </div>
            <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Permissions</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PERMS.map(p => {
                const has = tm.permissions.includes(p);
                return (
                  <button key={p} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    border: `1px solid ${has ? C.goldBorder : C.border}`,
                    background: has ? C.goldDim : "transparent",
                    color: has ? C.gold : C.muted, fontWeight: has ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{p.replace(/_/g, " ")}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ───────────────────────────────────────────────────
const SettingsPage = () => (
  <div>
    <SectionHeader title="Settings"/>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {[
        { title: "Profile", desc: "Name, email, phone, branding", icon: "clients" },
        { title: "Supabase", desc: "Database URL, anon key, RLS policies", icon: "settings" },
        { title: "News API", desc: "Connect Tampa housing news feed", icon: "news" },
        { title: "Notifications", desc: "Email & SMS alert preferences", icon: "messages" },
        { title: "Branding", desc: "Logo, colors, email templates", icon: "star" },
        { title: "Permissions", desc: "Role defaults & access rules", icon: "team" },
      ].map((s, i) => (
        <div key={i} style={{
          background: C.charcoal, borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 16,
          transition: "border-color 0.2s",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: C.goldDim,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.gold,
          }}><Icon name={s.icon} size={20}/></div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{s.title}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.desc}</div>
          </div>
          <div style={{ marginLeft: "auto", color: C.muted }}><Icon name="chevron" size={16}/></div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: 24, background: C.charcoal, borderRadius: 16, padding: 24,
      border: `1px solid ${C.goldBorder}`,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.gold, margin: "0 0 8px" }}>Supabase Setup Instructions</h3>
      <p style={{ fontSize: 13, color: C.light, lineHeight: 1.7, margin: 0 }}>
        This app is designed for <strong style={{ color: C.white }}>Supabase</strong> as the backend. To go live: create a Supabase project, set up tables for <code style={{ color: C.gold, background: C.dark, padding: "2px 6px", borderRadius: 4 }}>clients</code>, <code style={{ color: C.gold, background: C.dark, padding: "2px 6px", borderRadius: 4 }}>transactions</code>, <code style={{ color: C.gold, background: C.dark, padding: "2px 6px", borderRadius: 4 }}>files</code>, <code style={{ color: C.gold, background: C.dark, padding: "2px 6px", borderRadius: 4 }}>messages</code>, and <code style={{ color: C.gold, background: C.dark, padding: "2px 6px", borderRadius: 4 }}>team_members</code>. Enable Row Level Security with role-based policies (admin/teammate/client). Plug your project URL and anon key into the config above.
      </p>
    </div>
  </div>
);

// ─── CLIENT PORTAL ───────────────────────────────────────────────────
const ClientPortal = () => {
  const today = new Date();
  const quote = QUOTES[(today.getDate() + 3) % QUOTES.length];
  const myTransaction = MOCK_TRANSACTIONS[0];
  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${C.charcoal}, ${C.dark})`,
        borderRadius: 20, padding: "36px 40px", marginBottom: 28,
        border: `1px solid ${C.goldBorder}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `${C.gold}06` }}/>
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 13, color: C.gold, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Welcome back, Carlos & Maria</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: "0 0 14px", fontFamily: "'Playfair Display', serif" }}>Your Home Journey</h1>
          <p style={{ fontSize: 15, color: C.light, margin: 0, fontStyle: "italic", maxWidth: 520 }}>"{quote.text}" <span style={{ color: C.muted }}>— {quote.author}</span></p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{
          background: C.charcoal, borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 16px" }}>Your Transaction</h3>
          <div style={{ fontSize: 16, color: C.gold, fontWeight: 700, marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>{myTransaction.property}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>{myTransaction.price} · Closing {myTransaction.closingDate}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myTransaction.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: step.done ? C.gold : C.dark,
                  border: step.done ? "none" : `2px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step.done ? C.black : C.muted,
                }}>
                  {step.done ? <Icon name="check" size={12}/> : <span style={{ fontSize: 9, fontWeight: 700 }}>{i+1}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: step.done ? C.white : C.muted, fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                </div>
                <span style={{ fontSize: 11, color: C.muted }}>{step.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: C.charcoal, borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="news" size={16}/> Tampa Bay Market News
          </h3>
          {MOCK_NEWS.map((n, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < MOCK_NEWS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 14, color: C.white, fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{n.snippet}</div>
              <div style={{ fontSize: 11, color: C.gold, marginTop: 4 }}>{n.source} · {n.date}</div>
            </div>
          ))}
          <div style={{
            marginTop: 16, padding: "12px 16px", borderRadius: 10,
            background: C.goldDim, border: `1px solid ${C.goldBorder}`,
            fontSize: 12, color: C.gold, textAlign: "center",
          }}>
            Your local expert: <strong>Vickie Mitchell</strong> · 813-625-7525
          </div>
        </div>
      </div>

      <div style={{ background: C.charcoal, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 6px" }}>From Your Agent</h3>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>Recent messages from Vickie Mitchell</p>
        {MOCK_MESSAGES.filter(m => m.from === "Vickie Mitchell").slice(0, 2).map(m => (
          <div key={m.id} style={{
            padding: "14px 18px", borderRadius: 12, background: C.dark,
            marginBottom: 10, borderLeft: `3px solid ${C.gold}`,
          }}>
            <div style={{ fontSize: 14, color: C.white, lineHeight: 1.6 }}>{m.text}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{m.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CLIENT SAVED SEARCHES ───────────────────────────────────────────
const SavedSearches = () => (
  <div>
    <SectionHeader title="Saved Searches"/>
    {[
      { label: "Gated communities in Spring Hill under $550K", count: 12, date: "Apr 5" },
      { label: "New construction Wesley Chapel 3+ bed", count: 8, date: "Apr 3" },
      { label: "Pool homes Pasco County $450K–$600K", count: 23, date: "Mar 30" },
    ].map((s, i) => (
      <div key={i} style={{
        background: C.charcoal, borderRadius: 16, padding: 20, marginBottom: 12,
        border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 15, color: C.white, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: C.muted }}>Last updated {s.date} · {s.count} results</div>
        </div>
        <button style={{
          background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}`,
          borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>View Results</button>
      </div>
    ))}
    <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 16 }}>
      MLS search integration slot — connect your IDX feed here
    </p>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleLogin = (role) => {
    setUser(MOCK_USERS[role]);
    setPage(role === "client" ? "portal" : "dashboard");
  };

  if (!user) return <LoginScreen onLogin={handleLogin}/>;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <AdminDashboard onNav={setPage}/>;
      case "clients": return <ClientsPage role={user.role}/>;
      case "transactions": return <TransactionsPage role={user.role}/>;
      case "files": return <FilesPage role={user.role}/>;
      case "messages": return <MessagesPage user={user}/>;
      case "team": return <TeamPage/>;
      case "settings": return <SettingsPage/>;
      case "portal": return <ClientPortal/>;
      case "my-docs": return <FilesPage role="client" clientFilter="Carlos & Maria Reyes"/>;
      case "my-timeline": return <TransactionsPage role="client"/>;
      case "my-messages": return <MessagesPage user={user}/>;
      case "my-searches": return <SavedSearches/>;
      default: return <AdminDashboard onNav={setPage}/>;
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: C.black,
      fontFamily: "'DM Sans', sans-serif", color: C.white,
    }}>
      <Sidebar role={user.role} active={page} onNav={setPage} onLogout={() => { setUser(null); setPage("dashboard"); }}/>
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh" }}>
        <div style={{ maxWidth: 1100 }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
