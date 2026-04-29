# CondoBox — Project Overview

> A complete handoff document for **CondoBox**, a condo parcel management
> system. Hand this to anyone joining the project (engineering, design, or
> stakeholders) and they should be able to understand the app top-to-bottom
> without reading code.

## TL;DR

CondoBox is a Next.js 14 (App Router) web app that lets a condo's front
desk track incoming parcels, generate QR codes for them, and confirm
pickups via QR scan + OTP. Residents have their own dashboard showing
parcels addressed to their room, with a real-time bell-badge that
updates the moment the office logs a new delivery.

- **Two roles**: `admin` (front desk) and `owner` (resident)
- **Auth**: cookie-based JWT sessions
- **Storage**: SQLite via Prisma (file: `prisma/dev.db`)
- **Realtime**: Server-Sent Events on `/api/events`, in-memory event bus
- **Design system**: Plus Jakarta Sans + JetBrains Mono, indigo accent,
  CSS-variable tokens with light/dark modes baked in

---

## Tech stack

| Layer        | Choice                                          | Why                                             |
| ------------ | ----------------------------------------------- | ----------------------------------------------- |
| Framework    | Next.js 14.2 (App Router)                       | Server components + Route Handlers in one repo  |
| Language     | TypeScript 5                                    | Type safety end to end                          |
| Database     | SQLite via Prisma 5                             | Zero-setup local persistence                    |
| Auth         | `jose` (JWT) + httpOnly cookie                  | Stateless, no session table                     |
| Hashing      | `bcryptjs`                                      | Standard password hashing                       |
| QR generate  | `qrcode`                                        | Real QR rendered to data URL                    |
| QR scan      | `html5-qrcode`                                  | Browser-camera scanning                         |
| Realtime     | Server-Sent Events (no extra deps)              | Simple, Vercel-friendly, single-tab             |
| Styling      | Tailwind base + custom CSS variables            | Token system with built-in dark mode            |
| Fonts        | `next/font` → Plus Jakarta Sans + JetBrains Mono | Self-hosted, no FOUT                            |

No socket.io / Pusher / Firebase. No service worker. No Redis.

---

## Quick start

```bash
npm install
npx prisma migrate dev      # creates prisma/dev.db
npx prisma db seed          # creates default admin
npm run dev                 # http://localhost:3000
```

### Demo credentials

| Role  | Username | Password   |
| ----- | -------- | ---------- |
| Admin | `admin`  | `admin123` |

Residents register themselves at `/register` after the admin runs setup.

### End-to-end demo workflow

1. Log in as admin → initialize condo (e.g. 10 rooms) at `/admin/setup`.
2. Log out → register a resident at `/register` and pick R001.
3. Log in as admin → create a parcel for R001 at `/admin/parcels/new`.
4. The QR is shown on screen and printable.
5. Open `/admin/scan`, paste the parcel code or scan the QR with a webcam,
   enter OTP `123456`, confirm pickup.
6. Log in as the resident → the parcel appears in History (live, no refresh
   needed if the tab was already open during step 5).

---

## Roles & permissions

| Capability                  | Admin   | Owner (resident) |
| --------------------------- | ------- | ---------------- |
| Initialize condo            | ✅      | ❌               |
| Create parcel               | ✅      | ❌               |
| Confirm pickup (scan + OTP) | ✅      | ❌               |
| List **all** parcels        | ✅      | ❌               |
| List own parcels            | ✅\*    | ✅               |
| View own profile            | ✅      | ✅               |
| Register a new account      | public  | public           |

\* Admin sees all parcels; owners only see parcels for their `roomId`.

`middleware.ts` enforces role-based redirects at the edge (UX gate). Every
API mutation also re-checks via `requireAdmin()` / `requireUser()` (security
gate, defense in depth).

---

## Pages

### Public

| Path        | Component                              | Purpose                                  |
| ----------- | -------------------------------------- | ---------------------------------------- |
| `/login`    | `app/login/page.tsx`                   | Username + password, mesh background     |
| `/register` | `app/register/page.tsx`                | Resident self-signup, picks a free room  |

