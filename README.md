# **Cambodia Population Platform**

A secure, scalable, and culturally relevant digital platform designed to empower local authorities in Cambodia with comprehensive population management capabilities. The system supports complete lifecycle tracking from birth to death, legal documentation management, and seamless integration with Cambodia's NCDD communal database.

## 🌟 Overview

The Cambodia Population Platform is a real, living system that communes can trust with their people's stories—birth to death—without friction or fear. Built with multi-tenancy, modular architecture, and a mixed technology stack, it remains responsive across devices and workable for on-the-ground registrars throughout Cambodia.

### Key Features

- **Lifecycle Management**: Complete citizen tracking from birth registration to death certification
- **Legal Documentation**: Family books, residential cards, SIM identity management
- **Multi-Tenant Architecture**: Secure commune-level data isolation with shared analytics
- **Cultural Relevance**: Khmer/English localization with proper font support
- **Mobile-First Design**: Responsive UI optimized for field registrars and mobile clinics
- **NCDD Integration**: Seamless sync with Cambodia's National Committee for Sub-National Democratic Development

## 🏗️ Architecture

### System Overview

The platform follows a modular, service-oriented architecture with unified authentication, polyglot APIs for legacy continuity, and a responsive, accessible UI designed specifically for Cambodian commune operations.

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Next.js SPA   │  Blazor WASM    │   Mobile Apps           │
│   (Public Site)  │  (Registrar)    │   (Field Workers)       │
└─────────────────┴─────────────────┴─────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  API GATEWAY                                │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Node.js TSX   │   PHP Legacy    │   Python Jobs           │
│   (Primary API) │   (Adapters)    │   (Data Processing)     │
└─────────────────┴─────────────────┴─────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                 │
├─────────────────┬─────────────────┬─────────────────────────┤
│   PostgreSQL    │     MySQL       │     MongoDB             │
│   (Primary)     │   (Legacy)      │   (Documents/Logs)      │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Core Modules

- **Legislation Ledger**: Commune-scoped laws and regulatory updates
- **Family Book Management**: Household grouping and family head tracking
- **Residential Card System**: Movement tracking and address validation
- **SIM Identity Management**: National identity card metadata and lifecycle
- **Death Registration**: Cause, certification, and archival triggers
- **NCDD Integration**: Commune metadata synchronization

## 🚀 Technology Stack

### Frontend

- **Next.js 15** with React 19 - Public website and admin interfaces
- **Blazor WebAssembly (.NET 10)** - Offline-capable registrar workflows
- **shadcn/ui** + **Tailwind v4** - Modern, accessible component library
- **TypeScript** - Type-safe development across the platform

### Backend

- **Node.js** with TSX - Primary API gateway and business logic
- **PHP** - Legacy system adapters (gradual migration)
- **Python** - Data processing, NCDD sync, and analytics jobs
- **C# (.NET 10)** - Blazor services and integrations

### Databases

- **PostgreSQL** - Primary system with Row-Level Security (RLS)
- **MySQL** - Legacy compatibility (migration in progress)
- **MongoDB** - Document storage for legislation, audit logs, and ETL staging

### Infrastructure

- **Docker** - Containerized deployment
- **NGINX** - Reverse proxy and load balancing
- **PM2** - Process management for Node.js services
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend hosting and edge functions

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Docker** and **Docker Compose**
- **.NET 10 SDK**
- **Python** 3.11+
- **PostgreSQL** 15+ (or use Docker)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sisovin/cambodia-population-platform.git
   cd cambodia-population-platform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development environment**

   ```bash
   # Start all services with Docker
   docker-compose up -d

   # Or start individual services
   pnpm dev          # Frontend applications
   pnpm dev:api      # Node.js API
   pnpm dev:blazor   # Blazor registrar app
   ```

5. **Run database migrations**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Access the applications**
   - Public Site: http://localhost:3000
   - Admin Dashboard: http://localhost:3001
   - Registrar App: http://localhost:5000
   - API Documentation: http://localhost:4000/docs

## 📦 Project Structure

