/* CondoBox — Auth screens (Login, Register) */

const { useState: useStateAuth } = React;

function ScreenLogin({ filled = true }) {
  const [showPw, setShowPw] = useStateAuth(false);
  const [user, setUser] = useStateAuth(filled ? 'sarah.p' : '');
  const [pw, setPw] = useStateAuth(filled ? 'condobox123' : '');

  return (
    <div className="bg-mesh" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card-elev" style={{ width: 380, padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Logo size="lg"/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>Welcome back</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Sign in to manage your parcels.</div>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e)=>e.preventDefault()}>
          <div>
            <label className="field-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input className="input" placeholder="sarah.p" value={user} onChange={e=>setUser(e.target.value)} style={{ paddingLeft: 38 }}/>
              <span style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>
                <Icon.User size={16}/>
              </span>
            </div>
          </div>
          <div>
            <label className="field-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                     value={pw} onChange={e=>setPw(e.target.value)} style={{ paddingLeft: 38, paddingRight: 38 }}/>
              <span style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>
                <Icon.Lock size={16}/>
              </span>
              <button type="button" onClick={()=>setShowPw(s=>!s)}
                style={{ position: 'absolute', right: 8, top: 0, bottom: 0, padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                {showPw ? <Icon.EyeOff size={16}/> : <Icon.Eye size={16}/>}
              </button>
            </div>
          </div>
          <Button block size="lg" type="submit">Sign in</Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          New resident? <a href="#" className="lnk">Register here</a>
        </div>
      </div>
    </div>
  );
}

function ScreenRegister({ filled = true }) {
  const [room, setRoom] = useStateAuth(filled ? 'R005' : '');
  return (
    <div className="bg-mesh" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'auto' }}>
      <div className="card-elev" style={{ width: 400, padding: 32, display: 'flex', flexDirection: 'column', gap: 18, margin: '24px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Logo size="lg"/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>Create your account</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Sign up as a resident.</div>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e)=>e.preventDefault()}>
          <div>
            <label className="field-label">Full name</label>
            <input className="input" defaultValue={filled ? 'Sarah Phongphan' : ''} placeholder="Your full name"/>
          </div>
          <div>
            <label className="field-label">Username</label>
            <input className="input" defaultValue={filled ? 'sarah.p' : ''} placeholder="Choose a username"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">Password</label>
              <input className="input" type="password" defaultValue={filled ? 'condobox123' : ''} placeholder="••••••••"/>
            </div>
            <div>
              <label className="field-label">Confirm</label>
              <input className="input" type="password" defaultValue={filled ? 'condobox123' : ''} placeholder="••••••••"/>
            </div>
          </div>
          <div>
            <label className="field-label">Room ID <span style={{ color: 'var(--accent)' }}>*</span></label>
            <select className="select" value={room} onChange={e=>setRoom(e.target.value)}>
              <option value="" disabled>Select a room…</option>
              {MOCK.rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="field-help">Select your assigned room number.</div>
          </div>
          <Button block size="lg" type="submit">Create account</Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account? <a href="#" className="lnk">Sign in</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenLogin, ScreenRegister });
