# SimpleInvoice

Full-stack invoice management app — create, list, filter and view invoices behind JWT auth.

## Architecture

npm-workspaces monorepo:

```
backend/    NestJS + Prisma + PostgreSQL — JWT-guarded REST API
frontend/   React + Vite + TypeScript + Tailwind + shadcn/ui + React Query
docs/       Technical spec, preview.html (UI reference), assignment
```

- **Backend** — controllers → services (business logic) → repository (Prisma). Money math is computed server-side with `Prisma.Decimal` and serialized as fixed-2 strings. Pure logic (`calculateTotals`, `deriveStatus`) lives in `src/invoices/logic/` and is unit-tested in isolation. Swagger at `/api/docs`.
- **Frontend** — feature folders (`login`, `invoice-list`, `invoice-detail`, `create-invoice`), each with its own `hooks/`, `components/`, `schema/`. Every `useQuery`/`useMutation` is wrapped in a named hook; React Query is the single source of truth for server state. List filters/sort/page live in the URL.
- **Data model** — `users`, `customers`, `invoices`, `invoice_items`. Customers are normalized into their own table with a FK from `invoices`.

## Running locally

### With Docker

```bash
cp .env.example .env
docker compose up --build
```

Brings up Postgres, the backend (runs `prisma migrate deploy` + seed on startup), and the frontend (built, served by nginx).

- Frontend — http://localhost:5173
- API — http://localhost:3000 (Swagger: http://localhost:3000/api/docs)
- Postgres — localhost:5432

### Without Docker

Requires Node 20+ and a running PostgreSQL.

```bash
cp .env.example .env            # set DATABASE_URL to your local Postgres
npm install                     # installs both workspaces
npm run migrate:deploy --workspace backend
npm run seed
npm run dev:api                 # backend on :3000
npm run dev:web                 # frontend on :5173 (separate terminal)
```

## Reviewer credentials

```
Email:    reviewer@simpleinvoice.io
Password: Password123
```

## Database seed

```bash
npm run seed
```

Creates the reviewer user, one Appendix A invoice (`IV1780488206995`) and 32 generated invoices spanning all statuses and currencies.

## Design decisions & assumptions

- **JWT in `localStorage`** — simplest client-side storage satisfying the brief. Trade-off vs. an `httpOnly` cookie is XSS exposure; see limitations.
- **Money as `Decimal(14,2)`** in Postgres, computed with `Prisma.Decimal`, serialized as fixed-2 strings in JSON to avoid float precision loss.
- **`Overdue` is never persisted** — it is derived at read time from `status != 'Paid' && dueDate < today`, using the server's UTC date. The DB enum only holds `Draft`/`Pending`/`Paid`.
- **`currencySymbol`** is resolved from a currency→symbol map on create and stored on the invoice row.
- **`invoiceDate`/`dueDate`** are SQL `date` columns (no time, no timezone).
- **Pagination** defaults to `pageSize` 10, capped at 100.
- **Each create inserts a new customer row** — there is no dedupe/lookup of existing customers by email.
- **Filters live in the URL** so list views are shareable and survive refresh.

## Known limitations

- **No edit, delete, or payment-recording flow** — create, list and detail only. `totalPaid`/`balanceAmount` are modeled and seeded but there is no UI to record a payment.
- **No registration, password reset, or refresh tokens** — the seeded reviewer account is the only login path; the JWT simply expires (`JWT_EXPIRES_IN`) with no silent renewal.
- **Invoices support a single line item** — the schema is one-to-many, but the create form and API DTO accept only one item.
- **No error or empty states in the UI** — a failed request renders the loading placeholder indefinitely, and a zero-result list renders a bare table header.
- **Pagination renders every page number** without windowing.
- **No optimistic updates** — React Query refetches after mutations rather than patching the cache.