### Admin (desktop-first)

| Path                  | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `/admin/setup`        | One-time onboarding — choose total room count, generates `R001…` |
| `/admin/dashboard`    | Stats (Waiting / Picked up today / Occupied rooms) + lists       |
| `/admin/parcels/new`  | 2-step form (Details → QR ready) creating a new parcel + QR      |
| `/admin/scan`         | Camera scanner + manual code + 6-digit OTP confirm               |

### Resident (mobile-first, with bottom tab bar)

| Path                  | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `/resident/dashboard` | Greeting, OTP card, "Waiting for pickup" cards, History          |
| `/resident/parcels`   | Filterable list (All / Waiting / Picked up)                      |
| `/resident/profile`   | Avatar, name, username, room, parcel stats, sign out             |

The bottom tab bar (`components/ResidentTabBar.tsx`) ties these three pages
together. Tapping any waiting parcel opens a bottom-sheet modal
(`components/ParcelDetailSheet.tsx`) with the parcel's QR + a copyable UUID.

---

## API routes

All routes live under `app/api/`. JSON in, JSON out, no GraphQL.

| Method  | Path                                | Auth         | Description                                         |
| ------- | ----------------------------------- | ------------ | --------------------------------------------------- |
| `POST`  | `/api/auth/login`                   | public       | Verifies credentials, sets `session` cookie         |
| `POST`  | `/api/auth/register`                | public       | Creates a resident account bound to a free room     |
| `GET`   | `/api/auth/me`                      | required     | Returns the current user                            |
| `POST`  | `/api/auth/logout`                  | required     | Clears the session cookie                           |
| `GET`   | `/api/condo/status`                 | required     | Whether the condo has been initialized              |
| `POST`  | `/api/condo/setup`                  | admin        | Initialize with N rooms (one-time)                  |
| `GET`   | `/api/rooms`                        | mixed\*      | List rooms (`?available=true` is public for signup) |
| `GET`   | `/api/parcels`                      | required     | All parcels (admin) or own room (owner)             |
| `POST`  | `/api/parcels`                      | admin        | Create parcel + QR; emits `parcel:new` event        |
| `GET`   | `/api/parcels/:id`                  | required     | Parcel details; owners restricted to their room     |
| `GET`   | `/api/parcels/qr/:qrCode`           | admin        | Look up parcel by QR UUID (used by scan flow)       |
| `POST`  | `/api/parcels/:id/pickup`           | admin        | Confirm pickup with OTP; emits `parcel:picked_up`   |
| `GET`   | `/api/events`                       | required     | **SSE stream** of live parcel events                |

\* `/api/rooms?available=true` is intentionally public so the registration
page can populate its dropdown without a session.

---

## Data model (Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  passwordHash String
  name         String
  role         String          // "admin" | "owner"
  roomId       String?  @unique  // owners only; one user per room
  room         Room?    @relation(fields: [roomId], references: [id])
  createdAt    DateTime @default(now())
}

model Room {
  id         String   @id          // "R001", "R002", ...
  isOccupied Boolean  @default(false)
  createdAt  DateTime @default(now())
  user       User?
  parcels    Parcel[]
}

model Parcel {
  id          String    @id @default(cuid())
  qrCode      String    @unique     // UUID printed on the sticker
  roomId      String
  room        Room      @relation(fields: [roomId], references: [id])
  sender      String                // "Lazada", "DHL", etc.
  description String                // free-form: weight, size, notes
  status      String    @default("waiting")  // "waiting" | "picked_up"
  arrivedAt   DateTime  @default(now())
  pickedUpAt  DateTime?
  @@index([roomId])
  @@index([status])
}

