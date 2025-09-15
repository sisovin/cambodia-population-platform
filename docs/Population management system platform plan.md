# Population management system platform plan

You’re aiming for a real, living system that communes can trust with their people’s stories—birth to death—without friction or fear. Below is a concrete, build-ready plan that keeps your multi-tenancy, modules, and mixed stack intact, while staying responsive across devices and workable for on-the-ground registrars in Cambodia. The scope, modules, stack, and deployment align with your attached roadmap and presentation.

---

## Architecture overview

- **Style:** Modular, service-oriented backend with a unified auth layer; polyglot APIs for legacy continuity; responsive, accessible UI for Khmer/English; multi-tenancy at commune level; observability and audit-first design. The stack mirrors your plan: Next.js + React + Shadcn + Tailwind v4 and BlazorWasm on the frontend; Node.js TSX, PHP legacy adapters, Python jobs; MySQL/PostgreSQL/MongoDB; Vercel/Docker/NGINX/PM2/GitHub Actions.
- **Why this shape:** It lets you evolve quickly, keep legacy integrations, and isolate tenant data cleanly while enabling batch analytics and cleaning pipelines described in your documents.

```mermaid
flowchart LR
  subgraph Client
    Web[Next.js 15 + React 19 + Tailwind v4 + shadcn/ui]
    Blazor[Blazor WebAssembly (.NET 10)]
  end

  subgraph Edge
    Vercel[Vercel Edge + CDN]
    NGINX[NGINX Reverse Proxy]
  end

  subgraph Auth
    NextAuth[NextAuth/JWT]
    RBAC[RBAC: admin/registrar/viewer]
  end

  subgraph Services
    NodeAPI[Node.js TSX API (GraphQL/REST)]
    PHPAPI[PHP Legacy Endpoints]
    PyJobs[Python 3.12 Jobs (ETL, anomaly detection)]
  end

  subgraph Data
    PG[(PostgreSQL - primary, RLS, reporting views)]
    MySQL[(MySQL - transactional/legacy)]
    Mongo[(MongoDB - documents, ledger, logs)]
    Blob[(Object Storage - files, PDFs)]
  end

  subgraph Integrations
    NCDD[NCDD commune dataset sync]
  end

  Web-->Vercel-->NGINX-->NodeAPI
  Blazor-->NGINX
  NodeAPI<-->PHPAPI
  NodeAPI<-->PyJobs
  NodeAPI<-->NextAuth
  NextAuth-->RBAC

  NodeAPI<-->PG
  NodeAPI<-->MySQL
  NodeAPI<-->Mongo
  PyJobs--ETL-->PG
  PyJobs--cleanup-->Mongo
  PyJobs--sync-->NCDD
```

- **Key modules:** Legislation ledger, family book, residential card, national SIM identity, death registration, NCDD commune integration—delivered as cohesive features in the platform.

> Sources: 

---

## Data model and multi-tenancy

#### Core entities
- **Citizens:** Lifecycle anchor; link to family, residence, IDs, death record.
- **Families:** Household grouping; head of family; commune address.
- **Residences:** Movements, residential card validity windows.
- **Identity cards:** SIM identity metadata and validity.
- **Death records:** Cause, date, certifier triggers archival/reporting.
- **Legislation ledger:** Commune-scoped laws, updates, citizen links.
- **Communes:** Name, code, province/district metadata.
- **Users:** RBAC with commune scoping.

```mermaid
erDiagram
  COMMUNES ||--o{ USERS : has
  COMMUNES ||--o{ FAMILIES : has
  COMMUNES ||--o{ LEGISLATION_LEDGER : has
  FAMILIES ||--o{ CITIZENS : contains
  CITIZENS ||--|| RESIDENCES : latest_residence
  CITIZENS ||--o{ IDENTITY_CARDS : holds
  CITIZENS ||--o| DEATH_RECORDS : has
  LEGISLATION_LEDGER }o--o{ CITIZENS : related

  COMMUNES { int id PK, text name, text code, text province, text district, int population, numeric area_km2 }
  USERS { int id PK, text name, text email, text role, int commune_id FK, text password_hash }
  FAMILIES { int id PK, text family_book_number, int head_of_family_id FK, int commune_id FK, text address }
  CITIZENS { int id PK, text full_name, date dob, text gender, text birth_place, int family_id FK, int commune_id FK, text national_id }
  RESIDENCES { int id PK, int citizen_id FK, text residential_card_number, int commune_id FK, text address, date valid_from, date valid_to }
  IDENTITY_CARDS { int id PK, int citizen_id FK, text sim_card_number, date issue_date, date expiry_date }
  DEATH_RECORDS { int id PK, int citizen_id FK, date date_of_death, text cause, text certified_by }
  LEGISLATION_LEDGER { int id PK, int commune_id FK, text title, text description, date date_enacted }
```

#### Multi-tenancy strategy
- **Tenant scoping:** Every row in primary tables includes `commune_id`. Enforce in code and database constraints.
- **Row-level security (RLS):** Use PostgreSQL as the primary read/write store for governance features and enforce policies like:
  - `USING (commune_id = current_setting('app.commune_id')::int)`
  - `WITH CHECK (commune_id = current_setting('app.commune_id')::int)`
- **Roles:** `admin`, `registrar`, `viewer` mapped to permissions per module and mutation paths, consistent with your RBAC outline.
- **Alternative isolation:** If political boundaries demand stronger separation, optionally shard by schema per commune for high-volume provinces; keep shared lookup/reference schemas for code/deploy simplicity.

> Sources: 

---

## Frontend implementation

#### Next.js 15 + React 19 + shadcn + Tailwind v4
- **App structure:** Keep your `/app/(tenants|registry|dashboard|api)` layout; colocate module routes under feature folders for bundle hygiene and clearer ownership.
- **Responsiveness:** Tailwind v4 container queries, fluid type, and responsive grid. Test breakpoints for iOS/Android/Tablet/Laptop-PC with device-specific QA scenarios.
- **Localization and script:** Khmer and English with next-intl; embed Khmer fonts; ensure input masks accommodate Khmer names and national formats; RTL not required for Khmer but verify glyph widths.
- **Data entry UX:** Stepper forms with inline validation, autosave drafts, duplicate detection (DOB + full name + family + commune), and AI-assisted prompts to reduce errors (policy tips from legislation ledger).
- **Accessibility:** WCAG AA, color-contrast tested palettes, keyboard nav, error summaries.

```tsx
// Example: tenant-aware layout middleware (Next.js)
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const sub = host.split('.')[0]; // e.g., wat-phnom.commune.gov.kh
  const res = NextResponse.next();
  res.headers.set('x-tenant', sub);
  return res;
}
```

#### Blazor WebAssembly (.NET 10)
- **Purpose:** Offline-friendly registrar workflows (e.g., mobile clinics), heavy forms, and batch uploads where WebAssembly performance and .NET validation shine.
- **Hosting:** Served under `/registrar` route; shares the same auth tokens and tenant headers as Next.js.
- **Interoperability:** Use OpenAPI client generation to call Node API; store drafts in IndexedDB for offline; sync when online with optimistic concurrency.

> Sources: 

---

## Backend services and APIs

#### Node.js TSX API (primary gateway)
- **API shape:** REST with JSON for breadth; GraphQL for complex dashboards. Versioned routes `/v1/{module}`.
- **Validation:** Zod or class-validator; consistent error shapes with i18n-ready messages.
- **Auth:** NextAuth with JWT; include `commune_id` claim; map roles to scopes: `population:write`, `ledger:admin`, `reports:read`.
- **Write paths:** Wrap mutations in transactions; enforce RLS by setting `app.commune_id` per connection.
- **Search:** Postgres trigram indices for names; optional Elasticsearch later if needed.

#### PHP legacy endpoints
- **Role:** Adapters for existing commune systems; proxy through Node to standardize auth, logging, and response formatting; phase down over time.

#### Python jobs
- **Jobs:** NCDD sync (nightly), anomaly detection (duplicate identities, out-of-range dates), data cleaning recommendations, PDF generation for bulk certificates.
- **Orchestration:** Cron or lightweight scheduler; emit audit logs to MongoDB.

