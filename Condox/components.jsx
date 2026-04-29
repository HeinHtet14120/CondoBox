/* CondoBox shared components and helpers
   Exposed on window for cross-script use. */

const { useState, useEffect, useMemo, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Icons (lucide-style inline SVGs — keep tree minimal here)
// ─────────────────────────────────────────────────────────────
const I = (path, opts = {}) => ({ size = 16, stroke = 'currentColor', strokeWidth = 2, fill = 'none', style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
       style={style} aria-hidden="true">
    {path}
  </svg>
);

const Icon = {
  Package: I(<><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></>),
  QrCode: I(<><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></>),
  Plus: I(<><path d="M5 12h14"/><path d="M12 5v14"/></>),
  Search: I(<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>),
  Bell: I(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>),
  ChevronRight: I(<polyline points="9 18 15 12 9 6"/>),
  ChevronDown: I(<polyline points="6 9 12 15 18 9"/>),
  Check: I(<polyline points="20 6 9 17 4 12"/>),
  CheckCircle: I(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>),
  X: I(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
  Eye: I(<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>),
  EyeOff: I(<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></>),
  Sun: I(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>),
  Moon: I(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>),
  Building: I(<><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>),
  User: I(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>),
  Lock: I(<><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>),
  LogOut: I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>),
  Truck: I(<><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></>),
  Inbox: I(<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>),
  Printer: I(<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 0 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>),
  ArrowLeft: I(<><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></>),
  ArrowRight: I(<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>),
  Camera: I(<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>),
  Keyboard: I(<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></>),
  Sparkles: I(<><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></>),
  Clock: I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>),
  Home: I(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>),
  History: I(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>),
  ShieldCheck: I(<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></>),
  Settings: I(<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/><circle cx="12" cy="12" r="3"/></>),
  AlertCircle: I(<><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>),
  Wifi: I(<><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></>),
};

// ─────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────
function Button({ variant = 'primary', size = 'md', block, children, leftIcon, rightIcon, onClick, type = 'button', disabled }) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost',
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
  ].join(' ').trim();
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} style={disabled ? { opacity: .5, cursor: 'not-allowed' } : undefined}>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'waiting') {
    return <span className="badge badge-waiting"><span className="badge-dot"/>Waiting</span>;
  }
  if (status === 'picked_up' || status === 'picked') {
    return <span className="badge badge-picked"><Icon.Check size={12} strokeWidth={3} />Picked up</span>;
  }
  return <span className="badge">{status}</span>;
}

function RoomBadge({ room }) {
  return <span className="badge badge-room">{room}</span>;
}

// ─────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────
function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '36px 20px', color: 'var(--text-secondary)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'var(--bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-tertiary)', marginBottom: 14,
      }}>
        {icon || <Icon.Inbox size={24} />}
      </div>
      <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, maxWidth: 280, lineHeight: 1.5 }}>{body}</div>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