model CondoConfig {
  id            Int      @id @default(1)   // single-row table
  totalRooms    Int      @default(0)
  isInitialized Boolean  @default(false)
  createdAt     DateTime @default(now())
}
```

**Notes**
- SQLite has no native enums, so `role` and `status` are validated in
  `lib/models/*` and via TypeScript types.
- One user per room (`User.roomId` is `@unique`).
- `CondoConfig` is a **singleton** (always id=1) — guards the
  initialize-once flow.
- `Parcel.qrCode` is a UUID; this is what's encoded into the printed QR.

Model accessors live in `lib/models/`:
- `condo.ts` — `getCondoConfig`, `initializeCondo`
- `parcel.ts` — `createParcel`, `getParcelById`, `getParcelByQrCode`,
  `listAllParcels`, `listParcelsByRoom`, `markParcelPickedUp`
- `room.ts` — `listRooms`
- `user.ts` — `findUserByUsername`, `verifyPassword`, `createOwner`

All Prisma access is centralized here; pages and API routes never import
`prisma` directly.

---

## Authentication

- **Sessions**: signed JWT (`HS256`) in an `httpOnly`, `sameSite=lax` cookie
  named `session`. 7-day TTL. Secret comes from `JWT_SECRET` env var.
- **Login** verifies bcrypt hash, then calls `createSession({userId, role})`.
- **Middleware** (`middleware.ts`) reads & verifies the cookie at the edge:
  - Unauthenticated → `/login` (except for `/login`, `/register`)
  - Wrong role for `/admin/*` or `/resident/*` → redirect to the user's
    home dashboard.
- **Defense in depth**: every mutating API route calls `requireAdmin()` or
  `requireUser()` — the middleware is just a UX redirect.
- The OTP for pickup is currently a **fixed prototype value** (`123456`,
  overridable via `FIXED_OTP` env var). A real implementation would
  rotate the OTP per-resident per-day.

---

## Real-time updates (SSE)

When an admin creates a parcel or confirms a pickup, all open dashboards
(both resident and admin) update without a page refresh.

### How it works

```
┌──────────────────────────┐                 ┌──────────────────────────┐
│  POST /api/parcels       │  emitParcel()   │  in-memory event bus     │
│  POST /api/.../pickup    │ ──────────────► │  (lib/events.ts)         │
└──────────────────────────┘                 └─────────────┬────────────┘
                                                           │ on(event)
                                                           ▼
                                            ┌──────────────────────────┐
                                            │  GET /api/events  (SSE)  │
                                            │  filters by user role    │
                                            └─────────────┬────────────┘
                                                          │ data: {...}
                                                          ▼
                                            ┌──────────────────────────┐
                                            │  <LiveUpdates /> island  │
                                            │  EventSource → refresh() │
                                            └──────────────────────────┘
```

### Pieces

| File                              | Role                                                   |
| --------------------------------- | ------------------------------------------------------ |
| `lib/events.ts`                   | Singleton Node `EventEmitter` + typed `ParcelEvent`    |
| `app/api/events/route.ts`         | SSE endpoint (Node runtime, force-dynamic, 25s ping)   |
| `components/LiveUpdates.tsx`      | Client island that opens EventSource → `router.refresh()` |
| `app/api/parcels/route.ts`        | Emits `parcel:new` after `createParcel`                |
| `app/api/parcels/[id]/pickup/...` | Emits `parcel:picked_up` after `markParcelPickedUp`    |

### Event shapes

```ts
type ParcelEvent =
  | { type: "parcel:new";       roomId: string; parcelId: string }
  | { type: "parcel:picked_up"; roomId: string; parcelId: string };
```

### Audience filter (server-side)

- **Admin** receives every event.
- **Owner** receives only events whose `roomId === user.roomId`.

The client subscribes blindly — when any event lands it just calls
`router.refresh()`. The page's existing Prisma queries (e.g.
`listParcelsByRoom`) re-run on the server and the UI updates as a tree.

### Known limitations

1. **In-memory bus**: events only fan out within a single Node process.
   For multi-instance / serverless scale, swap the body of `lib/events.ts`
   to Redis Pub/Sub — same public API.
2. **Tab must be open**: SSE delivers nothing while the tab is closed. A
   future iteration could add Web Push (service worker + VAPID) for
   tab-closed notifications without changing this work.

---

## Design system

CSS-variable tokens defined in `app/globals.css`. Two themes (`:root` =
light, `.dark` = dark) share the same variable names.

### Palette

| Token              | Light       | Dark        | Where used                       |
| ------------------ | ----------- | ----------- | -------------------------------- |
| `--bg`             | `#f7f7f8`   | `#0a0a0c`   | Page background                  |
| `--bg-elev`        | `#ffffff`   | `#131318`   | Cards, navbar                    |
| `--text`           | `#0b0b0f`   | `#f4f4f6`   | Primary text                     |
| `--accent`         | `#4f46e5`   | `#6366f1`   | Buttons, links, accent fills     |
| `--accent-soft`    | `#eef2ff`   | `#1e1b4b`   | Badge background, soft fills     |
| `--amber` / `--emerald` / `--rose` | semantic | semantic | Status badges & inline messages |

### Typography

- Body: **Plus Jakarta Sans** (400/500/600/700/800)
- Mono: **JetBrains Mono** (codes, OTP, UUIDs)
- Loaded via `next/font/google` in `app/layout.tsx` and exposed as
  `--font-jakarta` / `--font-mono`.

### Reusable utility classes (in `globals.css`)

- `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost`,
  `.btn-sm` / `.btn-lg` / `.btn-block`
- `.card` / `.card-elev` (different shadow elevations)
- `.input` / `.select`
- `.badge` + `.badge-waiting` / `.badge-picked` / `.badge-room`
- `.bg-mesh` (radial-gradient auth background)
- `.glow-accent` (used on the resident OTP card)
- `.qr-frame`, `.mono`, `.lnk`, `.divider`, `.scroll-y`

---

## Component catalog

`components/` only — pages live under `app/`.

| Component             | Type   | Purpose                                                |
| --------------------- | ------ | ------------------------------------------------------ |
| `Logo`                | server | Brand mark with "Condo**Box**" wordmark                |
| `Icon`                | server | Lucide-style inline SVG icons (Package, QrCode, etc.)  |
| `Button`              | server | `primary` / `secondary` / `ghost` × `sm` / `md` / `lg` |
| `RoomBadge`           | server | "R005" pill in accent color                            |
| `StatusBadge`         | server | "Waiting" (amber) / "Picked up" (emerald)              |
| `StatCard`            | server | Big-number tile for the admin dashboard                |
| `EmptyState`          | server | Icon + title + body + optional action                  |
| `Navbar`              | client | Admin top bar with user pill + sign-out                |
| `ParcelCard`          | server | Two variants: `admin` row, `resident` card             |
| `ResidentParcelList`  | client | Wraps cards, owns the "open detail sheet" state        |
| `ParcelDetailSheet`   | client | Bottom-sheet modal: QR + copyable UUID + details       |
| `ResidentTabBar`      | server | Bottom tab bar (Home / Parcels / Profile)              |
| `OTPInput`            | client | 6-cell visual OTP with hidden overlaid input           |
| `QRDisplay`           | client | Real QR code via `qrcode` lib                          |
| `QRScanner`           | client | Camera-based QR scanning via `html5-qrcode`            |
| `LiveUpdates`         | client | Mounts EventSource → `router.refresh()` on each event  |

### Feature flag worth knowing about

`components/ParcelDetailSheet.tsx` has a top-level constant:

```ts
const SHOW_PARCEL_UUID = true;
```

Flip to `false` to hide the copy-UUID block from the resident parcel
sheet. One line, no other changes needed.

---

## File structure

```
condo-app/
├── app/
│   ├── api/
│   │   ├── auth/{login,logout,me,register}/route.ts
│   │   ├── condo/{setup,status}/route.ts
│   │   ├── events/route.ts                ← SSE endpoint
│   │   ├── parcels/
│   │   │   ├── route.ts                   ← GET list + POST create
│   │   │   ├── [id]/route.ts              ← GET by id
│   │   │   ├── [id]/pickup/route.ts       ← POST pickup
│   │   │   └── qr/[qrCode]/route.ts       ← GET by QR UUID
│   │   └── rooms/route.ts
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── parcels/new/{page.tsx, new-parcel-form.tsx}
│   │   ├── scan/{page.tsx, scan-client.tsx}
│   │   └── setup/{page.tsx, setup-form.tsx}
│   ├── resident/
│   │   ├── dashboard/page.tsx
│   │   ├── parcels/page.tsx
│   │   └── profile/{page.tsx, logout-button.tsx}
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx                         ← loads fonts
│   ├── globals.css                        ← design tokens
│   └── page.tsx                           ← redirects based on role
├── components/                            ← see catalog above
├── lib/
│   ├── auth.ts                            ← JWT session helpers + role guards
│   ├── db.ts                              ← Prisma client singleton
│   ├── events.ts                          ← real-time event bus
│   └── models/{condo,parcel,room,user}.ts ← all Prisma access
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                            ← creates default admin
│   └── migrations/
├── middleware.ts                          ← edge role-based redirects
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Environment variables

Listed in `.env.local` (not committed). Example shape:

```bash
# Required
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="long-random-string-rotate-in-prod"

# Optional
FIXED_OTP="123456"          # default OTP used by scan/pickup; override per env
```

The auth layer **throws if `JWT_SECRET` is missing**; the app won't start
without it.

---

## Scripts

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Start Next.js dev server on http://localhost:3000  |
| `npm run build`   | `prisma generate` then `next build` (production)   |
| `npm run start`   | Serve the production build                         |
| `npm run lint`    | ESLint via `next lint`                             |
| `npm run db:seed` | Re-run the seed (idempotent — uses upsert)         |
| `npm run db:reset`| Wipe database + re-migrate + re-seed               |
| `npm run db:studio`| Prisma Studio GUI for inspecting tables           |

---

## Build & deploy notes

- The build output (verified) shows:
  - 19 routes total, 5 user-facing pages.
  - `/api/events` is `ƒ` (dynamic) and uses the **Node runtime** — required
    for SSE / `EventEmitter`.
  - `/login` and `/register` are static; everything else is dynamic
    (because of `cookies()` and `force-dynamic`).
- **Vercel**: works for the app itself. SSE works on Vercel's Node
  functions, but each function is a separate process — for true
  cross-instance fan-out, `lib/events.ts` would need to be replaced with
  Redis Pub/Sub.
- **Single-server deployments** (your own VPS, Railway, Fly.io): work
  out of the box; the in-memory bus fans out across all open SSE clients.

---

## Known limitations & deliberate non-goals

1. **OTP is a fixed prototype value** (`123456`). Real deployments need
   per-resident, time-rotating codes.
2. **In-memory event bus** — single-Node-process only.
3. **No web push notifications** — SSE only delivers while the tab is open.
4. **No event log / audit trail** — `parcel:new` and `parcel:picked_up`
   are ephemeral; we don't persist a `Notification` table.
5. **No internationalization** — all copy is English.
6. **No offline mode** — the app assumes connectivity.
7. **Admin dashboard "Recent pickups" is currently 10 rows** — no
   pagination or search yet.
8. **Bell icon on resident dashboard** is a passive indicator; tapping
   it doesn't open a notifications drawer.

---

## Glossary

| Term       | Meaning                                                          |
| ---------- | ---------------------------------------------------------------- |
| Admin      | Front-desk staff. Role string: `admin`.                          |
| Owner      | Resident. Role string: `owner`. Bound to exactly one room.       |
| Parcel     | A logged delivery. Has a UUID-encoded QR for pickup.             |
| OTP        | The 6-digit code the resident shows the office at pickup.        |
| Bus        | The in-memory event emitter (`lib/events.ts`).                   |
| SSE        | Server-Sent Events — one-way streaming HTTP, used for live updates. |
| Mesh bg    | The soft radial-gradient background on auth screens.             |

---

_Last updated alongside the implementation in this branch._
