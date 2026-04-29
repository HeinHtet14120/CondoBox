/* CondoBox — Resident screens (Dashboard, QR Detail) */

const { useState: useStateRes } = React;

// ─────────────────────────────────────────────────────────────
// 7. Resident Dashboard (mobile)
// ─────────────────────────────────────────────────────────────
function ScreenResidentDashboard({ filled = true }) {
  const r = MOCK.resident;
  const waiting = filled ? r.waiting : [];
  const history = filled ? r.history : [];

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top app bar */}
      <div style={{
        padding: '14px 18px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)',
      }}>
        <Logo/>
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
          background: 'var(--bg-elev)', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer',
        }}>
          <Icon.Bell size={16}/>
          {filled ? <span style={{
            position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%',
            background: 'var(--rose)', border: '2px solid var(--bg-elev)',
          }}/> : null}
        </button>
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '18px 18px 24px' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>Hello, {r.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Sukhumvit Heights</div>
          </div>
          <RoomBadge room={`Room ${r.room}`}/>
        </div>

        {/* OTP card */}
        <div className="card glow-accent" style={{
          padding: 20,
          background: 'linear-gradient(160deg, color-mix(in oklab, var(--accent) 7%, var(--bg-elev)), var(--bg-elev) 70%)',
          border: '1px solid color-mix(in oklab, var(--accent) 25%, var(--border))',
          marginBottom: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            <Icon.ShieldCheck size={14}/> Your pickup code
          </div>
          <div className="mono" style={{
            fontSize: 38, fontWeight: 700, letterSpacing: '0.18em',
            color: 'var(--text)', marginTop: 10,
          }}>{r.otp}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
            Show this to the office at pickup. Refreshes daily.
          </div>
        </div>

        {/* Waiting */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              Waiting for pickup{filled ? ` (${waiting.length})` : ''}
            </div>
          </div>
          {waiting.length === 0 ? (
            <div className="card" style={{ padding: 0 }}>
              <EmptyState icon={<Icon.Inbox size={22}/>} title="No parcels waiting" body="When the office logs a new delivery for you, it'll show up here."/>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {waiting.map(p => <ParcelCard key={p.id} parcel={p} variant="resident"/>)}
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>History</div>
            <a href="#" className="lnk" style={{ fontSize: 13 }}>See all</a>
          </div>
          {history.length === 0 ? (
            <div className="card" style={{ padding: 0 }}>
              <EmptyState icon={<Icon.History size={22}/>} title="No history yet" body="Picked-up parcels will appear here."/>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map(p => (
                <div key={p.id} style={{
                  background: 'var(--bg-elev)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: 'var(--emerald-soft)', color: 'var(--emerald)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Check size={16} strokeWidth={3}/>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.sender}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{p.arrived}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: '1px solid var(--border)', background: 'var(--bg-elev)',
        padding: '8px 8px calc(8px + env(safe-area-inset-bottom, 0px))',
      }}>
        {[
          { icon: <Icon.Home size={20}/>, label: 'Home', active: true },
          { icon: <Icon.Package size={20}/>, label: 'Parcels' },
          { icon: <Icon.User size={20}/>, label: 'Profile' },
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 0', borderRadius: 10,
            color: t.active ? 'var(--accent)' : 'var(--text-tertiary)',
            fontSize: 11, fontWeight: 600,
          }}>
            {t.icon}<span>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. Parcel QR Detail (sheet/modal style)
// ─────────────────────────────────────────────────────────────
function ScreenParcelQRDetail({ filled = true }) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(11,11,15,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{
        background: 'var(--bg-elev)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        width: '100%',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92%',
      }}>
        {/* Grabber + close */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 42, height: 4, borderRadius: 2, background: 'var(--border-strong)' }}/>
        </div>
        <div style={{ padding: '8px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Parcel</div>
          <button style={{
            width: 32, height: 32, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-elev)',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><Icon.X size={16}/></button>
        </div>

        <div className="scroll-y" style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <QRPlaceholder value="CB-R005-Lazada-P1042" size={210}/>
          <div className="mono" style={{ fontSize: 13, color: 'var(--text-tertiary)', letterSpacing: '.08em' }}>P-1042</div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <StatusBadge status={filled ? 'waiting' : 'picked_up'}/>
          </div>

          <div style={{
            width: '100%',
            background: 'var(--bg-soft)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 14,
            display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 10, columnGap: 12, fontSize: 14,
          }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Sender</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>Lazada</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Description</span>
            <span style={{ color: 'var(--text)' }}>Small box · 1.2 kg</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Arrived</span>
            <span style={{ color: 'var(--text)' }}>Apr 25 · 09:48</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Room</span>
            <span><RoomBadge room="R005"/></span>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button block size="lg" leftIcon={<Icon.ShieldCheck size={16}/>}>Show pickup code</Button>
            <Button block variant="ghost" leftIcon={<Icon.X size={15}/>}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenResidentDashboard, ScreenParcelQRDetail });
