# **UI/UX Design Project Document**  
**Public Home Page – Population Management System Platform**

---

## **1. Project Overview**
The Public Home Page is the **primary digital gateway** to the Population Management System for Cambodia. It must serve as a **trustworthy, accessible, and user‑friendly** entry point for citizens, local authorities, and stakeholders.  
The design will reflect **government credibility**, **cultural relevance**, and **modern usability standards**, while ensuring **multi‑device responsiveness** and **bilingual support** (Khmer/English).

---

## **2. Objectives**
- **Inform**: Clearly communicate the platform’s purpose and benefits.
- **Guide**: Provide intuitive navigation to core services.
- **Engage**: Encourage interaction through clear calls‑to‑action (CTAs).
- **Build Trust**: Use official branding, secure design patterns, and transparent content.
- **Include Everyone**: Ensure accessibility for all users, regardless of device or ability.

---

## **3. Target Audience**
- **General Public** – Citizens seeking information or services.
- **Local Authority Staff** – Commune registrars and administrators.
- **Government Stakeholders** – Ministry and NCDD representatives.
- **External Partners** – NGOs, civic tech collaborators.

---

## **4. Key Content Sections**
| Section | Purpose | UX Considerations |
|---------|---------|-------------------|
| **Header Navigation Bar** | Persistent access to main sections | Left: Logo + Branding; Center: Home, Services, About, News, Contact; Right: Login/Register or Avatar menu |
| **Hero Banner** | Immediate introduction to platform | Full‑width image, bilingual headline, 1–2 primary CTAs |
| **Quick Access Tiles** | Direct links to core services | Large touch‑friendly tiles with icons and short labels |
| **About Section** | Explain platform purpose and benefits | Split layout: text + infographic |
| **News & Announcements** | Share updates and policy changes | Card layout with date stamps and “Read more” links |
| **Contact & Support** | Provide help channels | Map, phone, email, live chat |
| **Footer** | Legal, reference, and quick links | Three‑row structure: Quick Links, Legal, Government References |

---

## **5. Design Principles**
- **Clarity**: Minimal clutter, clear hierarchy, consistent typography.
- **Accessibility**: WCAG 2.1 AA compliance; screen reader support; keyboard navigation.
- **Trust & Security**: Official colors, seals, HTTPS indicators.
- **Cultural Relevance**: Khmer script readability; imagery reflecting Cambodian life.
- **Responsiveness**: Optimized layouts for iOS, Android, tablets, and desktop.

---

## **6. Visual Style Guide**
- **Color Palette**:  
  - Primary: Deep Blue `#003366` – trust and authority  
  - Secondary: Gold `#FFD700` – heritage and prestige  
  - Accent: Green `#228B22` – growth and community  
  - Neutral: Light Gray `#F5F5F5` – background balance
- **Typography**:  
  - Khmer: *Battambang* or *Noto Sans Khmer*  
  - English: *Inter* or *Roboto*  
  - Hierarchy: H1 for headlines, H2 for section titles, body text at 16–18px
- **Imagery**:  
  - Authentic photos of Cambodian communities, government offices, and civic events.
- **Iconography**:  
  - Simple, line‑based icons with bilingual tooltips.

---

## **7. Navigation Structure**
**Top Navigation Bar** (sticky):
- Left: Logo + Branding
- Center: Home, Services, About, News, Contact
- Right: Login/Register (or Avatar after login)

**Footer Navigation**:
- Row 1: Quick Links (Services, About, News, Contact, How to Use, FAQs)
- Row 2: Legal & Policy (Privacy Policy, Terms of Service, Accessibility Statement)
- Row 3: Government References (NCDD Cambodia, Ministry of Interior)

---

## **8. User Flow**
1. **Landing** → Hero banner with headline and CTAs.
2. **Service Selection** → Quick access tiles.
3. **Information Gathering** → About, How‑to, News.
4. **Engagement** → Contact form, live chat, or office locator.
5. **Conversion** → User proceeds to secure service portal.

---

