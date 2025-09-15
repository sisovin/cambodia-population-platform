# **ROADMAP**: building a **Population Management System Platform**

## 🏛️ Population Management System  
**Version:** 1.0  
**Owner:** Sisovin  
**Region:** Cambodia (Commune-Level Deployment)  
**Purpose:** A modern, multi-tenancy civic platform for managing population data from birth to death, integrated with local legislation and national identity systems.

---

##* 📌 Objectives

This system is designed to empower local authorities and AI Assistant the guidance to support a data entry person to prevent mistakes and risks management  with a secure, scalable, and culturally relevant digital platform for managing population records. It supports lifecycle tracking (birth to death), legal documentation (family books, residential cards, SIM identity), and integrates with Cambodia’s ** [NCDD communal database] (https://data.opendevelopmentcambodia.net/dataset/commune-database-of-cambodia-commune-level-2011)**.

---

## 🧰 Tech Stack Overview

| Layer        | Technology                                                                 |
|--------------|----------------------------------------------------------------------------|
| **Frontend** | Next.js 15.5.3, React 19 TSX, Shadcn UI, Tailwind CSS v4, and Blazor .Net WebAssembly   |
| **Backend**  | Node.js TSX (API), PHP 4.x Native (legacy), Python 3.12.7 (data ops)       |
| **Database** | MySQL (transactional), PostgreSQL (relational), MongoDB (document-based)   |
| **Infra**    | Vercel (frontend), Docker + NGINX + PM2 (backend), GitHub Actions (CI/CD)  |
| **Auth**     | JWT or NextAuth with role-based access control                             |

---

## 🧩 Key Modules

### 1. **Legislation Ledger**
- Tracks communal laws, amendments, and legal events.
- Linked to citizens and communes.

### 2. **Family Book**
- Household-level grouping.
- Head of family, dependents, and shared address.

### 3. **Residential Card**
- Tracks residency status and movement.
- Commune-specific address validation.

### 4. **National SIM Identity**
- Digital identity card metadata.
- Issue/expiry tracking and linkage to citizen records.

### 5. **Death Registration**
- Records cause, date, and certifying authority.
- Triggers archival and reporting workflows.

### 6. **NCDD Commune Integration**
- Syncs commune metadata from [NCDD Cambodia](http://ncdd.gov.kh).
- Enables localized deployment and reporting.

---

## 🗂️ Folder Structure (Frontend)

```plaintext
/src
  /app
    /tenants         → page.tsx
    /registry        → page.tsx
    /dashboard       → page.tsx
    /api             → route.tsx
  /components
    /ui              → button.tsx, input.tsx
    /charts          → chart.tsx
  /lib
    /api             → api.ts
    /auth            → auth.ts
  /styles
    tailwind.config.ts
```

---

## 🗂️ Folder Structure (Backend - Node.js)

```plaintext
/src
  /routes           → tenants.tsx, registry.tsx, dashboard.tsx
  /controllers      → tenantsController.tsx, registryController.tsx
  /services         → apiService.ts, authService.ts
  /middleware       → auth.ts
  /lib              → db.ts
/prisma             → schema.prisma
/types              → index.d.ts
/utils              → fileUtils.ts
```

---

## 🗂️ Folder Structure (Backend - PHP)

```plaintext
/api                → tenants.php, registry.php, dashboard.php, auth.php
/includes           → TenantsController.php, RegistryController.php, db.php
/utils              → fileUtils.php
```

---

## 🗂️ Folder Structure (Backend - Python)

```plaintext
/app
  /routes           → tenants.py, registry.py, dashboard.py, auth.py
  /models           → __init__.py, person.py
  /services         → api_service.py, auth_service.py
  /utils            → file_utils.py
/config             → config.py
/migrations         → __init__.py
/tests              → test_main.py
```

---

## 🧬 Database Schema Overview

### `citizens`
- `id`, `full_name`, `dob`, `gender`, `birth_place`, `family_id`, `commune_id`, `national_id`, `residence_id`, `death_id`

### `families`
- `id`, `family_book_number`, `head_of_family_id`, `commune_id`, `address`

### `residences`
- `id`, `citizen_id`, `residential_card_number`, `commune_id`, `address`, `valid_from`, `valid_to`

### `identity_cards`
- `id`, `citizen_id`, `sim_card_number`, `issue_date`, `expiry_date`

### `death_records`
- `id`, `citizen_id`, `date_of_death`, `cause`, `certified_by`

### `legislation_ledger`
- `id`, `commune_id`, `title`, `description`, `date_enacted`, `related_citizen_ids[]`

### `communes`
- `id`, `name`, `code`, `province`, `district`, `population`, `area_km2`

### `users`
- `id`, `name`, `email`, `role`, `commune_id`, `password_hash`

---

## 🔐 Multi-Tenancy & Access Control

- Each `user` is scoped to a `commune_id`
- Role-based access: `admin`, `registrar`, `viewer`
- Data isolation via row-level security or schema separation

---

## 📊 Reporting & Analytics

- Population pyramids, migration trends, birth/death rates
- Exportable formats: PDF, CSV
- Real-time dashboards powered by PostgreSQL views or MongoDB aggregations

---

## 🔄 Integration Points

- NCDD commune metadata sync
- Legacy PHP endpoints for archival systems
- Python batch jobs for anomaly detection and data cleaning

---

## 🧭 Deployment Strategy

- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Dockerized services with NGINX reverse proxy
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: PM2, Logrotate, and optional Prometheus/Grafana

---

## 📥 Onboarding Assets (To Be Created)

- Visual ER diagram of database schema  
- Multi-tenancy routing flow  
- API documentation (OpenAPI spec)  
- Admin dashboard walkthrough  
- Commune-level onboarding guide (Khmer + English)

---