#### Datastores
- **PostgreSQL:** Primary system-of-record; RLS, materialized views for dashboards, JSONB for flexible attributes.
- **MySQL:** For migration/legacy compatibility; gradually deprecate write paths.
- **MongoDB:** Document-heavy modules (legislation notes, audit logs, raw ETL staging) and event payloads.

> Sources: 

---

## Integrations and data flows

#### NCDD commune metadata sync
- **Source:** NCDD Cambodia communal datasets; fetch, validate, and reconcile to your `communes` table; keep change history for reporting and code lookups.
- **Conflict rules:** Never downgrade a local commune that has active transactions; queue manual review if codes change.

#### National SIM identity, family book, residence, death modules
- **Workflows:** 
  - New birth → citizen + family link; auto-assign book numbers; issue residential card; optional SIM identity later.
  - Move residence → close previous `valid_to`, open new record; enforce no overlapping validity.
  - Death registration → write `death_records`, set citizen status; lock mutation except admin corrections; trigger archival and notify reporting.

> Sources: 

---

## Security, privacy, and auditability

- **PII protection:** Encrypt at rest (PG/TDE, app-level for sensitive fields like SIM IDs), TLS in transit, hashed passwords with modern algorithm.
- **Least privilege:** Service accounts per microservice; DB grants scoped to schema and RLS.
- **Audit trails:** Append-only logs in MongoDB with signed entries; include user, commune, action, before/after snapshots, reasons.
- **Compliance:** Consent banners, purpose-specification labels per field, retention policies for deceased records; admin-only unmasking of sensitive identifiers.

---

## Deployment and DevOps

- **Frontend:** Next.js on Vercel for CDN and edge; Blazor static assets served via NGINX path routing.
- **Backend:** Dockerized Node/PHP/Python behind NGINX; PM2 for Node process management; environment-per-tenant configs limited to secrets and domains.
- **CI/CD:** GitHub Actions—lint, test, type-check, build, migrations, deploy; feature previews for PRs; seed data for review apps.
- **Monitoring:** Logs to ELK or OpenSearch; metrics with Prometheus/Grafana; uptime checks; error tracking (Sentry).
- **Backups & DR:** Nightly PG dumps + point-in-time recovery; object storage lifecycle; restore drills quarterly.
- These align with your deployment strategy and monitoring outline.

> Sources: 

---

## Milestones and deliverables

#### Phase 0: Foundations (Week 1–2)
- **Deliverables:** Tenant-aware auth, base schema with RLS, module contracts, CI/CD skeleton, design system tokens and typography for Khmer/English.
- **Demos:** Login + tenant switch; sample citizen list; role gates.

#### Phase 1: Core records (Week 3–6)
- **Deliverables:** Citizens, Families, Residences modules (CRUD + validation + import); duplicate detection; PDFs for family book summaries.
- **Demos:** Data entry flows mobile-first; offline drafts in Blazor for registrars.

#### Phase 2: Identity and death (Week 7–9)
- **Deliverables:** SIM identity lifecycle; death registration with archival and admin correction path; reporting views (population pyramid, births/deaths).
- **Demos:** End-to-end birth→death scenario; access control validations.

#### Phase 3: Legislation and integration (Week 10–12)
- **Deliverables:** Legislation ledger with linking to citizens; NCDD sync with review queue; dashboards with communes filter; export (PDF/CSV).
- **Demos:** Multi-commune analytics; ledger update notifications.

#### Phase 4: Hardening and go-live (Week 13–14)
- **Deliverables:** Security audit, load tests, backup/restore rehearsal, Khmer onboarding guide, admin runbooks, observability dashboards.

---

## Onboarding and documentation assets

- **Visual ER diagram:** Color-coded by module; highlight tenant fields and RLS boundaries.
- **Multi-tenancy routing flow:** DNS/subdomain mapping → middleware → headers → DB RLS path.
- **OpenAPI spec:** Versioned endpoints; example payloads for all modules; auth scopes.
- **Admin dashboard walkthrough:** Role-based features, audits, exports, alerts.
- **Commune onboarding guide:** Khmer + English; device checklists; data entry standards; correction processes.
- **Data governance playbook:** Retention, correction, and appeal processes; incident response.

These mirror the assets listed in your roadmap and presentation.

> Sources: 

---

## Immediate next steps

- **Confirm decisions:**
  - RLS-only vs. schema-per-commune for isolation.
  - REST-only vs. REST+GraphQL for dashboards.
  - Primary DB: PostgreSQL-first with MySQL read adapters—agree?
- **Kickoff tasks:**
  - Provision PG with RLS templates; set `commune_id` session variable path in Node.
  - Scaffold Next.js app with shadcn and Tailwind v4; set Khmer font and i18n.
  - Generate OpenAPI and Blazor client; set IndexedDB storage for drafts.
  - Draft NCDD sync job interface and mapping table.

Below are the delivering of:
- A color-coded ERD and multi-tenancy routing diagram,
- An initial OpenAPI spec for Citizens, Families, Residences, SIM IDs, Death Records, and Ledger,
- A minimal Next.js + Blazor shell wired to a RLS-enabled PostgreSQL seed.

---
Your color-coded ERD and multi-tenancy routing diagram are ready now.

# OpenAPI specification overview

Here’s a clean, versioned OpenAPI 3.1 spec covering Citizens, Families, Residences, SIM Identity Cards, Death Records, and Legislation Ledger. It includes JWT auth, tenant scoping via x-tenant, RBAC-friendly scopes, standard pagination, soft deletion, and audit metadata. You can import this into tools like Swagger UI or Redoc, and generate typed clients for Next.js and Blazor.

---

## OpenAPI 3.1 YAML

