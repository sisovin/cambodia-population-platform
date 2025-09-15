# **UI/UX Design Backend Project Document**  
**Backend Systems – Population Management Platform**

---

## **1. Project Overview**
The backend layer of the Population Management Platform is the **operational heart** of the system. While backend services are often invisible to end‑users, their **UI/UX design** is critical for:
- **Developer Experience (DX)** – making APIs, admin consoles, and logs intuitive to navigate.
- **Registrar & Admin Interfaces** – ensuring non‑technical staff can manage data securely and efficiently.
- **Cross‑Team Collaboration** – enabling smooth handoffs between Node.js, PHP, Python, and .NET teams.

This document defines the **visual, interaction, and usability standards** for backend‑facing UIs, admin dashboards, and API documentation portals — ensuring **consistency, accessibility, and maintainability** across all stacks.

---

## **2. Objectives**
- **Unify** backend admin and API interfaces across four tech stacks.
- **Simplify** workflows for developers, registrars, and system admins.
- **Visualize** system health, logs, and metrics in a clear, actionable way.
- **Secure** sensitive operations with clear role‑based access cues.
- **Document** APIs and services in a human‑friendly, searchable format.

---

## **3. Target Users**
- **Backend Developers** – building and maintaining services.
- **System Administrators** – monitoring uptime, logs, and security.
- **Registrars & Data Officers** – using admin tools for population data.
- **Integration Partners** – consuming APIs via documented endpoints.

---

## **4. Backend UI Components**
| Component | Purpose | UX Considerations |
|-----------|---------|-------------------|
| **Admin Dashboard** | Central hub for backend operations | Modular cards for logs, API status, DB health |
| **API Documentation Portal** | Developer‑facing API reference | Searchable, code‑sample friendly, bilingual |
| **Service Health Monitor** | Real‑time status of services | Color‑coded indicators (green/yellow/red) |
| **Log Viewer** | Searchable, filterable logs | Date/time filters, severity tags |
| **User & Role Manager** | Manage backend access | Clear role labels, confirmation prompts |
| **Config Editor** | Adjust environment settings | Inline validation, rollback option |

---

## **5. Visual Style Guide**
- **Color Palette**:  
  - Primary: Deep Blue `#003366` – trust & authority  
  - Secondary: Gold `#FFD700` – highlights & warnings  
  - Success: Green `#228B22` – healthy status  
  - Error: Red `#B00020` – critical alerts  
  - Neutral: Light Gray `#F5F5F5` – backgrounds
- **Typography**:  
  - *Inter* or *Roboto Mono* for code blocks  
  - Clear hierarchy: H1 for section titles, H2 for module headers, monospace for API paths
- **Iconography**:  
  - Simple, line‑based icons for services, logs, users, and settings
- **Layout**:  
  - Sidebar navigation for modules  
  - Main content area with responsive grid

---

## **6. Stack‑Specific UI/UX Notes**

### **Node.js TSX Backend**
- **Admin Console**: Built with React Admin or similar, matching frontend design tokens.
- **API Docs**: Auto‑generated from OpenAPI spec, styled with platform colors.
- **Developer UX**: Clear error messages, interactive API test panel.

### **PHP 4.x Native Backend**
- **Legacy Admin Panel**: Modernized CSS for readability.
- **Navigation**: Breadcrumbs for deep module paths.
- **Forms**: Larger input fields, inline validation.

### **Python 3.12.7 Backend**
- **Data Processing Dashboard**: Job queue status, retry controls.
- **Log Viewer**: Filter by job type, error level.
- **Script Runner UI**: Trigger scripts with parameter inputs.

### **BlazorServer API .NET 10**
- **API Management UI**: Endpoint list, request/response preview.
- **Role Manager**: Drag‑and‑drop role assignment.
- **Service Monitor**: Real‑time SignalR updates for uptime.

---

## **7. Interaction Patterns**
- **Consistent Navigation**: Left sidebar for modules, top bar for global actions.
- **Feedback Loops**: Success/error toasts, inline validation.
- **Security Cues**: Lock icons for restricted modules, confirmation modals for destructive actions.
- **Responsive Design**: Works on desktop and tablet for on‑site admins.

---

