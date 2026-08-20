# Ethiopia Civic Knowledge Platform

> **Community civic knowledge base for Ethiopia**  
> Official government information and community practical knowledge, always clearly separated.

A production-quality civic platform that helps Ethiopians understand government processes, requirements, fees, and procedures. The platform maintains a strict separation between official government information and community-contributed knowledge.

## 🌟 Core Principles

1. **Never conflate official and community information** — they are always shown separately with clear labels
2. **Never invent government fees, requirements, or laws** — official information must be verified
3. **Label all sample/demo content** — users must never mistake templates for official documents
4. **Community templates are NOT official** — always clearly marked as community contributions

## 🚀 Features

### Content Management
- **Knowledge Pages**: Comprehensive guides with editorial workflow (Draft → Review → Published)
- **Processes**: Step-by-step visual process guides with time estimates and fees
- **Office Directory**: Government office locations, contacts, services, and hours
- **Document Archive**: Official documents and community templates (clearly separated)
- **Sources & Citations**: Every claim is backed by sources

### Search & Discovery
- **PostgreSQL Full-Text Search**: Fast, relevant search across all content
- **Category Navigation**: Browse by topic (Business, Documents, Legal, Housing)
- **Location-Aware**: Find offices and information relevant to your region
- **SEO Optimized**: Clean URLs, meta tags, JSON-LD structured data

### Community & Trust
- **Centralized RBAC**: Visitor → Contributor → Trusted Contributor → Reviewer → Moderator → Administrator
- **Verification System**: Official, Officially Verified, Community Verified, Outdated, Disputed
- **Contribution System**: Users can submit edits, new pages, experiences, and corrections
- **Moderation Queue**: Reviewers approve/reject contributions with detailed decision tracking
- **Revision History**: Full audit trail of all changes with diff view
- **Reporting**: Flag outdated, incorrect, or misleading information
- **Community Experiences**: Share tips, time reports, fee confirmations, problems

### Admin Dashboard
- **User Management**: Manage roles, suspend users, view activity
- **Content Moderation**: Review pending contributions, approve/reject with notes
- **Source Management**: Maintain verified source database
- **Audit Logs**: Complete activity history
- **Analytics**: View counts, popular content, search queries

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas with React Hook Form
- **Authentication**: Session-based auth (custom implementation)
- **Search**: PostgreSQL Full-Text Search (tsvector/tsquery)
- **Storage**: Abstracted storage layer (local file system, easily swappable to S3/Vercel Blob)

## 📋 Prerequisites

- **Node.js** 20+ and pnpm 10+
- **PostgreSQL** 15+
- **OpenSSL** (for generating session secrets)

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
createdb civic
# or with custom user:
createdb -U civic civic
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```bash
# PostgreSQL connection
DATABASE_URL=postgres://civic:civic@localhost:5432/civic

# Generate a secure secret (required):
# openssl rand -hex 32
SESSION_SECRET=your-generated-secret-here

# Storage directory for uploaded files
STORAGE_DIR=./storage

# Public URL of your deployment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Database Migrations

```bash
pnpm db:generate  # Generate migration SQL from schema
pnpm db:migrate   # Apply migrations to database
```

### 5. Seed Demo Data

⚠️ **Important**: All seed data is clearly marked as `[DEMO]` or `[COMMUNITY TEMPLATE]`

```bash
pnpm db:seed
```

This creates:
- Demo users with different roles
- Sample knowledge pages (PLC, TIN, trade license, rental agreements, etc.)
- Example offices in Addis Ababa
- Community document templates
- Process guides (vehicle transfer, etc.)
- Community experiences and tips

**Demo User Accounts**:
- `admin@civic.et` / `admin123` (Administrator)
- `reviewer@civic.et` / `reviewer123` (Reviewer)
- `trusted@civic.et` / `trusted123` (Trusted Contributor)
- `contributor@civic.et` / `contributor123` (Regular Contributor)

### 6. Build Search Index

Start the dev server and trigger a search index rebuild:

```bash
# In one terminal:
pnpm dev

# In another terminal:
curl -X POST http://localhost:3000/api/admin/reindex
```

The search index is now populated and search will work properly.

### 7. Visit the Application

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📦 Production Build

```bash
pnpm build
pnpm start
```

## 🚢 Deploying to Vercel

### Prerequisites
1. PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)
2. Object storage (Vercel Blob, S3, etc.) — update storage adapter in production

### Environment Variables

Set these in your Vercel project settings:

```bash
DATABASE_URL=postgres://...
SESSION_SECRET=<generate with openssl rand -hex 32>
STORAGE_DIR=/tmp/storage  # or configure object storage
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Deployment

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo for automatic deployments
```

After deployment, run migrations:

```bash
vercel env pull .env.production.local
pnpm db:migrate
```

## 📁 Project Structure

```
/workspace
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── admin/             # Admin dashboard
│   │   ├── categories/        # Category pages
│   │   ├── locations/         # Location pages
│   │   ├── moderation/        # Moderation queue
│   │   ├── pages/             # Knowledge pages
│   │   ├── search/            # Search results
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── admin/             # Admin-specific components
│   │   ├── community/         # Community features (reports, experiences)
│   │   ├── contribute/        # Contribution forms
│   │   ├── layout/            # Header, footer, nav
│   │   ├── moderation/        # Moderation tools
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── auth/              # Authentication & authorization
│   │   ├── db/                # Database client & schema
│   │   │   └── schema/        # Drizzle schema definitions
│   │   ├── search/            # Search implementation
│   │   ├── services/          # Business logic services
│   │   └── validation/        # Zod schemas
│   └── actions/               # Server actions
├── drizzle/                   # Database migrations
├── public/                    # Static assets
└── storage/                   # Local file uploads (dev only)
```

## 🔐 RBAC Roles & Permissions

| Role | Can View | Can Contribute | Can Review | Can Moderate | Can Admin |
|------|----------|----------------|------------|--------------|-----------|
| **Visitor** | Published content | ❌ | ❌ | ❌ | ❌ |
| **Contributor** | Published content | Submit edits, experiences | ❌ | ❌ | ❌ |
| **Trusted Contributor** | Published + review queue | Create pages, submit info | ❌ | ❌ | ❌ |
| **Reviewer** | All content | ✅ | Approve/reject contributions | ❌ | ❌ |
| **Moderator** | All content | ✅ | ✅ | Hide content, resolve reports | ❌ |
| **Administrator** | All content | ✅ | ✅ | ✅ | User management, system config |

## 🎨 Content Verification States

- **Official**: Directly from government sources
- **Officially Verified**: Community content verified against official sources
- **Community Verified**: Confirmed by multiple trusted contributors
- **Community Reported**: Single community report
- **Outdated**: Marked as out of date
- **Disputed**: Conflicting information reported
- **Unknown**: Verification status unclear

## 🌍 Localization

The platform supports Amharic translations:
- UI is primarily English with Amharic labels (`nameAm`, `titleAm`)
- Content can be provided in both languages
- Locations, offices, and categories have Amharic names

## 🤝 Contributing

This is a civic platform — contributions should:
1. Maintain the official/community separation
2. Never invent government information
3. Always cite sources
4. Label demo/template content clearly
5. Follow the editorial workflow

## 📄 License

This project is open source and available for civic use.

## 🙏 Acknowledgments

Built to serve the Ethiopian community with accurate, accessible civic information.

---

**⚠️ Important Disclaimer**: This platform aggregates information for civic education. Always verify official requirements with the relevant government office before taking action. Community contributions are experiences and opinions, not legal advice.