## **9. Wireframe Overview**
- **Header**: Logo (left), navigation (center), login/register (right).
- **Hero Section**: Full‑width image, bilingual headline, CTAs.
- **Quick Access**: 4–6 service tiles.
- **About Section**: Text + infographic.
- **News Section**: Horizontal card slider.
- **Contact Section**: Map + contact details.
- **Footer**: Three‑row structure with quick links, legal, and references.

---

## **10. Accessibility & Localization**
- All text available in **Khmer and English**.
- Font sizes and line spacing optimized for Khmer script.
- Alt text for all images.
- High‑contrast mode option.
- Mobile‑first design with touch‑friendly targets.

---

## **11. Success Metrics**
- Bounce rate below 40%.
- ≥ 80% of users find their desired service in ≤ 3 clicks.
- Positive feedback from local authority staff during pilot.

---

## **12. Deliverables**
- Low‑fidelity wireframes (desktop, tablet, mobile).
- High‑fidelity mockups with final colors, typography, and imagery.
- Interactive prototype for usability testing.
- UI kit with reusable components.
- Accessibility compliance checklist.
- Bilingual content copy deck.

---
Here’s your **component‑to‑file mapping** now integrated into the Public Home Page design package — so your design, frontend, and registrar teams can see exactly where each UI element from the wireframe lives in the **Next.js** and **BlazorWasm** codebases.

---

## **Component → File Mapping Table**

| **UI Component** | **Next.js Public Site** (`my-frontend/`) | **BlazorWasm Registrar** (`RegistrarBlazor/`) | **Notes** |
|------------------|------------------------------------------|-----------------------------------------------|-----------|
| **Header Navigation Bar** | `app/layout.tsx` (structure) + `components/NavigationBar.tsx` (UI) | `Shared/MainLayout.razor` (structure) + `Shared/NavMenu.razor` (UI) | Branding, nav links, login/register or avatar menu |
| **Hero Section** | `components/Hero.tsx` | `Pages/Index.razor` (hero markup) | Bilingual headline, large image, CTAs |
| **Quick Access Tiles** | `components/QuickAccessTiles.tsx` | `Pages/Index.razor` (tile markup) | Links to Birth Registration, Family Book, etc. |
| **About Section** | `components/AboutSection.tsx` + `components/about-section.module.css` | `Pages/Index.razor` (about markup) | Split layout: text + infographic |
| **News Cards** | `components/NewsCards.tsx` | `Pages/Index.razor` (news markup) | 3 cards with date, headline, “Read more” |
| **Contact & Support** | `components/ContactMap.tsx` | `Pages/Index.razor` (contact markup) | Map + contact info |
| **Footer** | `components/Footer.tsx` | `Shared/MainLayout.razor` (footer markup) | 3‑row structure: Quick Links, Legal, Government References |
| **Login/Register** | `components/AuthButtons.tsx` | `Pages/Login.razor` / `Pages/Register.razor` | Before login: buttons; after login: avatar menu |
| **Avatar Menu** | `components/UserMenu.tsx` | `Shared/LoginDisplay.razor` | Dropdown with Profile, Settings, Logout |
| **API Integration** | — | `Services/ApiClient.cs` | Handles x‑tenant header, JWT auth, API calls |
| **Offline Drafts** | — | `Services/IndexedDbService.cs` | Stores unsynced records locally |
| **Auth Handling** | — | `Services/AuthService.cs` | Login state, token refresh |

---

## **Color Legend (from the visual diagram)**
- 🟩 **Green** – Project root directories  
- 🟧 **Orange** – Root‑level folders & core app files  
- 🟪 **Purple** – Feature/page/component directories  
- 🟦 **Blue** – Individual components, pages, services, styles

---

## **How to Use This Mapping**
- **Designers**: Know exactly which file to reference when handing off a component spec.
- **Next.js Devs**: Build public‑facing UI in `components/` and wire into `layout.tsx` / `page.tsx`.
- **Blazor Devs**: Implement registrar UI in `Pages/` and `Shared/`, connect to API via `Services/`.
- **QA**: Trace any UI element from the live site back to its source file for testing.

---