```
cambodia-population-platform/
├── apps/
│   ├── public-site/          # Next.js public website
│   └── registrar-app/        # Blazor WebAssembly registrar interface
├── services/
│   ├── node-service/         # Primary Node.js API
│   ├── php-service/          # Legacy PHP adapters
│   ├── python-service/       # Data processing and NCDD sync
│   └── blazor-service/       # Blazor API services
├── packages/
│   ├── ui/                   # Shared UI components (shadcn/ui)
│   ├── types/                # TypeScript type definitions
│   ├── api-client/           # Generated API client
│   ├── eslint-config/        # Shared ESLint configurations
│   └── typescript-config/    # Shared TypeScript configurations
├── infrastructure/
│   ├── docker-compose.yml    # Development environment
│   ├── api-gateway/          # Traefik configuration
│   └── database/             # Database schemas and migrations
├── docs/                     # Documentation and planning
└── scripts/                  # Build and deployment scripts
```

## 🔧 Development

### Adding UI Components

To add new shadcn/ui components to your applications:

```bash
# Add to a specific app
pnpm dlx shadcn@latest add button -c apps/public-site

# Components are automatically available in the packages/ui package
```

### Using Components

Import components from the shared UI package:

```tsx
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
```

### API Development

The Node.js API follows RESTful conventions with OpenAPI documentation:

```typescript
// Example: Citizen registration endpoint
POST /api/v1/citizens
{
  "firstName": "សុខា",
  "lastName": "វង្ស",
  "dateOfBirth": "1990-01-15",
  "communeId": 12345,
  "familyId": 67890
}
```

### Database Operations

The platform uses Row-Level Security (RLS) for multi-tenancy:

```sql
-- Example: Commune-scoped citizen query
SELECT * FROM citizens
WHERE commune_id = current_setting('app.commune_id')::int;
```

## 🔒 Security & Privacy

### Multi-Tenancy

- **Row-Level Security (RLS)**: PostgreSQL policies enforce commune-level data isolation
- **Tenant Scoping**: Every data operation includes `commune_id` validation
- **API Security**: JWT tokens include commune claims and role-based permissions

### Data Protection

- **Encryption**: Data encrypted at rest (PostgreSQL TDE) and in transit (TLS)
- **PII Handling**: Sensitive fields like SIM IDs use application-level encryption
- **Audit Trails**: Append-only logs in MongoDB with signed entries
- **Compliance**: Designed for Cambodian data protection requirements

### Role-Based Access Control

- **Admin**: Full system access across modules
- **Registrar**: Registration and modification within assigned commune
- **Viewer**: Read-only access to public records and reports

## 🌐 Localization

The platform supports Khmer and English with:

- **Khmer Script**: Proper font rendering and input handling
- **Cultural Adaptation**: Cambodian naming conventions and address formats
- **Date Formats**: Buddhist calendar support alongside Gregorian
- **Input Validation**: Khmer-aware form validation and error messages

## 🔄 Integration

### NCDD Synchronization

The platform automatically syncs with Cambodia's NCDD database:

- **Nightly Sync**: Commune metadata and administrative boundaries
- **Change Detection**: Automatic reconciliation with conflict resolution
- **Data Validation**: Ensures consistency with national standards

### Legacy System Support

- **PHP Adapters**: Gradual migration from existing commune systems
- **Data Import**: Bulk import tools for historical records
- **API Compatibility**: Backwards-compatible endpoints during transition

## 📊 Monitoring & Analytics

- **Health Checks**: Automated system monitoring and alerting
- **Performance Metrics**: Application and database performance tracking
- **Audit Reports**: Comprehensive logging for compliance and debugging
- **Dashboard Analytics**: Population trends and registration statistics

## 🤝 Contributing

We welcome contributions to improve the Cambodia Population Platform. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NCDD Cambodia** - For providing commune database specifications
- **Local Registrars** - For invaluable field testing and feedback
- **Open Source Community** - For the amazing tools and libraries that make this possible

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/sisovin/cambodia-population-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sisovin/cambodia-population-platform/discussions)
- **Email**: sisovin@outlook.com

---

**Built with ❤️ for the people of Cambodia**