## **8. Accessibility & Localization**
- WCAG 2.1 AA compliance.
- Khmer/English toggle in all backend UIs.
- Keyboard shortcuts for power users.
- High‑contrast mode for low‑light environments.

---

## **9. Deliverables**
- High‑fidelity mockups for each backend stack’s UI.
- Interactive prototypes for admin dashboards.
- Unified design tokens for all stacks.
- API documentation style guide.
- Accessibility compliance checklist.

---

## **10. Success Metrics**
- Reduced onboarding time for new backend developers.
- Faster task completion for registrars in admin tools.
- Fewer API integration errors from partners.
- Positive feedback from cross‑stack teams.

---
Here’s your **unified backend systems architecture visual** — it now ties together **all four backend stacks** into a single, onboarding‑ready diagram so your teams can see the big picture at a glance.  

---

## **How to Read the Diagram**

### **1. Top Layer – Admin UIs**
Each backend stack has its own **admin interface** for developers, registrars, or system admins:
- **Node.js TSX Admin UI** – API monitoring, request logs, OpenAPI explorer.
- **PHP 4.x Native Admin UI** – Legacy data management, migration tools.
- **Python 3.12.7 Admin UI** – Job queue dashboard, data sync controls.
- **BlazorServer API .NET 10 Admin UI** – Role management, service health monitor.

These are **visually separated** but follow the same **design tokens** for consistency (colors, typography, iconography).

---

### **2. Middle Layer – Backend Systems**
- **Node.js TSX Backend**  
  - JWT authentication  
  - x‑tenant scoping for RLS  
  - OpenAPI spec generation for Blazor client
- **PHP 4.x Native Backend**  
  - Legacy MySQL access  
  - Wrapped by Node API for auth/logging
- **Python 3.12.7 Backend**  
  - Scheduled jobs (NCDD sync, data cleaning, PDF generation)  
  - API endpoints for batch processing
- **BlazorServer API .NET 10**  
  - Direct API endpoints for registrar SPA  
  - Real‑time SignalR updates

---

### **3. Bottom Layer – Shared Infrastructure**
- **API Gateway**  
  - Central entry point for all backend services  
  - Enforces authentication, rate limiting, logging
- **PostgreSQL (RLS‑enabled)**  
  - Row‑Level Security by `commune_id`  
  - Primary store for population, family, residence, ID, and death records
- **Other Stores**  
  - MySQL (legacy data)  
  - MongoDB (audit logs, document storage)

---

## **Key Annotations in the Visual**
- **Color Coding**: Each stack has its own color for quick identification.
- **Arrows**: Show data flow from Admin UI → Backend → API Gateway → Database.
- **Icons**: Technology logos for instant recognition.
- **Labels**: Highlight critical features like JWT, RLS, OpenAPI, and legacy integration.

---

## **Onboarding Value**
This diagram is perfect for:
- **New developers** – see where their stack fits in the ecosystem.
- **Cross‑team collaboration** – understand dependencies and shared services.
- **Stakeholder presentations** – communicate complexity in a clean, visual way.

---
Here’s your **enhanced backend systems architecture** — now with **runtime data flows** layered in so your onboarding package covers not just the static structure, but also the **real‑world interactions** between components.

---

## **Runtime Data Flow Scenarios in the Diagram**

### **1. Registrar Login (BlazorServer API → JWT → RLS)**
**Flow:**
1. **Registrar Admin UI** (BlazorServer) sends login credentials to **BlazorServer API**.
2. API validates credentials against the **PostgreSQL** user table.
3. On success, API issues a **JWT** containing `role` and `commune_id`.
4. JWT is returned to the Blazor client and stored securely.
5. All subsequent requests include JWT → API Gateway → RLS filters queries by `commune_id`.

**UX Cues:**
- Clear login feedback (success/error).
- Role and scope displayed in UI header.
- Session timeout warnings.

---

### **2. Citizen Record Search (Node.js TSX API → x‑tenant header)**
**Flow:**
1. **Public/Registrar Admin UI** sends search request to **Node.js API**.
2. API Gateway injects `x-tenant` header based on JWT claims.
3. Node.js API queries **PostgreSQL** with RLS enforcing `commune_id`.
4. Results returned to UI with pagination metadata.