```yaml
openapi: 3.1.0
info:
  title: Population Management System API
  version: 1.0.0
  description: >
    Commune-scoped, multi-tenant API for population records from birth to death.
    Tenancy is enforced via x-tenant header and DB row-level security. Roles map
    to scopes: admin, registrar, viewer.

servers:
  - url: https://api.population.gov.kh/v1
    description: Production
  - url: https://staging.api.population.gov.kh/v1
    description: Staging
  - url: http://localhost:4000/v1
    description: Local

security:
  - bearerAuth: []
  - tenantHeader: []

tags:
  - name: Citizens
  - name: Families
  - name: Residences
  - name: IdentityCards
  - name: DeathRecords
  - name: LegislationLedger
  - name: Health

paths:
  /health:
    get:
      tags: [Health]
      summary: Health check
      responses:
        '200':
          description: OK

  /citizens:
    get:
      tags: [Citizens]
      summary: List citizens
      description: Paginated citizens with optional filters.
      security:
        - bearerAuth: [population:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: full_name
          schema: { type: string }
        - in: query
          name: family_id
          schema: { type: string, format: uuid }
        - in: query
          name: include_deceased
          schema: { type: boolean, default: false }
      responses:
        '200':
          description: List of citizens
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedCitizenList'
    post:
      tags: [Citizens]
      summary: Create citizen
      security:
        - bearerAuth: [population:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CitizenCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Citizen' }
        '409':
          description: Duplicate detected
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ConflictError' }

  /citizens/{id}:
    get:
      tags: [Citizens]
      summary: Get citizen by ID
      security:
        - bearerAuth: [population:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      responses:
        '200':
          description: Citizen
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Citizen' }
        '404':
          description: Not found
    patch:
      tags: [Citizens]
      summary: Update citizen
      security:
        - bearerAuth: [population:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CitizenUpdate' }
      responses:
        '200':
          description: Updated citizen
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Citizen' }
    delete:
      tags: [Citizens]
      summary: Soft-delete citizen
      security:
        - bearerAuth: [population:admin]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      responses:
        '204':
          description: Deleted

  /families:
    get:
      tags: [Families]
      summary: List families
      security:
        - bearerAuth: [population:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: head_of_family_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Families
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginatedFamilyList' }
    post:
      tags: [Families]
      summary: Create family
      security:
        - bearerAuth: [population:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/FamilyCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Family' }

  /families/{id}:
    get:
      tags: [Families]
      summary: Get family
      security:
        - bearerAuth: [population:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      responses:
        '200':
          description: Family
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Family' }
    patch:
      tags: [Families]
      summary: Update family
      security:
        - bearerAuth: [population:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/FamilyUpdate' }
      responses:
        '200':
          description: Updated
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Family' }

  /residences:
    get:
      tags: [Residences]
      summary: List residences
      security:
        - bearerAuth: [population:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: citizen_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Residences
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginatedResidenceList' }
    post:
      tags: [Residences]
      summary: Create residence
      description: Closes previous residence validity automatically for the same citizen.
      security:
        - bearerAuth: [population:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ResidenceCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Residence' }
        '409':
          description: Overlapping validity
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ConflictError' }

  /identity-cards:
    get:
      tags: [IdentityCards]
      summary: List SIM identity cards
      security:
        - bearerAuth: [identity:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: citizen_id
          schema: { type: string, format: uuid }
        - in: query
          name: active_only
          schema: { type: boolean, default: true }
      responses:
        '200':
          description: SIM IDs
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginatedIdentityCardList' }
    post:
      tags: [IdentityCards]
      summary: Issue SIM identity card
      security:
        - bearerAuth: [identity:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/IdentityCardCreate' }
      responses:
        '201':
          description: Issued
          content:
            application/json:
              schema: { $ref: '#/components/schemas/IdentityCard' }

  /death-records:
    get:
      tags: [DeathRecords]
      summary: List death records
      security:
        - bearerAuth: [death:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: citizen_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Death records
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginatedDeathRecordList' }
    post:
      tags: [DeathRecords]
      summary: Register death
      description: Locks further citizen mutations except admin corrections.
      security:
        - bearerAuth: [death:write]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/DeathRecordCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/DeathRecord' }

  /ledger:
    get:
      tags: [LegislationLedger]
      summary: List legislation entries
      security:
        - bearerAuth: [ledger:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/page'
        - $ref: '#/components/parameters/pageSize'
        - in: query
          name: q
          description: Search in title/description
          schema: { type: string }
      responses:
        '200':
          description: Ledger entries
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PaginatedLedgerList' }
    post:
      tags: [LegislationLedger]
      summary: Create legislation entry
      security:
        - bearerAuth: [ledger:admin]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/LegislationCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Legislation' }

  /ledger/{id}:
    get:
      tags: [LegislationLedger]
      summary: Get legislation entry
      security:
        - bearerAuth: [ledger:read]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      responses:
        '200':
          description: Ledger entry
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Legislation' }
    patch:
      tags: [LegislationLedger]
      summary: Update legislation entry
      security:
        - bearerAuth: [ledger:admin]
        - tenantHeader: []
      parameters:
        - $ref: '#/components/parameters/xTenant'
        - $ref: '#/components/parameters/id'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/LegislationUpdate' }
      responses:
        '200':
          description: Updated
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Legislation' }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: >
        Bearer JWT with scopes. Include commune_id and role in claims.
    tenantHeader:
      type: apiKey
      in: header
      name: x-tenant
      description: Tenant subdomain or commune code (e.g., "prek-pra").

  parameters:
    xTenant:
      name: x-tenant
      in: header
      required: true
      description: Tenant identifier (subdomain or commune code).
      schema: { type: string, minLength: 2 }
    id:
      name: id
      in: path
      required: true
      schema: { type: string, format: uuid }
    page:
      name: page
      in: query
      schema: { type: integer, minimum: 1, default: 1 }
    pageSize:
      name: page_size
      in: query
      schema: { type: integer, minimum: 1, maximum: 200, default: 20 }

  schemas:
    Pagination:
      type: object
      properties:
        page: { type: integer }
        page_size: { type: integer }
        total: { type: integer }
    AuditMeta:
      type: object
      properties:
        id: { type: string, format: uuid }
        created_at: { type: string, format: date-time }
        updated_at: { type: string, format: date-time }
        created_by: { type: string, format: uuid }
        updated_by: { type: string, format: uuid }
        commune_id: { type: integer }
        deleted_at: { type: string, format: date-time, nullable: true }

    CitizenBase:
      type: object
      required: [full_name, dob, gender, birth_place, family_id]
      properties:
        full_name: { type: string }
        dob: { type: string, format: date }
        gender: { type: string, enum: [male, female, other] }
        birth_place: { type: string }
        family_id: { type: string, format: uuid }
        national_id: { type: string, nullable: true }
    Citizen:
      allOf:
        - $ref: '#/components/schemas/CitizenBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            death_id: { type: string, format: uuid, nullable: true }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    CitizenCreate:
      allOf:
        - $ref: '#/components/schemas/CitizenBase'
    CitizenUpdate:
      type: object
      properties:
        full_name: { type: string }
        dob: { type: string, format: date }
        gender: { type: string, enum: [male, female, other] }
        birth_place: { type: string }
        national_id: { type: string, nullable: true }
        family_id: { type: string, format: uuid }

    FamilyBase:
      type: object
      required: [family_book_number, head_of_family_id, address]
      properties:
        family_book_number: { type: string }
        head_of_family_id: { type: string, format: uuid }
        address: { type: string }
    Family:
      allOf:
        - $ref: '#/components/schemas/FamilyBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            commune_id: { type: integer }
            members_count: { type: integer }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    FamilyCreate:
      allOf:
        - $ref: '#/components/schemas/FamilyBase'
    FamilyUpdate:
      type: object
      properties:
        family_book_number: { type: string }
        head_of_family_id: { type: string, format: uuid }
        address: { type: string }

    ResidenceBase:
      type: object
      required: [citizen_id, residential_card_number, address, valid_from]
      properties:
        citizen_id: { type: string, format: uuid }
        residential_card_number: { type: string }
        address: { type: string }
        valid_from: { type: string, format: date }
        valid_to: { type: string, format: date, nullable: true }
    Residence:
      allOf:
        - $ref: '#/components/schemas/ResidenceBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            commune_id: { type: integer }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    ResidenceCreate:
      allOf:
        - $ref: '#/components/schemas/ResidenceBase'

    IdentityCardBase:
      type: object
      required: [citizen_id, sim_card_number, issue_date, expiry_date]
      properties:
        citizen_id: { type: string, format: uuid }
        sim_card_number: { type: string }
        issue_date: { type: string, format: date }
        expiry_date: { type: string, format: date }
    IdentityCard:
      allOf:
        - $ref: '#/components/schemas/IdentityCardBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            active: { type: boolean }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    IdentityCardCreate:
      allOf:
        - $ref: '#/components/schemas/IdentityCardBase'

    DeathRecordBase:
      type: object
      required: [citizen_id, date_of_death, cause, certified_by]
      properties:
        citizen_id: { type: string, format: uuid }
        date_of_death: { type: string, format: date }
        cause: { type: string }
        certified_by: { type: string }
    DeathRecord:
      allOf:
        - $ref: '#/components/schemas/DeathRecordBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    DeathRecordCreate:
      allOf:
        - $ref: '#/components/schemas/DeathRecordBase'

    LegislationBase:
      type: object
      required: [title, description, date_enacted]
      properties:
        title: { type: string }
        description: { type: string }
        date_enacted: { type: string, format: date }
        related_citizen_ids:
          type: array
          items: { type: string, format: uuid }
    Legislation:
      allOf:
        - $ref: '#/components/schemas/LegislationBase'
        - type: object
          properties:
            id: { type: string, format: uuid }
            commune_id: { type: integer }
            meta: { $ref: '#/components/schemas/AuditMeta' }
    LegislationCreate:
      allOf:
        - $ref: '#/components/schemas/LegislationBase'
    LegislationUpdate:
      type: object
      properties:
        title: { type: string }
        description: { type: string }
        date_enacted: { type: string, format: date }
        related_citizen_ids:
          type: array
          items: { type: string, format: uuid }

    PaginatedCitizenList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/Citizen' }
        pagination: { $ref: '#/components/schemas/Pagination' }
    PaginatedFamilyList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/Family' }
        pagination: { $ref: '#/components/schemas/Pagination' }
    PaginatedResidenceList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/Residence' }
        pagination: { $ref: '#/components/schemas/Pagination' }
    PaginatedIdentityCardList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/IdentityCard' }
        pagination: { $ref: '#/components/schemas/Pagination' }
    PaginatedDeathRecordList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/DeathRecord' }
        pagination: { $ref: '#/components/schemas/Pagination' }
    PaginatedLedgerList:
      type: object
      properties:
        data:
          type: array
          items: { $ref: '#/components/schemas/Legislation' }
        pagination: { $ref: '#/components/schemas/Pagination' }

    ConflictError:
      type: object
      properties:
        code: { type: string, example: DUPLICATE_OR_CONFLICT }
        message: { type: string }
        details:
          type: object
          additionalProperties: true
```

