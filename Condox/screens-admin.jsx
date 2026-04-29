/* CondoBox — Admin screens (Setup, Dashboard, NewParcel, Pickup) */

const { useState: useStateAdmin, useMemo: useMemoAdmin } = React;

// ─────────────────────────────────────────────────────────────
// 3. Admin: Condo Setup
// ─────────────────────────────────────────────────────────────
function ScreenAdminSetup({ filled = true }) {
  const [count, setCount] = useStateAdmin(filled ? 50 : '');
  const n = Math.max(0, Math.min(999, parseInt(count, 10) || 0));
  const previewIds = Array.from({ length: Math.min(n, 12) }, (_, i) => 'R' + String(i+1).padStart(3, '0'));
  const more = Math.max(0, n - previewIds.length);

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', overflow: 'auto', padding: '40px 28px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 560, maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Logo/>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Onboarding</span>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            <Icon.Building size={22}/>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>Set up your condo</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, marginBottom: 24, lineHeight: 1.5 }}>
            Tell us how many units you manage and we'll create the room directory for you.
          </div>

          <div>
            <label className="field-label">Total number of rooms</label>
            <input className="input" type="number" min={1} max={999} value={count}
                   onChange={e=>setCount(e.target.value)} placeholder="e.g. 50" style={{ maxWidth: 200 }}/>
            <div className="field-help">
              We'll create rooms <span className="mono" style={{ color: 'var(--text-secondary)' }}>R001</span> through{' '}
              <span className="mono" style={{ color: 'var(--text-secondary)' }}>R{String(Math.max(n,1)).padStart(3,'0')}</span> automatically.
              This can't be undone.
            </div>
          </div>

          {n > 0 ? (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
                Preview
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {previewIds.map(id => (
                  <span key={id} className="mono" style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 999,
                    background: 'var(--bg-muted)', color: 'var(--text-secondary)',
                  }}>{id}</span>
                ))}
                {more > 0 ? (
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 999,
                    background: 'var(--accent-soft)', color: 'var(--accent)',
                  }}>+{more} more</span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <Button variant="secondary">Cancel</Button>
            <div style={{ flex: 1 }}/>
            <Button leftIcon={<Icon.Sparkles size={15}/>} disabled={!n}>Initialize condo</Button>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
          <Icon.ShieldCheck size={14}/> Step 1 of 1 · You can invite residents after setup
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Admin Dashboard
// ─────────────────────────────────────────────────────────────
function ScreenAdminDashboard({ filled = true }) {
  const waiting = filled ? MOCK.parcels : [];
  const recent = filled ? MOCK.recent : [];

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar/>
      <div className="scroll-y" style={{ flex: 1, padding: '24px 28px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Front desk</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text)', marginTop: 4 }}>Good morning, Apinya</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Here's what's happening at Sukhumvit Heights today.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" leftIcon={<Icon.QrCode size={15}/>}>Scan QR for pickup</Button>
              <Button leftIcon={<Icon.Plus size={15}/>}>New parcel</Button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <StatCard label="Waiting for pickup" value={waiting.length} sub="parcels" accent="amber" icon={<Icon.Package size={15}/>}/>
            <StatCard label="Picked up today" value="14" sub="↑ 22% vs yesterday" accent="emerald" icon={<Icon.CheckCircle size={15}/>}/>
            <StatCard label="Occupied rooms" value="42" sub="of 50 rooms" icon={<Icon.Building size={15}/>}/>
          </div>

          {/* Waiting list */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Waiting for pickup</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>{waiting.length} parcels — oldest first</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <Icon.Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-tertiary)' }}/>
                  <input className="input" placeholder="Search room or resident…" style={{ height: 32, paddingLeft: 30, fontSize: 13, width: 220, borderRadius: 10 }}/>
                </div>
                <Button variant="ghost" size="sm" rightIcon={<Icon.ChevronDown size={13}/>}>Filter</Button>
              </div>
            </div>
            {/* table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '76px 1.4fr 1.2fr 1.6fr 130px 28px',
              gap: 16, padding: '10px 16px',
              fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '.06em',
              borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
              background: 'var(--bg-soft)',
            }}>
              <div>Room</div><div>Resident</div><div>Sender</div><div>Description</div><div>Arrived</div><div/>
            </div>
            {waiting.length === 0 ? (
              <EmptyState
                icon={<Icon.Inbox size={26}/>}
                title="All caught up"
                body="No parcels are waiting for pickup right now. New ones will show up here automatically."
                action={<Button leftIcon={<Icon.Plus size={14}/>} size="sm">New parcel</Button>}
              />
            ) : (
              waiting.map(p => <ParcelCard key={p.id} parcel={p} variant="admin"/>)
            )}
          </div>

          {/* Recent pickups */}
          <div className="card">
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Recent pickups</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>Today</div>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<Icon.ChevronRight size={13}/>}>View all</Button>
            </div>
            {recent.length === 0 ? (
              <EmptyState icon={<Icon.History size={22}/>} title="No pickups yet today" body="Recent pickups will be listed here once residents collect their parcels."/>
            ) : recent.map(p => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '76px 1.4fr 1.2fr 1.6fr 1fr',
                alignItems: 'center', gap: 16, padding: '10px 18px',
                borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)',
              }}>
                <RoomBadge room={p.room}/>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{p.resident}</div>
                <div>{p.sender}</div>
                <div>{p.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  <StatusBadge status="picked_up"/>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{p.arrived.replace('Picked up · ','')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Admin: New Parcel (form + success)
// ─────────────────────────────────────────────────────────────
function ScreenAdminNewParcel({ filled = true }) {
  const [step, setStep] = useStateAdmin(filled ? 'success' : 'form');
  const [room, setRoom] = useStateAdmin(filled ? 'R005' : '');
  const [sender, setSender] = useStateAdmin(filled ? 'Lazada' : '');
  const [desc, setDesc] = useStateAdmin(filled ? 'Small box · 1.2 kg' : '');

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar/>
      <div className="scroll-y" style={{ flex: 1, padding: '24px 28px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 14 }}>
            <a href="#" className="lnk" style={{ color: 'var(--text-secondary)' }}>Dashboard</a>
            <Icon.ChevronRight size={13}/>
            <span style={{ color: 'var(--text)' }}>New parcel</span>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <Step n="1" label="Details" active={step==='form'} done={step==='success'}/>
            <div style={{ flex: 1, height: 2, background: step==='success' ? 'var(--accent)' : 'var(--border-strong)', borderRadius: 1 }}/>
            <Step n="2" label="QR ready" active={step==='success'}/>
          </div>

          {step === 'form' ? (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>Log a new parcel</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, marginBottom: 22 }}>
                Generate a QR code that the resident will use to claim their delivery.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="field-label">Room</label>
                  <select className="select" value={room} onChange={e=>setRoom(e.target.value)}>
                    <option value="" disabled>Select an occupied room…</option>
                    {MOCK.rooms.map(r => <option key={r} value={r}>{r} — {residentFor(r)}</option>)}
                  </select>
                  <div className="field-help">Only rooms with a registered resident are shown.</div>
                </div>
                <div>
                  <label className="field-label">Sender</label>
                  <input className="input" placeholder="e.g. Lazada" value={sender} onChange={e=>setSender(e.target.value)}/>
                </div>
                <div>
                  <label className="field-label">Tracking # <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>(optional)</span></label>
                  <input className="input" placeholder="LZD-..."/>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="field-label">Description</label>
                  <input className="input" placeholder="Box size, weight, notes…" value={desc} onChange={e=>setDesc(e.target.value)}/>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <Button variant="secondary">Cancel</Button>
                <Button leftIcon={<Icon.QrCode size={15}/>} onClick={()=>setStep('success')}>Create parcel</Button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 28, display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <QRPlaceholder value={`CB-${room}-${sender}-${desc}`} size={200}/>
                <div className="mono" style={{ fontSize: 12, color: 'var(--text-tertiary)', letterSpacing: '.04em' }}>P-1042</div>
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--emerald)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                  <Icon.CheckCircle size={16}/> Parcel created
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>QR is ready to print</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, marginBottom: 18 }}>
                  Stick the printed QR on the parcel. The resident is now notified.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 10, columnGap: 16, fontSize: 14 }}>
                  <Field label="Room" value={<RoomBadge room={room || 'R005'}/>}/>
                  <Field label="Resident" value={residentFor(room) || 'Sarah Phongphan'}/>
                  <Field label="Sender" value={sender || '—'}/>
                  <Field label="Description" value={desc || '—'}/>
                  <Field label="Arrived" value="Just now"/>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
                  <Button leftIcon={<Icon.Printer size={15}/>}>Print QR</Button>
                  <Button variant="secondary" leftIcon={<Icon.Plus size={15}/>} onClick={()=>setStep('form')}>Create another</Button>
                  <Button variant="ghost" leftIcon={<Icon.ArrowLeft size={15}/>}>Back to dashboard</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <>
      <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{label}</div>
      <div style={{ color: 'var(--text)', fontWeight: 600 }}>{value}</div>
    </>
  );
}