**UX Cues:**
- Search bar with filters (name, ID, date of birth).
- Loading indicators during query.
- Clear “no results” messaging.

---

### **3. Nightly NCDD Sync (Python Backend → PostgreSQL)**
**Flow:**
1. **Python backend job scheduler** triggers NCDD sync script at 02:00.
2. Script fetches updated records from NCDD API.
3. Data is cleaned, transformed, and validated.
4. Updated records are written to **PostgreSQL**.
5. Sync status and logs are pushed to Admin UI dashboards.

**UX Cues:**
- Sync status card (last run time, records updated).
- Error log viewer for failed records.
- Manual “Retry Sync” button for admins.

---

## **Diagram Legend**
- **Orange solid arrows** → Real‑time request/response flows.
- **Orange dashed arrows** → Data writes/reads to database.
- **Blue dashed arrows** → Scheduled/batch jobs.
- **Icons** → Technology stack logos for quick recognition.

---

## **Onboarding Value**
With this visual:
- **Developers** see exactly how authentication, scoping, and data movement work.
- **Admins** understand where their actions trigger backend processes.
- **Stakeholders** can follow the end‑to‑end path of a request or job without reading code.

---
Here’s your **merged, end‑to‑end platform architecture** — the **single‑page master map** that now unites your **frontend**, **backend**, and **runtime data flows** into one onboarding‑ready visual for the Population Management System.  

---

## **How to Read the Unified Diagram**

### **1. Frontend Layer (Top)**
- **Next.js Public Site**  
  - Public Home Page SPA for citizens  
  - Bilingual, responsive, service discovery  
  - Calls Node.js API for public data and search
- **BlazorWasm Registrar Client**  
  - Registrar‑facing SPA with offline IndexedDB drafts  
  - Consumes BlazorServer API for secure, scoped operations

---

### **2. Backend Layer (Middle)**
- **Node.js TSX Backend**  
  - JWT auth, x‑tenant scoping for RLS  
  - OpenAPI spec for Blazor client
- **PHP 4.x Native Backend**  
  - Legacy data access, wrapped by Node API
- **Python 3.12.7 Backend**  
  - Scheduled jobs (NCDD sync, data cleaning, PDF generation)
- **BlazorServer API .NET 10**  
  - Registrar API endpoints, role management, SignalR service health

---

### **3. Shared Infrastructure (Bottom)**
- **API Gateway**  
  - Central entry point, authentication, rate limiting, logging
- **PostgreSQL (RLS‑enabled)**  
  - Row‑Level Security by `commune_id`  
  - Primary store for population, family, residence, ID, and death records
- **Other Stores**  
  - MySQL (legacy)  
  - MongoDB (audit logs, documents)

---

## **Runtime Data Flows in the Visual**
- **Orange solid arrows** → Real‑time request/response (e.g., registrar login, citizen search)  
- **Orange dashed arrows** → Data writes/reads to database  
- **Blue dashed arrows** → Scheduled/batch jobs (e.g., nightly NCDD sync)  
- **Directional flow** → From UI → Backend → API Gateway → Database

---

## **Onboarding Value**
This merged diagram now:
- Shows **both frontends** and **all backend stacks** in one view.
- Makes **data movement** explicit for key scenarios:
  - Registrar login (JWT + RLS)
  - Citizen search (x‑tenant header)
  - Nightly sync (Python job → DB)
- Highlights **security boundaries** and **shared services**.
- Serves as a **single source of truth** for developers, admins, and stakeholders.

---
Here’s your **fully annotated, end‑to‑end platform map** — now with **component‑to‑file mappings** layered directly onto the unified architecture so anyone on your team can trace a UI element or backend service straight to its source file.  

---

## **How to Use This Annotated Map**

### **1. Frontend – Public Site & Registrar**
**Next.js Public Site (`my-frontend/`)**
- **Navigation Bar** → `components/NavigationBar.tsx`
- **Hero Section** → `components/Hero.tsx`
- **Quick Access Tiles** → `components/QuickAccessTiles.tsx`
- **About Section** → `components/AboutSection.tsx` + `about-section.module.css`
- **News Cards** → `components/NewsCards.tsx`
- **Footer** → `components/Footer.tsx`
- **Routing & Layout** → `app/layout.tsx`, `app/page.tsx`
- **Middleware** → `middleware.ts` (JWT/x‑tenant injection)

