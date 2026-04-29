# Condo Parcel Management System

Prototype Next.js + Prisma + SQLite app implementing the spec in `../files/`.

## Quick start

```bash
npm install              # install deps (already done if you ran scaffold)
npx prisma migrate dev   # create dev.db (already done if migrated)
npx prisma db seed       # seed default admin (admin / admin123)
npm run dev              # http://localhost:3000
```

## Demo credentials

- Admin: `admin` / `admin123`

## Demo workflow

1. Log in as admin → initialize condo (e.g. 10 rooms).
2. Log out → register a resident (pick R001).
3. Log in as admin → create a parcel for R001.
4. Note the QR code (printed on screen).
5. Open `/admin/scan` → paste the QR code value → enter OTP `123456` → confirm pickup.
6. Log in as the resident → see the parcel in History.

## Layout (MVC)

| Layer | Folder | Notes |
|-------|--------|-------|
| Model | `lib/models/` + `prisma/` | All DB access lives here |
| View | `app/**/page.tsx` + `components/` | Server Components for reads, Client Components for forms |
| Controller | `app/api/**/route.ts` | All write paths go through API routes |

`middleware.ts` enforces role-based redirects at the edge (UX gate).
API route handlers re-check roles via `requireAdmin()` (security gate).

## Useful scripts

```bash
npm run db:seed     # re-seed
npm run db:reset    # wipe + remigrate + reseed
npm run db:studio   # GUI for inspecting tables
```
