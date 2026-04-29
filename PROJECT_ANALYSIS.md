# CondoBox Project Analysis

## Project Overview

**CondoBox** is a web-based parcel management system for condominium front desks and residents. Its main goal is to make parcel tracking, notification, and pickup confirmation more organized and secure.

The system supports two user roles:

- **Admin / Front desk staff**: manages rooms, creates parcel records, generates QR codes, scans parcels, and confirms pickups.
- **Resident / Owner**: views their own parcels, pickup history, room profile, and pickup code.

The project follows an MVC-like structure:

- **Model**: database logic in `lib/models/`
- **View**: pages and UI components in `app/` and `components/`
- **Controller**: API route handlers in `app/api/`

## Tech Stack

| Area | Technology Used |
| --- | --- |
| Frontend framework | Next.js 14 App Router |
| Programming language | TypeScript |
| UI library | React 18 |
| Styling | Tailwind CSS + custom CSS variables |
| Database | SQLite |
| ORM | Prisma |
| Authentication | JWT using `jose` |
| Password security | `bcryptjs` |
| QR generation | `qrcode` |
| QR scanning | `html5-qrcode` |
| Realtime updates | Server-Sent Events |
| Fonts | Plus Jakarta Sans and JetBrains Mono via `next/font` |
| Package manager | npm |

## Core Features

### 1. Authentication and Authorization

The app uses JWT-based authentication stored in an HTTP-only cookie. Passwords are hashed with `bcryptjs`.

Role-based access is handled in two layers:

- `middleware.ts` redirects users based on role.
- API routes re-check permissions using helper functions like `requireAdmin()` and `requireUser()`.

Relevant files:

- `lib/auth.ts`
- `middleware.ts`

### 2. Admin Dashboard

The admin dashboard gives front desk staff a summary of condo parcel activity:

- Number of parcels waiting for pickup
- Number of parcels picked up today
- Number of occupied rooms
- List of waiting parcels
- Recent pickup history

Relevant file:

- `app/admin/dashboard/page.tsx`

### 3. Resident Dashboard

Residents can view:

- Their assigned room
- Pickup code
- Parcels waiting for pickup
- Pickup history
- Parcel detail sheet with QR and UUID

Relevant file:

- `app/resident/dashboard/page.tsx`

### 4. Parcel Creation and QR Code Flow

When an admin creates a parcel:

1. The parcel is saved in the database.
2. A unique UUID is generated.
3. The UUID is encoded as a QR code.
4. The resident dashboard receives a realtime update.

Relevant files:

- `app/api/parcels/route.ts`
- `lib/models/parcel.ts`
- `components/QRDisplay.tsx`

### 5. Pickup Confirmation

The admin can scan or manually enter the parcel QR code, then confirm pickup using an OTP.

The current prototype uses a fixed OTP:

```text
123456
```

Relevant files:

- `app/admin/scan/scan-client.tsx`
- `app/api/parcels/[id]/pickup/route.ts`

### 6. Realtime Updates

The project uses Server-Sent Events instead of WebSockets. When a parcel is created or picked up, the backend emits an event. Connected dashboards receive the event and refresh automatically.

Relevant files:

- `lib/events.ts`
- `app/api/events/route.ts`
- `components/LiveUpdates.tsx`

## Database Design

The database uses Prisma with SQLite.

Main tables:

| Table | Purpose |
| --- | --- |
| `User` | Stores admin and resident accounts |
| `Room` | Stores condo room records such as `R001`, `R002` |
| `Parcel` | Stores parcel details, QR code, status, and pickup time |
| `CondoConfig` | Stores one-time condo setup status |

Relevant file:

- `prisma/schema.prisma`

Important relationships:

- One resident belongs to one room.
- One room can have many parcels.
- A parcel belongs to one room.
- Each parcel has a unique QR code.

## System Workflow

A good demo flow for the presentation:

1. Admin logs in using `admin / admin123`.
2. Admin initializes condo rooms, for example 10 rooms.
3. Resident registers and selects an available room.
4. Admin creates a parcel for that resident's room.
5. The system generates a QR code.
6. Resident sees the parcel on their dashboard.
7. Admin scans the QR code.
8. Admin enters OTP `123456`.
9. Parcel status changes from `waiting` to `picked_up`.
10. Resident history updates automatically.

## Strengths of the Project

- Clear role separation between admin and resident.
- Uses modern full-stack Next.js architecture.
- Secure password hashing with bcrypt.
- JWT session stored in HTTP-only cookies.
- Prisma makes database access structured and type-safe.
- QR code workflow makes parcel pickup more practical.
- Server-Sent Events provide realtime updates without extra services.
- UI is organized with reusable components.
- Good separation between database models, API controllers, and views.

## Limitations and Future Improvements

- OTP is currently fixed; a production version should generate dynamic OTPs per resident or per parcel.
- SQLite is good for prototype/demo, but PostgreSQL or MySQL would be better for production.
- Realtime events use an in-memory event bus, so it works best on a single server process.
- No audit log yet for tracking who created or confirmed parcels.
- No search, pagination, or advanced filtering for large parcel lists.
- The resident notification bell is only an indicator; it does not open a notification center yet.
- There are some debug `console.log` statements in auth/root page code that should be removed before final deployment.

## Presentation Summary

CondoBox is a full-stack Next.js parcel management system that helps condo staff register deliveries, generate QR codes, confirm pickups with OTP, and notify residents in realtime.