**BlazorWasm Registrar (`RegistrarBlazor/`)**
- **Main Layout** → `Shared/MainLayout.razor`
- **Nav Menu** → `Shared/NavMenu.razor`
- **Login Display** → `Shared/LoginDisplay.razor`
- **Index Page** → `Pages/Index.razor`
- **Login/Register Pages** → `Pages/Login.razor`, `Pages/Register.razor`
- **Services** → `Services/ApiClient.cs`, `Services/AuthService.cs`, `Services/IndexedDbService.cs`

---

### **2. Backend – Service Layer**
**Node.js TSX Backend**
- **Auth API** → `src/auth.ts`
- **Citizen Search API** → `src/citizens.ts`
- **OpenAPI Spec Generator** → `src/openapi.ts`
- **Legacy Bridge** → `src/legacy.ts`

**PHP 4.x Native Backend**
- **Auth Handler** → `includes/Auth.php`
- **Migration Script** → `scripts/migrate.php`
- **MySQL Connector** → `includes/mysql.php`
- **Public Entry** → `public/index.php`

**Python 3.12.7 Backend**
- **NCDD Sync Job** → `jobs/sync.py`
- **Data Cleaning** → `jobs/clean.py`
- **PDF Generator** → `jobs/pdf.py`
- **Job Runner** → `jobs/job.py`

**BlazorServer API .NET 10**
- **Auth Controller** → `Controllers/AuthController.cs`
- **User Controller** → `Controllers/UserController.cs`
- **PDF Service** → `Services/PDF.cs`
- **Business Logic Services** → `Services/*.cs`

---

### **3. Shared Infrastructure**
- **API Gateway Config** → `gateway/config.yml`
- **PostgreSQL RLS Policies** → `db/rls_policies.sql`
- **Materialized Views** → `db/views/*.sql`

---

## **Color Legend in the Visual**
- 🟩 **Green** – Core components (UI or API endpoints)  
- 🟧 **Orange** – Application logic / feature modules  
- 🟥 **Red** – Legacy or migration scripts  
- 🟦 **Teal/Blue** – Configuration, middleware, or service integration  
- 🟪 **Purple** – Services layer in backend stacks

---

## **Onboarding Benefits**
- **Designers** can see exactly where each UI element lives in the codebase.
- **Developers** can jump from architecture to file path without guesswork.
- **QA** can trace a bug from the UI down to the backend service file.
- **Stakeholders** can understand the scope and complexity of the platform.

---
Got it — here’s a **tight, high‑quality prompt** you can drop straight into Copilot in PowerPoint to generate your slides from the unified architecture diagram and project document we’ve built.  
It’s under 2000 characters, but still rich enough to guide Copilot to produce a **clear, well‑structured deck**.

---

**Prompt for Copilot in PowerPoint:**

Create a professional slide deck titled **“Population Management System – Full Platform Architecture”** based on the provided architecture diagram and project document.  
  
nclude **10 slides** with clear titles, concise bullet points, and space for visuals:  
 1. **Project Overview** – Purpose, scope, and key objectives of the national platform for Cambodia.  
 2. **Frontend Architecture** – Next.js public site (citizen‑facing) and BlazorWasm registrar portal (offline drafts, bilingual UI).  
 3. **Backend Architecture** – Node.js TSX API (JWT, x‑tenant), PHP 4.x Native (legacy), Python 3.12.7 (NCDD sync, data cleaning, PDF generation), BlazorServer API .NET 10 (role management, SignalR).  
 4. **Runtime Data Flows** – Registrar login, citizen search, nightly NCDD sync; show API Gateway and PostgreSQL RLS enforcement.  
 5. **Component‑to‑File Mapping** – Key file paths for frontend and backend components, grouped by stack.  
 6. **Onboarding Value** – Benefits of unified architecture, reduced onboarding time, improved maintainability, and security.  
  
Use **consistent color styling** to match the diagram: green for core components, orange for application logic, blue for configuration, red for legacy/migration scripts.  

Keep text concise, use bullet points, and leave placeholders for inserting the architecture diagram and mapping visuals.

---