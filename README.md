# SimpleInvoice

A full-stack invoice management app (ReactJS + NestJS + PostgreSQL) built for the 101 Digital full-stack assessment.

> **Note for the implementing agent — read this first.**
> - The **technical specification** is the source of truth for architecture, data model, API contracts, and business logic: [`docs/superpowers/specs/2026-07-17-simpleinvoice-design.md`](docs/superpowers/specs/2026-07-17-simpleinvoice-design.md). Build exactly to it, using the pinned versions in its §16 and the build order in its §15.
> - **`preview.html` is the authoritative design of the application.** Treat it as the visual reference for every screen — layout, the navy gradient header bands, the `#ffbe2e` amber accent on a white theme, typography, tables, badges, and form styling. The built UI must match `preview.html`. Open it in a browser to see all four screens (Login, Invoice List, Invoice Detail, Create Invoice).
> - Follow the **Engineering conventions** below on all code you write.

---

## Engineering conventions

These are project rules. Apply them to every file. They complement — never override — the technical spec.

### Component design
- **Max 5 props per component.** If a component needs more, it's doing too much. Split it, group related props into one object/config prop, or use composition. This is a hard limit.
- **Use compound components** for anything with coupled parts — e.g. `<InvoiceTable>` + `<InvoiceTable.Row>`, a `<Filters>` bar + `<Filters.Search>/<Filters.Status>/<Filters.Sort>`, a `<Card>` + `<Card.Header>/<Card.Body>`. Share state through context inside the compound, not through prop-drilling.
- **Nothing that returns JSX may be declared inside a component body** — no `renderX()` helpers, no JSX-returning `const`s, no components defined inside other components (they remount and reset state every render). Inline the JSX at the point of use, or extract a real top-level component.
- **Presentational components are pure** — driven entirely by props. They do not fetch data, navigate, or read global state.

### Data fetching (React Query)
- **Never call `useQuery` / `useMutation` directly inside a component.** Wrap each one in a named custom hook (`useInvoices`, `useInvoice`, `useCreateInvoice`, `useLogin`) under the feature's `api/` (or `hooks/`) folder, and call that hook from the component.
- **The React Query cache is the single source of truth for server state.** Never copy fetched data into other state (`useState`, a store); read it back through the query hook or `queryClient.getQueryData`.
- **Fetch at the page/container level** and drill resolved data into pure components via props. Handle loading/error at that boundary, not with scattered flags deep in the tree.
- **Always type request params and responses.** Never swallow errors with an empty `catch`; type catches as `unknown` and narrow — never `catch (e: any)`.

### Hooks
- A component body should read as **wiring + render**: every line is either `const x = useSomething(...)` or part of the returned JSX. Extract effects, non-trivial derivations, and imperative glue into **named hooks that each capture one concern** — not inline, and not bundled into a single `usePageEverything()` coordinator hook.
- **Max 3 levels of hook nesting** (component → feature hook → data hook). Prefer derived values computed during render over `useEffect` + `setState`. Reach for `useMemo` / `useCallback` only when cost or referential identity actually matters.

### Forms
- **`react-hook-form` + `zod`** for all forms and validation. Never Formik, never hand-rolled uncontrolled form state.

### Styling & theme
- The palette and layout are defined by **`preview.html`**. Define theme tokens **once** in `tailwind.config.js` (`theme.extend`) — navy `#0a1c3d` + the scrim gradient, amber `#ffbe2e`, status colors — and reference tokens / utility classes. Do not scatter raw hex values through components. Extract a reusable component for any repeated markup rather than duplicating it.

### Testing
- **Test names describe a business requirement**, not an implementation detail — e.g. *"shows Overdue when an unpaid invoice is past its due date"*, not *"calls deriveStatus"*.
- **Never mock presentational/UI components** — let them render and assert on the real output. Mock only true external boundaries (network, the DB in unit scope).
- **Unit-test** pure functions and hooks (total calc, overdue derivation, due-date validation); **integration-test** rendered flows (login, list search/filter, create-form validation); **one e2e** for create-invoice → appears-in-list. (See spec §11.)

### Commits
- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
- Before committing, run **lint** and **type-check** (and tests when UI changed).

---

## Build & run

- **Architecture overview:** npm-workspaces monorepo (`backend/`, `frontend/`). The backend is NestJS + Prisma + PostgreSQL exposing a JWT-guarded REST API; money math (`subTotal`/`taxAmount`/`totalAmount`/`balanceAmount`) is computed server-side with `Prisma.Decimal` and serialized as fixed-2 strings, and invoice status is derived at read time (`Overdue` is never persisted — it's computed from `status != 'Paid' && dueDate < today`). Customers live in their own normalized table with a foreign key from `invoices`. The frontend is React + Vite + TypeScript + Tailwind v3, with TanStack React Query as the single source of truth for server state (every `useQuery`/`useMutation` wrapped in a named hook under `src/api/`) and `react-hook-form` + `zod` for the create-invoice and login forms. The four screens — Login, Invoice List, Invoice Detail, Create Invoice — match the navy-gradient / amber-accent design in `preview.html`.
- **Run with Docker:** copy `.env.example` to `.env`, then `docker compose up --build`. Brings up Postgres, the backend (runs `prisma migrate deploy` + the idempotent seed on startup), and the frontend (built and served via nginx) — frontend at `http://localhost:5173`, API at `http://localhost:3000`.
- **Run without Docker:** start Postgres locally (or via a throwaway container), set `DATABASE_URL` in `backend/.env`, then `npm install` at the repo root followed by `npm run dev:api` and `npm run dev:web` (or `npm run seed` first to populate data).
- **Default reviewer credentials:** `reviewer@simpleinvoice.io` / `Password123` (seeded).
- **Seed the database:** `npm run seed` (idempotent — truncates and re-inserts, safe to re-run).
- **Exposed ports:** frontend `5173`, backend `3000` (Swagger at `http://localhost:3000/api/docs`), postgres `5432`.
- **Assumptions & design decisions:** JWT is stored in `localStorage` on the client (simplest approach satisfying "store token client-side"; trade-off vs. an `httpOnly` cookie is CSRF/XSS exposure — see Known limitations). Money is `Decimal(14,2)` in Postgres, serialized as fixed-2 strings in JSON to avoid float precision loss. Default `pageSize` is 10 (max 100). `currencySymbol` is derived on create from a small currency→symbol map and stored on the invoice row. `invoiceDate`/`dueDate` are SQL `date` columns; "today" for Overdue derivation uses the server's UTC date.
- **Known limitations:**
  - No invoice edit, delete, or payment-recording flow — the app covers create, list, and detail only, per the assessment's four required features (`totalPaid`/`balanceAmount` are modeled and seeded but there's no UI to record a payment).
  - No password reset, registration, or refresh-token flow — a single seeded reviewer account is the only login path, and the JWT simply expires (`JWT_EXPIRES_IN`) with no silent renewal.
  - JWT in `localStorage` is readable by any script on the page (XSS risk) and isn't automatically sent cross-origin (no CSRF risk from that vector, but there's no `httpOnly`/`SameSite` cookie hardening either) — acceptable for this assessment's scope, not production-hardened.
  - No optimistic UI updates — React Query refetches after mutations rather than patching the cache locally.