function Step({ n, label, active, done }) {
  const bg = done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--bg-muted)';
  const fg = done || active ? 'white' : 'var(--text-tertiary)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: bg, color: fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
      }}>
        {done ? <Icon.Check size={13} strokeWidth={3}/> : n}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: active||done ? 'var(--text)' : 'var(--text-tertiary)' }}>{label}</span>
    </div>
  );
}

function residentFor(room) {
  const map = { R002: 'Mali Ratanakit', R005: 'Sarah Phongphan', R007: 'David Chen', R012: 'Tanawat Srisomboon', R024: 'Pim Boonyarataphan', R031: 'Niran Wattana' };
  return map[room] || '';
}

// ─────────────────────────────────────────────────────────────
// 6. Admin: Scan / Confirm Pickup
// ─────────────────────────────────────────────────────────────
function ScreenAdminPickup({ filled = true }) {
  const [otp, setOtp] = useStateAdmin(filled ? '482197' : '');
  const found = filled;

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar/>
      <div className="scroll-y" style={{ flex: 1, padding: '24px 28px 40px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Pickup</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text)', marginTop: 4 }}>Confirm parcel pickup</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Scan the printed QR or enter the parcel code manually.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
            {/* Scanner */}
            <div className="card" style={{ padding: 18 }}>
              <SectionHeader title="Camera scanner" sub="Point the front-desk camera at the QR sticker"/>
              <div style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                background: 'linear-gradient(135deg, #0b0b0f, #1a1a22)',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Corner brackets */}
                {[
                  { top: 16, left: 16, br: 'tl' },
                  { top: 16, right: 16, br: 'tr' },
                  { bottom: 16, left: 16, br: 'bl' },
                  { bottom: 16, right: 16, br: 'br' },
                ].map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute', ...p,
                    width: 36, height: 36,
                    borderTop: p.br?.[0]==='t' ? '3px solid var(--accent)' : 'none',
                    borderBottom: p.br?.[0]==='b' ? '3px solid var(--accent)' : 'none',
                    borderLeft: p.br?.[1]==='l' ? '3px solid var(--accent)' : 'none',
                    borderRight: p.br?.[1]==='r' ? '3px solid var(--accent)' : 'none',
                    borderRadius: 6,
                  }}/>
                ))}
                {/* Sweeping line */}
                <div style={{
                  position: 'absolute', left: 16, right: 16, height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  top: '50%', boxShadow: '0 0 18px var(--accent)',
                }}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                  <Icon.Camera size={26}/>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Point camera at QR</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, color: 'var(--text-tertiary)', fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)' }}/>
                Camera connected · Logitech C920
              </div>
            </div>

            {/* Manual */}
            <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionHeader title="Or enter code manually" sub="Use the parcel ID printed on the QR sticker"/>
              <div>
                <label className="field-label">Parcel code</label>
                <input className="input mono" placeholder="P-1042" defaultValue={filled ? 'P-1042' : ''} style={{ letterSpacing: '.05em' }}/>
              </div>

              {found ? (
                <div style={{
                  padding: 14, borderRadius: 14,
                  background: 'var(--bg-soft)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Icon.CheckCircle size={15} style={{ color: 'var(--emerald)' }}/>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Parcel found</span>
                    <span style={{ marginLeft: 'auto' }}><RoomBadge room="R005"/></span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 6, columnGap: 12, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Resident</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>Sarah Phongphan</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Sender</span>
                    <span style={{ color: 'var(--text)' }}>Lazada</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Description</span>
                    <span style={{ color: 'var(--text)' }}>Small box · 1.2 kg</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Arrived</span>
                    <span style={{ color: 'var(--text)' }}>12 min ago</span>
                  </div>
                </div>
              ) : (
                <EmptyState icon={<Icon.QrCode size={22}/>} title="Waiting for a code" body="Scan a QR or paste a parcel ID to load the pickup details."/>
              )}

              <div>
                <label className="field-label">Pickup code (OTP)</label>
                <OTPInput value={otp} onChange={setOtp}/>
                <div className="field-help">Ask the resident for their 6-digit pickup code.</div>
              </div>

              <Button block size="lg" disabled={!found || otp.length < 6} leftIcon={<Icon.ShieldCheck size={16}/>}>
                Confirm pickup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OTPInput({ value = '', onChange }) {
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {digits.map((d, i) => (
        <div key={i} className="mono" style={{
          flex: 1, height: 52, borderRadius: 12,
          border: '1px solid var(--border-strong)',
          background: 'var(--bg-elev)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: d.trim() ? 'var(--text)' : 'var(--text-tertiary)',
          boxShadow: i === Math.min(value.length, 5) && value.length < 6 ? '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)' : 'none',
          borderColor: i === Math.min(value.length, 5) && value.length < 6 ? 'var(--accent)' : 'var(--border-strong)',
        }}>
          {d.trim() || '·'}
        </div>
      ))}
      <input type="text" value={value} onChange={e=>onChange(e.target.value.replace(/\D/g,'').slice(0,6))} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
    </div>
  );
}

Object.assign(window, { ScreenAdminSetup, ScreenAdminDashboard, ScreenAdminNewParcel, ScreenAdminPickup });