function Logo({ size = 'md' }) {
  const isLg = size === 'lg';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span className={`logo-mark ${isLg ? 'logo-mark-lg' : ''}`}>
        <svg width={isLg ? 22 : 16} height={isLg ? 22 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="M3.3 7 12 12l8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      </span>
      <span style={{ fontWeight: 800, fontSize: isLg ? 20 : 17, letterSpacing: '-0.02em', color: 'var(--text)' }}>
        Condo<span style={{ color: 'var(--accent)' }}>Box</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navbar (admin desktop)
// ─────────────────────────────────────────────────────────────
function Navbar({ user = { name: 'Khun Apinya', role: 'Front desk' } }) {
  return (
    <div style={{
      height: 56, padding: '0 20px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      background: 'var(--bg-elev)',
      gap: 16,
    }}>
      <Logo />
      <div style={{
        marginLeft: 8, display: 'flex', alignItems: 'center', gap: 4,
        color: 'var(--text-tertiary)', fontSize: 13,
      }}>
        <Icon.ChevronRight size={14}/>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Sukhumvit Heights</span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px 6px 6px',
        border: '1px solid var(--border)', borderRadius: 999,
        color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent) 70%, white), var(--accent))',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
        }}>{user.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
        <span style={{ color: 'var(--text)' }}>{user.name}</span>
        <Icon.ChevronDown size={14}/>
      </div>
      <button className="btn btn-ghost btn-sm" style={{ borderRadius: 10 }} title="Sign out">
        <Icon.LogOut size={14}/> Sign out
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Parcel card (used in lists; both admin and resident)
// ─────────────────────────────────────────────────────────────
function ParcelCard({ parcel, onClick, variant = 'admin', dense = false }) {
  // Admin variant: row with room, name, sender, desc, arrived, chevron
  if (variant === 'admin') {
    return (
      <div className="row-hover" onClick={onClick}
        style={{
          display: 'grid',
          gridTemplateColumns: '76px 1.4fr 1.2fr 1.6fr 130px 28px',
          alignItems: 'center',
          gap: 16,
          padding: dense ? '10px 16px' : '14px 16px',
          borderTop: '1px solid var(--border)',
          cursor: 'pointer',
          fontSize: 14,
        }}>
        <RoomBadge room={parcel.room}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parcel.resident}</div>
        </div>
        <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parcel.sender}</div>
        <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parcel.description}</div>
        <div style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon.Clock size={13}/> {parcel.arrived}
        </div>
        <Icon.ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }}/>
      </div>
    );
  }
  // Resident mobile card
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Package size={20}/>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parcel.sender}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parcel.description}</div>
          </div>
        </div>
        <StatusBadge status={parcel.status || 'waiting'}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Clock size={12}/> {parcel.arrived}
        </div>
        {parcel.status !== 'picked_up' ? (
          <button className="btn btn-secondary btn-sm">
            <Icon.QrCode size={13}/> View QR
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QR placeholder — renders a deterministic faux-QR pattern from a string
// ─────────────────────────────────────────────────────────────
function QRPlaceholder({ value = 'CONDOBOX-PARCEL-001', size = 200 }) {
  // 25x25 pseudo-random pattern seeded by string hash
  const grid = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
    const N = 25;
    const cells = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      h = Math.imul(h ^ (x*131+y*17), 2654435761);
      cells.push(((h >>> 24) & 1) === 1);
    }
    // Place 3 finder squares at corners (TL, TR, BL)
    const setRect = (cx, cy, on) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const i = (cy+y)*N + (cx+x);
        if (i < 0 || i >= cells.length) continue;
        const inner = (x===0||x===6||y===0||y===6) || (x>=2 && x<=4 && y>=2 && y<=4);
        cells[i] = on ? inner : false;
      }
    };
    setRect(0, 0, true);
    setRect(N-7, 0, true);
    setRect(0, N-7, true);
    return cells;
  }, [value]);
  const N = 25;
  const cell = size / N;
  return (
    <div className="qr-frame" style={{ width: size + 28, height: size + 28 }}>
      <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
        <rect width={N} height={N} fill="#fff"/>
        {grid.map((on, i) => on ? (
          <rect key={i} x={i % N} y={Math.floor(i / N)} width={1} height={1} fill="#0b0b0f"/>
        ) : null)}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats pill (admin dashboard)
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }) {
  const tone = accent === 'amber'
    ? { bg: 'var(--amber-soft)', fg: 'var(--amber)' }
    : accent === 'emerald'
    ? { bg: 'var(--emerald-soft)', fg: 'var(--emerald)' }
    : { bg: 'var(--accent-soft)', fg: 'var(--accent)' };
  return (
    <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: tone.bg, color: tone.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>{value}</div>
        {sub ? <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{sub}</div> : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section header (used inside artboards)
// ─────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '4px 4px 12px',
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
        {sub ? <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>{sub}</div> : null}
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────
const MOCK = {
  rooms: ['R002', 'R005', 'R007', 'R012', 'R024', 'R031'],
  parcels: [
    { id: 'P-1042', room: 'R005', resident: 'Sarah Phongphan', sender: 'Lazada', description: 'Small box · 1.2 kg', arrived: '12 min ago', status: 'waiting' },
    { id: 'P-1041', room: 'R012', resident: 'Tanawat Srisomboon', sender: 'Shopee', description: 'Padded envelope', arrived: '2 hours ago', status: 'waiting' },
    { id: 'P-1040', room: 'R024', resident: 'Pim Boonyarataphan', sender: 'Kerry Express', description: 'Large box · 4.5 kg', arrived: '3 hours ago', status: 'waiting' },
    { id: 'P-1039', room: 'R007', resident: 'David Chen', sender: 'Flash Express', description: 'Document envelope', arrived: 'Yesterday', status: 'waiting' },
    { id: 'P-1038', room: 'R031', resident: 'Niran Wattana', sender: 'J&T Express', description: 'Medium box · 2.0 kg', arrived: 'Yesterday', status: 'waiting' },
  ],
  recent: [
    { id: 'P-1037', room: 'R002', resident: 'Mali Ratanakit', sender: 'Lazada', description: 'Cosmetics box', arrived: 'Picked up · 10:42', status: 'picked_up' },
    { id: 'P-1036', room: 'R012', resident: 'Tanawat Srisomboon', sender: 'Grab', description: 'Food delivery', arrived: 'Picked up · 09:18', status: 'picked_up' },
    { id: 'P-1035', room: 'R005', resident: 'Sarah Phongphan', sender: 'Shopee', description: 'Small parcel', arrived: 'Picked up · Yesterday', status: 'picked_up' },
  ],
  resident: {
    name: 'Sarah',
    fullName: 'Sarah Phongphan',
    room: 'R005',
    otp: '482 197',
    waiting: [
      { id: 'P-1042', sender: 'Lazada', description: 'Small box · 1.2 kg', arrived: '12 min ago', status: 'waiting' },
      { id: 'P-1029', sender: 'Shopee', description: 'Padded envelope', arrived: 'Yesterday, 16:08', status: 'waiting' },
    ],
    history: [
      { id: 'P-1018', sender: 'Kerry Express', description: 'Large box · 3.4 kg', arrived: 'Apr 22 · 11:04', status: 'picked_up' },
      { id: 'P-1011', sender: 'Flash Express', description: 'Document envelope', arrived: 'Apr 18 · 09:51', status: 'picked_up' },
      { id: 'P-1004', sender: 'Lazada', description: 'Cosmetics box', arrived: 'Apr 12 · 14:22', status: 'picked_up' },
    ],
  },
};

Object.assign(window, {
  Icon, Button, StatusBadge, RoomBadge, EmptyState, Logo, Navbar,
  ParcelCard, QRPlaceholder, StatCard, SectionHeader, MOCK,
});