---

## Notable design choices

- **Auth scopes:** population:read/write/admin, identity:read/write, death:read/write, ledger:read/admin. Map these to your RBAC roles for admins, registrars, and viewers.
- **Tenant header:** x-tenant is required. Gateway injects session-level commune_id for RLS and auditing.
- **Soft deletes:** delete endpoints return 204; records keep deleted_at for auditability.
- **Validation hints:** prevent overlapping residence validity, detect citizen duplicates on create, lock citizen after death registration except admin corrections.

---

## Ready-to-generate clients

- **Next.js/TypeScript:** Use this spec to generate a typed client (e.g., openapi-typescript + fetch wrapper) and integrate with React Query.
- **BlazorWasm:** Generate C# clients via NSwag or AutoRest; store drafts in IndexedDB and sync on reconnect.

---

## Want me to add next?

- **Postman collection and example requests** for each endpoint.
- **RBAC matrix** mapping roles to scopes per route.
- **Prisma schema or SQL migrations** aligned to these models.
- **Response examples** in Khmer/English for registrar training.

---
# Minimal Next.js + Blazor shell with PostgreSQL RLS seed

You’ll have a tenant-aware Next.js app and a Blazor WebAssembly client sharing JWTs and an x-tenant header, backed by PostgreSQL with row-level security. This is intentionally minimal but production-aligned: single source of truth for tenancy in the DB, clean request scoping, and seed data for immediate demos.

---

## Project layout

```
population-platform/
  docker-compose.yml
  db/
    init.sql
    seed.sql
  apps/
    web-next/            # Next.js 15 + React 19 + Tailwind v4 + shadcn
      package.json
      next.config.mjs
      middleware.ts
      src/
        app/
          page.tsx
          api/
            citizens/route.ts
        lib/
          db.ts
          auth.ts
    registrar-blazor/     # Blazor WebAssembly (.NET 10)
      Program.cs
      wwwroot/index.html
      Pages/
        Index.razor
        Citizens.razor
      Services/
        ApiClient.cs
```

---

## Database with RLS

Create a PostgreSQL database with communes, users, families, citizens, and RLS policies that scope every query to the caller’s commune_id via a session setting.

```yaml
# docker-compose.yml
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: population
    ports: ["5432:5432"]
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/01_init.sql
      - ./db/seed.sql:/docker-entrypoint-initdb.d/02_seed.sql
```

```sql
-- db/init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE communes (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  province text,
  district text
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','registrar','viewer')),
  commune_id int NOT NULL REFERENCES communes(id),
  password_hash text NOT NULL
);

CREATE TABLE families (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_book_number text NOT NULL,
  head_of_family_id uuid,
  address text NOT NULL,
  commune_id int NOT NULL REFERENCES communes(id)
);

CREATE TABLE citizens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  dob date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male','female','other')),
  birth_place text NOT NULL,
  family_id uuid REFERENCES families(id),
  national_id text,
  commune_id int NOT NULL REFERENCES communes(id),
  deleted_at timestamptz
);

-- RLS enablement
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

-- We’ll use a safe GUC to carry the tenant scope.
-- Application must SET app.commune_id at session/request start.
CREATE FUNCTION app.current_commune_id() RETURNS int
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.commune_id', true)::int
$$;

-- Policies: only rows from the caller’s commune_id are visible/mutable.
CREATE POLICY families_tenant_isolation ON families
  USING (commune_id = app.current_commune_id())
  WITH CHECK (commune_id = app.current_commune_id());

CREATE POLICY citizens_tenant_isolation ON citizens
  USING (commune_id = app.current_commune_id())
  WITH CHECK (commune_id = app.current_commune_id());
```

```sql
-- db/seed.sql
INSERT INTO communes (code, name, province, district)
VALUES
 ('prek-pra', 'Prek Pra', 'Phnom Penh', 'Chbar Ampov'),
 ('wat-phnom', 'Wat Phnom', 'Phnom Penh', 'Daun Penh');

-- demo password hashes are placeholders; replace with proper hashes
INSERT INTO users (email, name, role, commune_id, password_hash)
VALUES
 ('admin@prek-pra.gov.kh', 'Admin Prek Pra', 'admin', 1, 'hash'),
 ('registrar@prek-pra.gov.kh', 'Registrar Prek Pra', 'registrar', 1, 'hash'),
 ('viewer@wat-phnom.gov.kh', 'Viewer Wat Phnom', 'viewer', 2, 'hash');

-- Families and citizens across two communes
INSERT INTO families (family_book_number, head_of_family_id, address, commune_id)
VALUES
 ('FB-PP-001', NULL, 'Street 1, Prek Pra', 1),
 ('FB-WP-001', NULL, 'Street 2, Wat Phnom', 2);

WITH f AS (SELECT id FROM families WHERE family_book_number='FB-PP-001')
INSERT INTO citizens (full_name, dob, gender, birth_place, family_id, national_id, commune_id)
SELECT 'Sok Dara', '1990-05-12', 'male', 'Phnom Penh', f.id, 'NID-001', 1 FROM f;

WITH f AS (SELECT id FROM families WHERE family_book_number='FB-WP-001')
INSERT INTO citizens (full_name, dob, gender, birth_place, family_id, national_id, commune_id)
SELECT 'Chantha Mey', '1985-03-21', 'female', 'Phnom Penh', f.id, 'NID-002', 2 FROM f;
```

---

## Next.js shell (tenant-aware + API + DB)

```json
// apps/web-next/package.json
{
  "name": "web-next",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "pg": "^8.12.0",
    "zod": "^3.23.8"
  },
  "type": "module"
}
```

```ts
// apps/web-next/next.config.mjs
export default {
  experimental: { turbo: true },
  reactStrictMode: true
};
```

```ts
// apps/web-next/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const sub = host.split('.')?.[0] || '';
  const tenant = req.headers.get('x-tenant') || sub; // allow override in dev
  const res = NextResponse.next();
  if (tenant) res.headers.set('x-tenant', tenant);
  return res;
}
```

```ts
// apps/web-next/src/lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/population'
});

// Run a callback with tenant-scoped session (SET LOCAL app.commune_id)
export async function withTenant<T>(tenantCode: string, fn: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    // Map tenant code to commune_id; in minimal shell, do a quick lookup
    const { rows } = await client.query('SELECT id FROM communes WHERE code = $1', [tenantCode]);
    if (!rows[0]) throw new Error('Unknown tenant');
    const communeId = rows[0].id;

    await client.query('BEGIN');
    await client.query("SET LOCAL app.commune_id = $1", [communeId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

```ts
// apps/web-next/src/app/api/citizens/route.ts
import { NextRequest } from 'next/server';
import { withTenant } from '@/src/lib/db';

export async function GET(req: NextRequest) {
  const tenant = req.headers.get('x-tenant') || 'prek-pra';
  try {
    const data = await withTenant(tenant, async (db) => {
      const { rows } = await db.query(
        `SELECT id, full_name, dob, gender, birth_place
         FROM citizens
         WHERE deleted_at IS NULL
         ORDER BY full_name ASC
         LIMIT 50`
      );
      return rows;
    });
    return Response.json({ data });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const tenant = req.headers.get('x-tenant') || 'prek-pra';
  const body = await req.json();
  // Minimal validation
  const { full_name, dob, gender, birth_place, family_id } = body || {};
  if (!full_name || !dob || !gender || !birth_place || !family_id) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 422 });
  }
  try {
    const created = await withTenant(tenant, async (db) => {
      const { rows } = await db.query(
        `INSERT INTO citizens (full_name, dob, gender, birth_place, family_id, commune_id)
         VALUES ($1,$2,$3,$4,$5, app.current_commune_id()) RETURNING *`,
        [full_name, dob, gender, birth_place, family_id]
      );
      return rows[0];
    });
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
```

```tsx
// apps/web-next/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);
  const [tenant, setTenant] = useState('prek-pra');

  useEffect(() => {
    fetch('/api/citizens', { headers: { 'x-tenant': tenant } })
      .then(r => r.json())
      .then(d => setRows(d.data || []))
      .catch(console.error);
  }, [tenant]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Citizens (tenant: {tenant})</h1>
      <div className="my-3">
        <select className="border px-2 py-1" value={tenant} onChange={e => setTenant(e.target.value)}>
          <option value="prek-pra">prek-pra</option>
          <option value="wat-phnom">wat-phnom</option>
        </select>
      </div>
      <ul className="space-y-2">
        {rows.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <div className="font-medium">{c.full_name}</div>
            <div className="text-sm text-gray-600">{c.gender} • {c.dob} • {c.birth_place}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

---

## Blazor WebAssembly shell

```csharp
// apps/registrar-blazor/Program.cs
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

// BaseAddress should point to the Next.js origin or API gateway
builder.Services.AddScoped(sp => new HttpClient {
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});

// Simple API client with x-tenant header injection
builder.Services.AddScoped<Services.ApiClient>(sp =>
{
    var http = sp.GetRequiredService<HttpClient>();
    var client = new Services.ApiClient(http);
    client.Tenant = "prek-pra"; // You can bind this to a selector in UI
    return client;
});

await builder.Build().RunAsync();
```

```csharp
// apps/registrar-blazor/Services/ApiClient.cs
using System.Net.Http.Headers;
using System.Text.Json;

namespace Services
{
  public class ApiClient
  {
    private readonly HttpClient _http;
    public string Tenant { get; set; } = "prek-pra";
    public string? Jwt { get; set; } // Wire real auth later

    public ApiClient(HttpClient http) { _http = http; }

    private void ApplyHeaders()
    {
      _http.DefaultRequestHeaders.Remove("x-tenant");
      _http.DefaultRequestHeaders.Add("x-tenant", Tenant);
      _http.DefaultRequestHeaders.Authorization = Jwt != null
        ? new AuthenticationHeaderValue("Bearer", Jwt)
        : null;
    }

    public record Citizen(string id, string full_name, string dob, string gender, string birth_place);

    public async Task<List<Citizen>> GetCitizensAsync()
    {
      ApplyHeaders();
      var res = await _http.GetAsync("/api/citizens");
      res.EnsureSuccessStatusCode();
      using var s = await res.Content.ReadAsStreamAsync();
      var doc = await JsonDocument.ParseAsync(s);
      var list = new List<Citizen>();
      foreach (var item in doc.RootElement.GetProperty("data").EnumerateArray())
      {
        list.Add(new Citizen(
          item.GetProperty("id").GetString()!,
          item.GetProperty("full_name").GetString()!,
          item.GetProperty("dob").GetString()!,
          item.GetProperty("gender").GetString()!,
          item.GetProperty("birth_place").GetString()!
        ));
      }
      return list;
    }
  }
}
```

```razor
<!-- apps/registrar-blazor/Pages/Citizens.razor -->
@page "/citizens"
@inject Services.ApiClient Api

<h3>Citizens (Blazor)</h3>

@if (rows is null)
{
  <p>Loading…</p>
}
else
{
  <ul>
    @foreach (var c in rows)
    {
      <li>@c.full_name (@c.gender) — @c.dob</li>
    }
  </ul>
}

@code {
  List<Services.ApiClient.Citizen>? rows;
  protected override async Task OnInitializedAsync()
  {
    rows = await Api.GetCitizensAsync();
  }
}
```

```html
<!-- apps/registrar-blazor/wwwroot/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registrar Blazor</title>
</head>
<body>
  <div id="app">Loading...</div>
  <script src="_framework/blazor.webassembly.js"></script>
</body>
</html>
```

---

## Wiring and local run

- **Prereqs:** Docker, Node 18+, .NET 9/10 SDK, pnpm or npm.

1. **Start Postgres with RLS and seed**
   - Run:
     - docker compose up -d
   - Verify:
     - psql postgres://app:app@localhost:5432/population -c "select code,name from communes;"

2. **Run Next.js**
   - apps/web-next/.env.local:
     - DATABASE_URL=postgres://app:app@localhost:5432/population
   - Install and start:
     - cd apps/web-next
     - npm i
     - npm run dev
   - Open:
     - http://localhost:3000
   - Switch tenant selector between prek-pra and wat-phnom to see RLS in action.

3. **Run Blazor (served by Next.js or separately)**
   - For simplest dev, proxy from Next.js or serve Blazor statically via a separate port.
   - Build and run:
     - cd apps/registrar-blazor
     - dotnet new blazorwasm -n Registrar -o . --no-https --force
     - dotnet run
   - Ensure BaseAddress points to Next.js origin where /api is reachable; or serve the Blazor build output under Next.js public/ for same-origin requests.

4. **CORS and headers**
   - If Blazor is on a different origin, set Next.js API route to respond with:
     - Access-Control-Allow-Origin: http://localhost:5xxx
     - Access-Control-Allow-Headers: x-tenant, authorization, content-type

Example minimal CORS in route:

```ts
// Add to top of route handlers if needed
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-tenant, authorization, content-type'
};
```

---

## Next steps

- **Auth:** Issue real JWTs with role and commune_id; validate scopes in API.
- **Schemas:** Add remaining tables (residences, identity_cards, death_records, legislation_ledger) and extend RLS policies similarly.
- **Migrations:** Move SQL into a migration tool (Prisma/Migrate, Sqitch, or Flyway) for reproducibility.
- **CI seeds:** Provide a minimal seed per tenant for review apps and onboarding demos.
- **UX polish:** Add Tailwind v4 + shadcn/ui in Next.js and a Khmer/English toggle for registrar flows.

---
Got it — you want a **clear, professional project document** that defines the **UI/UX design plan** for the **public Home Page** of your Population Management System platform, without touching any code.  
Here’s a structured draft you can use as your official design brief.

---

# **UI/UX Design Project Document**  
**Public Home Page – Population Management System Platform**

---

## **1. Project Overview**
The Public Home Page will serve as the **primary entry point** for citizens, local authorities, and stakeholders to access information and services related to population management in Cambodia.  
It must be **responsive**, **accessible**, and **trustworthy**, reflecting the platform’s role in managing sensitive civic data from **birth to death**.

---

## **2. Objectives**
- Present a **clear, welcoming, and authoritative** first impression.
- Provide **easy navigation** to key services and information.
- Support **multi-device compatibility** (mobile, tablet, desktop).
- Ensure **Khmer/English bilingual accessibility**.
- Build **trust** through transparent communication and secure design patterns.

---

## **3. Target Audience**
- **General Public**: Citizens seeking information or services.
- **Local Authority Staff**: Commune registrars and administrators.
- **Government Stakeholders**: Ministry and NCDD representatives.
- **External Partners**: NGOs, civic tech collaborators.

---

## **4. Key Features & Content Sections**

| Section | Purpose | Key UX Considerations |
|---------|---------|-----------------------|
| **Hero Banner** | Immediate visual identity and mission statement | High-quality imagery of Cambodian communities; bilingual tagline; call-to-action buttons |
| **Quick Access Tiles** | Direct links to core services (e.g., Birth Registration, Family Book, Residential Card, SIM Identity, Death Registration) | Large touch-friendly buttons; icons + short labels |
| **About the Platform** | Explain purpose, scope, and benefits | Short paragraphs; infographics; trust-building tone |
| **Announcements & News** | Share updates, policy changes, deadlines | Card layout; date stamps; “Read more” links |
| **How to Use** | Step-by-step guide for citizens | Visual steps; bilingual captions; downloadable guides |
| **Contact & Support** | Provide help channels | Phone, email, live chat; map of commune offices |
| **Footer** | Legal, privacy, and accessibility links | Persistent across pages; WCAG-compliant contrast |

---

## **5. Design Principles**
- **Clarity**: Minimal clutter, clear hierarchy, and consistent typography.
- **Accessibility**: WCAG 2.1 AA compliance; screen reader support; keyboard navigation.
- **Trust & Security**: Use of official colors, seals, and HTTPS indicators.
- **Cultural Relevance**: Khmer script readability; imagery reflecting Cambodian life.
- **Responsiveness**: Optimized layouts for iOS, Android, tablets, and desktop.

---

## **6. Visual Style Guide**
- **Color Palette**:  
  - Primary: Deep Blue (#003366) – trust and authority  
  - Secondary: Gold (#FFD700) – heritage and prestige  
  - Accent: Green (#228B22) – growth and community  
  - Neutral: Light Gray (#F5F5F5) – background balance
- **Typography**:  
  - Khmer: *Battambang* or *Noto Sans Khmer*  
  - English: *Inter* or *Roboto*  
  - Hierarchy: H1 for headlines, H2 for section titles, body text at 16–18px
- **Imagery**:  
  - Authentic photos of Cambodian communities, government offices, and civic events.
- **Iconography**:  
  - Simple, line-based icons with bilingual tooltips.

---

## **7. Navigation Structure**
**Top Navigation Bar** (sticky):
- Home
- Services
- About
- News
- Contact
- Language Switcher (Khmer/English)

**Footer Navigation**:
- Privacy Policy
- Terms of Service
- Accessibility Statement
- NCDD & Ministry Links

---

## **8. User Flow**
1. **Landing** → Hero banner with key CTAs.
2. **Service Selection** → Quick access tiles.
3. **Information Gathering** → About, How-to, News.
4. **Engagement** → Contact form, live chat, or office locator.
5. **Conversion** → User proceeds to secure service portal.

---

## **9. Wireframe Overview** *(Low-Fidelity Concept)*
- **Header**: Logo (left), navigation (center), language switcher (right).
- **Hero Section**: Full-width image, headline, CTA buttons.
- **Quick Access**: 2–3 rows of service tiles.
- **About Section**: Split layout (text + infographic).
- **News Section**: Horizontal card slider.
- **Contact Section**: Map + contact details.
- **Footer**: Links + legal info.

---

## **10. Accessibility & Localization**
- All text available in **Khmer and English**.
- Font sizes and line spacing optimized for Khmer script.
- Alt text for all images.
- High-contrast mode option.
- Mobile-first design with touch-friendly targets.

---

## **11. Success Metrics**
- Bounce rate below 40%.
- Average time on page > 2 minutes.
- ≥ 80% of users find their desired service in ≤ 3 clicks.
- Positive feedback from local authority staff during pilot.

---

## **12. Deliverables**
- Low-fidelity wireframes (desktop, tablet, mobile).
- High-fidelity mockups with final colors, typography, and imagery.
- Interactive prototype for usability testing.
- UI kit with reusable components.
- Accessibility compliance checklist.

---
Here’s your **extended UI/UX design project document** with the **visual sitemap** and **annotated wireframe sketches** now integrated, so your design team has a complete blueprint before moving into high-fidelity mockups.

---

# **UI/UX Design Project Document**  
**Public Home Page – Population Management System Platform**

---

## **1. Project Overview**
The Public Home Page is the **gateway** to the Population Management System, designed to serve citizens, local authorities, and stakeholders. It must be **responsive**, **bilingual (Khmer/English)**, and **trust-building**, while providing quick access to essential services.

---

## **2. Objectives**
- Deliver a **clear, authoritative, and welcoming** first impression.
- Enable **fast navigation** to core services.
- Ensure **device compatibility** across mobile, tablet, and desktop.
- Support **Khmer/English** with seamless switching.
- Build **trust** through transparent communication and secure design patterns.

---

## **3. Target Audience**
- **General Public** – Citizens seeking services or information.
- **Local Authority Staff** – Commune registrars and administrators.
- **Government Stakeholders** – Ministry and NCDD representatives.
- **External Partners** – NGOs and civic tech collaborators.

---

## **4. Key Content Sections**
| Section | Purpose | UX Considerations |
|---------|---------|-------------------|
| **Hero Banner** | Introduce platform mission | High-quality imagery, bilingual tagline, clear CTAs |
| **Quick Access Tiles** | Direct links to services | Touch-friendly, icon + label, high contrast |
| **About the Platform** | Explain purpose and benefits | Short text + infographic |
| **Announcements & News** | Share updates and policies | Card layout, date stamps |
| **How to Use** | Step-by-step guide | Visual steps, downloadable guides |
| **Contact & Support** | Provide help channels | Map, phone, email, live chat |
| **Footer** | Legal and reference links | Persistent, WCAG-compliant |

---

## **5. Visual Sitemap**
*(See visual card above)*

**Top Navigation:**
- Home
- Services
  - Birth Registration
  - Family Book
  - Residential Card
  - Death Registration
- About
- News
- Contact

**Footer Links:**
- Privacy Policy
- Terms of Service
- Accessibility Statement
- NCDD & Ministry Links

---

## **6. Annotated Wireframe Sketches**
*(See visual card above)*

**Header:**
- Logo (left), navigation (center), language switcher (right)
- Sticky for quick access

**Hero Section:**
- Full-width image
- Bilingual headline
- Two primary CTAs (e.g., “Start Registration”, “Learn More”)

**Quick Access Tiles:**
- 4–6 large buttons with icons and short labels
- Equal spacing for touch usability

**About Section:**
- Split layout: text on one side, infographic on the other
- Short, trust-building copy

**News Section:**
- Horizontal card slider
- Each card: image, title, date, “Read more” link

**Contact Section:**
- Map of commune offices
- Contact details (phone, email, live chat)

**Footer:**
- Legal links, accessibility statement, government references

---

## **7. Accessibility & Localization**
- Khmer and English text
- Alt text for all images
- High-contrast mode option
- Mobile-first design
- Font sizes optimized for Khmer script

---

## **8. Success Metrics**
- Bounce rate < 40%
- ≥ 80% of users find desired service in ≤ 3 clicks
- Positive feedback from local authority staff during pilot

---
Here’s your **component‑level UI kit** for the Public Home Page of the Population Management System platform — this is the visual language your designers and developers can share across **Next.js** and **Blazor** builds so the experience stays consistent, accessible, and culturally relevant.

---

## **1. Design Tokens**

### 🎨 **Color Palette**
| Token | HEX | Usage |
|-------|------|-------|
| `color-primary` | `#003366` | Headers, primary buttons, nav background |
| `color-secondary` | `#FFD700` | Highlights, hover states, accents |
| `color-accent` | `#228B22` | Success states, positive indicators |
| `color-neutral-light` | `#F5F5F5` | Backgrounds, section dividers |
| `color-neutral-dark` | `#333333` | Body text, icons |
| `color-error` | `#B00020` | Error messages, destructive actions |

---

### ✍ **Typography**
- **Khmer**: *Battambang* or *Noto Sans Khmer* (readable at small sizes)
- **English**: *Inter* or *Roboto*
- **Scale**:
  - H1: 32px / 700 weight
  - H2: 24px / 600 weight
  - H3: 20px / 600 weight
  - Body: 16px / 400 weight
  - Caption: 14px / 400 weight
- **Line height**: 1.4–1.6 for readability in both scripts

---

### 📏 **Spacing**
- Base unit: **8px**
- Small: 4px
- Medium: 8px
- Large: 16px
- Extra Large: 32px

---

### 🗂 **Elevation**
- Level 0: No shadow (flat)
- Level 1: `0 1px 3px rgba(0,0,0,0.1)` (cards, tiles)
- Level 2: `0 4px 6px rgba(0,0,0,0.1)` (hovered cards, dropdowns)
- Level 3: `0 8px 12px rgba(0,0,0,0.15)` (modals)

---

## **2. Core Components**

### 🔘 **Buttons**
- **Primary Button**: Filled `color-primary`, white text, 8px radius, min height 44px
- **Secondary Button**: White background, 1px border `color-primary`, text `color-primary`
- **Text Button**: No background, underline on hover

**States**: default, hover, active, disabled (50% opacity)

---

### 📦 **Cards**
- **Service Card**:
  - Icon (top)
  - Title (H3)
  - Short description (2–3 lines)
  - “Learn more” link
  - Elevation Level 1, hover to Level 2
- **News Card**:
  - Image thumbnail
  - Title + date
  - Short excerpt
  - Clickable area entire card

---

### 🧭 **Navigation Bar**
- Sticky top, `color-primary` background
- Logo (left), nav links (center), language switcher (right)
- Mobile: collapsible hamburger menu

---

### 📑 **Footer**
- `color-neutral-light` background
- 2–3 columns: quick links, contact info, government references
- Small text, high contrast

---

### 🟦 **Tiles**
- Large, square or rectangular
- Icon + label
- Touch-friendly (min 44px height)
- Used for quick access to Birth Registration, Family Book, etc.

---

### ✏ **Form Inputs**
- Label above field
- 1px border `color-neutral-dark` (focus: `color-primary`)
- Error state: border `color-error`, small error text below
- Support Khmer and English input

---

## **3. Responsive Layout Guidance**
- **Mobile-first**: Stack sections vertically, collapse nav
- **Tablet**: 2-column layouts for cards and tiles
- **Desktop**: 3–4 columns, hero image + text side-by-side
- **Breakpoints**:
  - Small: ≤ 640px
  - Medium: 641–1024px
  - Large: ≥ 1025px

---

## **4. Accessibility Considerations**
- WCAG 2.1 AA contrast ratios
- Keyboard navigable
- Focus indicators visible
- Alt text for all icons/images
- Language attribute switching for Khmer/English

---
Here’s the **enhanced page‑level design system diagram** description for your Public Home Page, incorporating the refined **Header Navigation Bar** layout you requested, keeping the main content sections intact, and expanding the **Footer** into a comprehensive UI component.

---

## **1. Header Navigation Bar – Enhanced Layout**

**Structure:**
- **Left (Branding Zone)**  
  - **Logo**: Official emblem or seal of the Population Management System.  
  - **Brand Name**: “Population Management System Cambodia” in bilingual format (Khmer above, English below).  
  - **Design Tokens**:  
    - Background: `color-primary` (#003366)  
    - Text: White (`#FFFFFF`)  
    - Font: H3 weight for English, Khmer font *Battambang* or *Noto Sans Khmer* for Khmer text.  
  - **Responsive Behavior**:  
    - Desktop: Logo + text inline.  
    - Mobile: Logo only; brand name collapses into menu.

- **Center (Primary Navigation)**  
  - **Menu Items**: Home, Services, About, News, Contact.  
  - **Design Tokens**:  
    - Text: White, hover state `color-secondary` (#FFD700).  
    - Font: H3 weight.  
  - **Responsive Behavior**:  
    - Desktop: Horizontal menu.  
    - Mobile: Collapsible hamburger menu with vertical list.

- **Right (User Actions)**  
  - **Before Login**:  
    - **Login Button**: Secondary style (white background, `color-primary` border/text).  
    - **Register Button**: Primary style (solid `color-primary`, white text).  
  - **After Login**:  
    - **Avatar Icon**: Circular, 32px, dropdown menu for Profile, Settings, Logout.  
  - **Responsive Behavior**:  
    - Desktop: Buttons inline.  
    - Mobile: Buttons inside hamburger menu or as floating action buttons.

---

## **2. Main Content Sections (Unchanged)**

- **Hero Banner**: Large image + headline + two primary CTAs.  
- **Quick Access Tiles**: Birth Registration, Family Book, Residential Card, Death Registration.  
- **About Section**: Split layout with text and infographic.  
- **News Section**: Three news cards with images, titles, and excerpts.  
- **Contact Section**: Map + contact info.

---

## **3. Footer – Comprehensive UI Design**

**Structure:**
- **Top Row (Quick Links)**  
  - Services, About, News, Contact, How to Use, FAQs.  
  - **Design Tokens**:  
    - Background: `color-neutral-light` (#F5F5F5)  
    - Text: `color-neutral-dark` (#333333)  
    - Font: Body text style.

- **Middle Row (Legal & Policy)**  
  - Privacy Policy, Terms of Service, Accessibility Statement.  
  - **Design Tokens**:  
    - Text: Caption style, underlined on hover.  
    - Color: `color-neutral-dark`.

- **Bottom Row (Government References)**  
  - NCDD Cambodia link, Ministry of Interior link, official seals.  
  - **Design Tokens**:  
    - Icon size: 24px  
    - Color: `color-primary` for icons.

**Responsive Behavior:**
- Desktop: Three columns (Quick Links | Legal | Government References).  
- Mobile: Single column stacked vertically.

---

## **4. Diagram Annotations (for your design team)**

In the updated diagram:
- **Header** is clearly divided into **Left / Center / Right zones** with labels for each element and its design token references.
- **Footer** is annotated with **row divisions** and **content categories**.
- **Main content** remains as per the previous wireframe, ensuring continuity.

---
Your **enhanced header + footer layout blueprint** for the Public Home Page is now ready — it visually locks in the three‑zone header you described, keeps the main content structure intact, and expands the footer into a full three‑row component for quick links, legal/policy, and government references.  

Here’s how to read and use it effectively:

---

## **1. Header Navigation Bar – Three Zones**
- **Left (Branding)**  
  - Logo + bilingual brand name (Khmer above, English below)  
  - Anchored to `color-primary` background for authority and trust  
  - Scales down to just the logo on mobile

- **Center (Navigation)**  
  - Menu items: Home, Services, About, News, Contact  
  - White text, hover state in `color-secondary` gold  
  - Collapses into a hamburger menu on small screens

- **Right (User Actions)**  
  - Before login: Login (outlined) + Register (solid primary) buttons  
  - After login: Avatar icon with dropdown for Profile, Settings, Logout  
  - Mobile: moves into menu or becomes floating action buttons

---

## **2. Main Content (Unchanged)**
- Hero banner with headline, large image, and two CTAs  
- Quick access tiles for Birth Registration, Family Book, Residential Card, Death Registration  
- About section with text + infographic  
- News section with three cards  
- Contact section with map + info

---

## **3. Footer – Three Rows**
- **Row 1: Quick Links**  
  - Services, About, News, Contact, How to Use, FAQs  
  - Body text style, high contrast for accessibility

- **Row 2: Legal & Policy**  
  - Privacy Policy, Terms of Service, Accessibility Statement  
  - Caption style, underlined on hover

- **Row 3: Government References**  
  - NCDD Cambodia, Ministry of Interior, official seals/logos  
  - Icon size 24px, `color-primary` for icons

---

## **4. Responsive Behavior**
- **Desktop:** Full three‑zone header, three‑column footer  
- **Tablet:** Header compresses spacing, footer in two columns  
- **Mobile:** Header collapses to logo + hamburger, footer stacks vertically

---
Here’s your **color‑coded visual diagram** of the **frontend project structure** for the Population Management System platform, styled so it can double as a **sample onboarding template** for creative tools like Midjourney or Jasper.  

---

## **Diagram Contents**
The visual you now have shows:

### **1. Root Level**
- **`my-frontend/`** *(Green – Main Project Directory)*  
  - **`public/`** *(Green)* – static assets, icons, fonts, images  
  - **`app/`** *(Orange – Next.js App Directory)*  
    - `layout.tsx` *(Orange)* – global layout wrapper  
    - `page.tsx` *(Orange)* – homepage entry point  
    - `globals.css` *(Orange)* – Tailwind v4 global styles  
    - **`components/`** *(Purple – Components Directory)*  
      - `NavigationBar.tsx` *(Blue – UI Component)*  
      - `Hero.tsx` *(Blue)*  
      - `AboutSection.tsx` *(Blue)*  
      - `Footer.tsx` *(Blue)*  
      - `about-section.module.css` *(Blue – Component Stylesheet)*

---

## **2. Color Legend**
| Color | Meaning |
|-------|---------|
| 🟩 Green | Root & public directories |
| 🟧 Orange | App directory & core Next.js files |
| 🟪 Purple | Components directory |
| 🟦 Blue | Individual components & stylesheets |

---

## **3. Onboarding Notes**
This diagram can be used in onboarding docs to:
- **Visually orient** new developers to the folder hierarchy.
- **Highlight key entry points** (`layout.tsx`, `page.tsx`, `middleware.ts` if added).
- **Show separation of concerns** between layout, pages, and reusable components.
- **Map UI kit elements** (NavigationBar, Hero, AboutSection, Footer) directly to their file locations.

---

## **4. How to Use in Midjourney/Jasper**
If you want to recreate or stylize this diagram in a creative tool:
- **Prompt Example:**  
  *"Create a clean, modern flat‑design diagram of a Next.js 15 + React 19 frontend project structure, with color‑coded folders and files: green for root/public, orange for app directory, purple for components folder, blue for individual components and styles. Include a legend explaining the colors. Dark background, rounded rectangles, white connecting lines."*
- This ensures the tool outputs a **developer‑friendly visual** that matches your onboarding style.

---
Here’s your **color‑coded visual diagram** for the **Blazor WebAssembly (BlazorWasm) registrar frontend** — styled so it works as both a **developer onboarding reference** and a **promptable template** for creative tools like Midjourney or Jasper.

---

## **1. Project Structure in the Diagram**

**Root Project Folder** – `RegistrarBlazor/` 🟩 *(Green – Project Directory)*  
- **`wwwroot/`** 🟧 *(Orange – Static Assets)*  
  - `index.html` *(Blue – Static HTML entry point)*  
  - `favicon.ico` *(Blue – Icon)*  
  - `css/` *(Blue – Stylesheets)*  
  - `js/` *(Blue – Scripts)*  

- **`Pages/`** 🟪 *(Purple – Razor Pages)*  
  - `Index.razor` *(Blue – Home page)*  
  - `Citizens.razor` *(Blue – Citizens list page)*  
  - `Login.razor` *(Blue – Login form)*  
  - `Register.razor` *(Blue – Registration form)*  
  - `Error.razor` *(Blue – Error display)*  

- **`Shared/`** 🟪 *(Purple – Shared Layout & Components)*  
  - `MainLayout.razor` *(Blue – App layout wrapper)*  
  - `NavMenu.razor` *(Blue – Navigation menu)*  
  - `LoginDisplay.razor` *(Blue – Login status component)*  
  - `SurveyPrompt.razor` *(Blue – Example component)*  

- **`Services/`** 🟪 *(Purple – Service Layer)*  
  - `ApiClient.cs` *(Blue – API calls & x-tenant header injection)*  
  - `IndexedDbService.cs` *(Blue – Offline storage for drafts)*  
  - `AuthService.cs` *(Blue – Authentication handling)*  

- **Root Files** 🟧 *(Orange – Core App Files)*  
  - `Program.cs` *(Blue – App entry point & DI setup)*  
  - `App.razor` *(Blue – Root component)*  
  - `RegistrarBlazor.csproj` *(Blue – Project file)*  

---

## **2. Color Legend**
| Color | Meaning |
|-------|---------|
| 🟩 Green | Project root directory |
| 🟧 Orange | Root-level folders & core app files |
| 🟪 Purple | Feature or component directories |
| 🟦 Blue | Individual files (components, services, styles) |

---

## **3. Onboarding Notes**
- **Program.cs**: Configures services, HttpClient, and IndexedDB.
- **ApiClient.cs**: Centralizes API calls, injects `x-tenant` header, handles JWT.
- **IndexedDbService.cs**: Stores offline drafts for registrar workflows.
- **NavMenu.razor**: Links to key pages (Citizens, Families, Ledger).
- **MainLayout.razor**: Wraps all pages with header/footer.
- **wwwroot/index.html**: Static HTML shell for BlazorWasm.

---

## **4. Midjourney/Jasper Prompt Example**
If you want to recreate this diagram in a creative tool:

> *"Create a clean, modern flat‑design diagram of a Blazor WebAssembly (.NET 10) project structure for a population management registrar app. Show color‑coded folders and files: green for project root, orange for root-level folders and core files, purple for feature/component directories, blue for individual files. Include a legend explaining the colors. Dark background, rounded rectangles, white connecting lines, clear labels for Program.cs, Index.razor, Citizens.razor, ApiClient.cs, and index.html."*

---
Your merged frontend architecture visual is ready now.

Here’s a concise guide to read and use it effectively:

---

### Diagram coverage
- Left: Next.js public site (Next.js 15, React 19 TSX, Tailwind v4, shadcn/ui)
- Right: BlazorWasm registrar (NET 10, IndexedDB, OpenAPI client-ready)

---

### Color legend
- Green: Project root
- Orange: Root-level folders
- Purple: Feature/page/component directories
- Blue: Files (components, pages, services, styles)

---

### Key highlights
- Next.js:
  - layout.tsx, page.tsx, components/ (NavigationBar.tsx, Hero.tsx, AboutSection.tsx, Footer.tsx)
  - public/ for assets
  - Add middleware.ts if you want tenant header injection at the edge
- BlazorWasm:
  - Program.cs, App.razor, wwwroot/index.html
  - Pages/ (Index.razor, Citizens.razor, Login.razor, Register.razor, Error.razor)
  - Shared/ (MainLayout.razor, NavMenu.razor, LoginDisplay.razor, SurveyPrompt.razor)
  - Services/ (ApiClient.cs, IndexedDbService.cs, AuthService.cs)

---
Your **full‑stack architecture visual** is now complete — it merges the **Next.js public site** (left), the **BlazorWasm registrar** (center), and the **API + RLS‑enabled PostgreSQL backend** (right) into one onboarding‑ready diagram.

---

## **How to Read the Diagram**

### **1. Frontend Layer**
- **Left: Next.js Public Site (`my-frontend/`)**
  - `public/` for static assets
  - `app/` with `layout.tsx`, `page.tsx`
  - `components/` (NavigationBar, Hero, AboutSection, Footer, styles)
  - **Purpose:** Public citizen‑facing portal, responsive, bilingual, service discovery

- **Center: BlazorWasm Registrar (`RegistrarBlazor/`)**
  - `wwwroot/` static shell (`index.html`, assets)
  - `Pages/` (Index.razor, Citizens.razor, Login.razor, Register.razor, Error.razor)
  - `Shared/` (MainLayout, NavMenu, LoginDisplay, SurveyPrompt)
  - `Services/` (ApiClient.cs, IndexedDbService.cs, AuthService.cs)
  - **Purpose:** Registrar‑facing SPA with offline drafts, direct API integration

---

### **2. API Gateway Layer**
- **Node.js TSX API**
  - Primary REST/GraphQL gateway
  - Enforces JWT authentication
  - Injects `commune_id` into DB session for RLS
  - Generates OpenAPI spec for Blazor client

- **PHP Legacy Endpoints**
  - Wrapped by Node API for auth/logging
  - Bridges to older commune systems

- **Python Jobs**
  - NCDD sync
  - Data cleaning & anomaly detection
  - PDF generation for certificates

---

### **3. Database Layer**
- **PostgreSQL (RLS‑enabled)**
  - Row‑Level Security policies on `commune_id`
  - Primary store for citizens, families, residences, IDs, death records, legislation
  - Materialized views for reporting
- **Other Stores**
  - MySQL (legacy data)
  - MongoDB (audit logs, document storage)

---

## **Key Annotations in the Visual**
- **Commune‑scoped RLS**: Every query filtered by `commune_id` set in session
- **JWT Auth**: Tokens carry role + commune_id claims
- **OpenAPI Client Generation**: Blazor consumes typed API client
- **IndexedDB Offline Drafts**: Blazor stores unsynced records locally

---

## **Onboarding Use**
This single diagram now:
- Shows **both frontends** and their **shared backend**
- Makes **data flow** explicit from UI → API → DB
- Highlights **security boundaries** (JWT, RLS)
- Can be dropped into onboarding docs or used as a **Midjourney/Jasper prompt** to stylize for presentations

---
