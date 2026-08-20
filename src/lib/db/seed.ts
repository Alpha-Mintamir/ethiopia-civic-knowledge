import { db } from "./index";
import { en, enAm } from "@/lib/i18n";
import { users } from "./schema/users";
import { locations } from "./schema/locations";
import { sources } from "./schema/sources";
import { categories } from "./schema/taxonomy";
import { knowledgePages, revisions, pageSections } from "./schema/content";
import {
  governmentOrganizations,
  governmentOffices,
  officeServices,
} from "./schema/offices";
import { documents, documentVersions } from "./schema/documents";
import { processes, processSteps, processFees, processRequirements } from "./schema/processes";
import { communityNotes } from "./schema/community";
import * as crypto from "crypto";

/**
 * Seed the database with labeled demo content for the Ethiopia Civic Knowledge Platform.
 * All demo content is clearly marked to avoid confusing sample data with real official information.
 */

// Simple password hashing for seed data (scrypt format: scrypt:N:r:p:salt:hash)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt:16384:8:1:${salt}:${hash}`;
}

async function seed() {
  console.log("🌱 Starting seed...");

  // Clean existing data (in reverse dependency order)
  console.log("Cleaning existing data...");
  await db.delete(processRequirements).execute();
  await db.delete(processFees).execute();
  await db.delete(processSteps).execute();
  await db.delete(processes).execute();
  await db.delete(communityNotes).execute();
  await db.delete(documentVersions).execute();
  await db.delete(documents).execute();
  await db.delete(officeServices).execute();
  await db.delete(governmentOffices).execute();
  await db.delete(governmentOrganizations).execute();
  await db.delete(pageSections).execute();
  await db.delete(revisions).execute();
  await db.delete(knowledgePages).execute();
  await db.delete(sources).execute();
  await db.delete(categories).execute();
  await db.delete(locations).execute();
  await db.delete(users).execute();

  // 1. Create users with different roles
  console.log("Creating users...");
  const [admin, reviewer, contributor, trusted] = await db
    .insert(users)
    .values([
      {
        email: "admin@civic.et",
        passwordHash: hashPassword("admin123"),
        name: "Admin User",
        role: "admin",
        status: "active",
        reputation: 1000,
        bio: "System administrator",
        emailVerifiedAt: new Date(),
      },
      {
        email: "reviewer@civic.et",
        passwordHash: hashPassword("reviewer123"),
        name: "Reviewer User",
        role: "reviewer",
        status: "active",
        reputation: 500,
        bio: "Content reviewer",
        emailVerifiedAt: new Date(),
      },
      {
        email: "contributor@civic.et",
        passwordHash: hashPassword("contributor123"),
        name: "Regular Contributor",
        role: "contributor",
        status: "active",
        reputation: 100,
        emailVerifiedAt: new Date(),
      },
      {
        email: "trusted@civic.et",
        passwordHash: hashPassword("trusted123"),
        name: "Trusted Contributor",
        role: "trusted_contributor",
        status: "active",
        reputation: 300,
        emailVerifiedAt: new Date(),
      },
    ])
    .returning();

  // 2. Create locations
  console.log("Creating locations...");
  const [ethiopia, addisAbaba, oromia] = await db
    .insert(locations)
    .values([
      {
        name: enAm("Ethiopia", "ኢትዮጵያ"),
        slug: "ethiopia",
        type: "country",
      },
      {
        name: enAm("Addis Ababa", "አዲስ አበባ"),
        slug: "addis-ababa",
        type: "city",
      },
      {
        name: enAm("Oromia", "ኦሮሚያ"),
        slug: "oromia",
        type: "region",
      },
    ])
    .returning();

  // 3. Create sources
  console.log("Creating sources...");
  const [ethiopiaGovSource, tradeMinistrySource, communitySource] = await db
    .insert(sources)
    .values([
      {
        title: "[DEMO] Ethiopia.gov.et Official Portal",
        url: "https://ethiopia.gov.et",
        type: "government_website",
        reliability: "official",
        notes: "Official government portal (demo reference)",
        addedById: admin.id,
      },
      {
        title: "[DEMO] Ministry of Trade and Regional Integration",
        url: "https://motri.gov.et",
        type: "government_website",
        reliability: "official",
        notes: "Ministry responsible for business licensing (demo reference)",
        addedById: admin.id,
      },
      {
        title: "[COMMUNITY TEMPLATE] Community Experience",
        type: "community_submission",
        reliability: "community",
        notes: "Aggregated community experiences and tips",
        addedById: contributor.id,
      },
    ])
    .returning();

  // 4. Create categories
  console.log("Creating categories...");
  const [businessCat, documentsCat, legalCat, housingCat] = await db
    .insert(categories)
    .values([
      {
        name: enAm("Business & Trade License", "ንግድና የንግድ ፈቃድ"),
        slug: "business-trade-license",
        description: en("Starting and registering a business in Ethiopia"),
      },
      {
        name: enAm("Documents & Identification", "ሰነዶችና መታወቂያ"),
        slug: "documents-identification",
        description: en("National ID, PLC registration, TIN, and official documents"),
      },
      {
        name: enAm("Legal Procedures", "ህጋዊ ሂደቶች"),
        slug: "legal-procedures",
        description: en("Legal processes, authentication, and court procedures"),
      },
      {
        name: enAm("Housing & Rental", "ቤትና ኪራይ"),
        slug: "housing-rental",
        description: en("Rental agreements, property registration, and housing"),
      },
    ])
    .returning();

  // 5. Create knowledge pages (simplified structure)
  console.log("Creating knowledge pages...");
  const [plcPage, tinPage, tradeLicensePage] = await db
    .insert(knowledgePages)
    .values([
      {
        title: en("[DEMO] Private Limited Company (PLC) Registration"),
        slug: "plc-registration",
        summary: en(
          "Complete guide to registering a Private Limited Company in Ethiopia (Demo Content)"
        ),
        status: "published",
        verificationStatus: "community_verified",
        categoryId: businessCat.id,
        createdById: contributor.id,
        currentRevisionNumber: 1,
      },
      {
        title: en("[DEMO] Tax Identification Number (TIN)"),
        slug: "tin-registration",
        summary: en(
          "How to obtain your Tax Identification Number from Ethiopian Revenue Authority (Demo)"
        ),
        status: "published",
        verificationStatus: "community_verified",
        categoryId: documentsCat.id,
        createdById: trusted.id,
        currentRevisionNumber: 1,
      },
      {
        title: en("[DEMO] Trade License Application"),
        slug: "trade-license",
        summary: en("Applying for a trade license for small and medium businesses (Demo Guide)"),
        status: "published",
        verificationStatus: "community_verified",
        categoryId: businessCat.id,
        createdById: contributor.id,
        currentRevisionNumber: 1,
      },
    ])
    .returning();

  // 6. Add page sections with content
  console.log("Adding page sections...");
  await db.insert(pageSections).values([
    {
      pageId: plcPage.id,
      layer: "community",
      sortOrder: 0,
      heading: en("Overview"),
      body: en(`**⚠️ This is demo content for platform testing.**

A Private Limited Company (PLC) is the most common business structure for medium to large businesses in Ethiopia.

## Requirements (Sample)
- Minimum 2 shareholders
- Minimum capital: ETB 15,000
- Unique company name reservation
- Memorandum and Articles of Association

*This is sample content only. Official fees and requirements change regularly.*`),
    },
    {
      pageId: tinPage.id,
      layer: "community",
      sortOrder: 0,
      heading: en("What is TIN?"),
      body: en(`**⚠️ Demo content - verify with Ethiopian Revenue and Customs Authority.**

Tax Identification Number (TIN) is required for:
- Business operations
- Employment
- Banking transactions
- Government contracts

## How to Apply (Sample Process)
1. Visit nearest Revenue Authority office
2. Fill TIN application form
3. Submit required documents
4. Receive TIN certificate (usually same day)

*Official process may differ.*`),
    },
  ]);

  // 7. Create government organizations and offices
  console.log("Creating offices...");
  const [tradeOrg] = await db
    .insert(governmentOrganizations)
    .values([
      {
        slug: "trade-ministry",
        name: enAm("Ministry of Trade and Regional Integration", "የንግድና ክልላዊ ውህደት ሚኒስቴር"),
        orgType: "ministry",
        description: en("[DEMO] Handles business registration and trade licenses"),
        website: "https://motri.gov.et",
      },
    ])
    .returning();

  const [tradeOffice] = await db
    .insert(governmentOffices)
    .values([
      {
        slug: "aa-trade-bureau",
        name: enAm("Addis Ababa Trade Bureau", "አዲስ አበባ ንግድ ቢሮ [ሙከራ]"),
        organizationId: tradeOrg.id,
        officeType: "branch",
        locationId: addisAbaba.id,
        address: en("[DEMO] Near Meskel Square, Addis Ababa"),
        latitude: 9.0084,
        longitude: 38.7636,
        phone: "+251 11 XXX XXXX (Demo)",
        email: "demo@trade.et",
        status: "published",
        verificationStatus: "community_verified",
        createdById: contributor.id,
      },
    ])
    .returning();

  await db.insert(officeServices).values([
    {
      officeId: tradeOffice.id,
      name: en("Business name reservation"),
      description: en("Reserve your business name before registration"),
      layer: "community",
    },
    {
      officeId: tradeOffice.id,
      name: en("Trade license issuance"),
      description: en("Apply for and receive trade licenses"),
      layer: "community",
    },
  ]);

  // 8. Create document templates
  console.log("Creating document templates...");
  const [powerOfAttorneyDoc] = await db
    .insert(documents)
    .values([
      {
        title: en("[COMMUNITY TEMPLATE] Power of Attorney Form"),
        slug: "power-of-attorney-template",
        description: en(
          "Sample power of attorney template (Community contribution - NOT official)"
        ),
        language: "en",
        docType: "template",
        layer: "community",
        access: "public",
        status: "published",
        verificationStatus: "community_verified",
        contributorId: contributor.id,
      },
    ])
    .returning();

  // Create document version (file metadata)
  await db.insert(documentVersions).values([
    {
      documentId: powerOfAttorneyDoc.id,
      versionNumber: 1,
      storageKey: "demo/power-of-attorney-template.pdf",
      originalFilename: "power-of-attorney-template.pdf",
      mimeType: "application/pdf",
      format: "pdf",
      fileSize: 125000,
      sha256: "demo-hash-placeholder",
      uploadedById: contributor.id,
      scanStatus: "passed",
    },
  ]);

  // 9. Create a sample process
  console.log("Creating processes...");
  const [vehicleProcess] = await db
    .insert(processes)
    .values([
      {
        title: en("[DEMO] Vehicle Ownership Transfer"),
        slug: "vehicle-ownership-transfer",
        summary: en("Steps to transfer vehicle ownership in Addis Ababa (Demo process)"),
        complexity: "moderate",
        status: "published",
        verificationStatus: "community_verified",
        createdById: contributor.id,
      },
    ])
    .returning();

  await db.insert(processSteps).values([
    {
      processId: vehicleProcess.id,
      stepNumber: 1,
      title: en("Obtain vehicle clearance"),
      communityBody: en("Get clearance from traffic police showing no outstanding fines"),
    },
    {
      processId: vehicleProcess.id,
      stepNumber: 2,
      title: en("Visit Transport Authority office"),
      communityBody: en("Submit transfer application with both parties present"),
    },
  ]);

  await db.insert(processFees).values([
    {
      processId: vehicleProcess.id,
      label: en("Transfer fee"),
      amountMin: "500",
      amountMax: "500",
      currency: "ETB",
      kind: "community_reported",
      note: en("Approximate transfer fee (Demo - actual fees vary)"),
    },
  ]);

  // 10. Create community notes
  console.log("Creating community experiences...");
  await db.insert(communityNotes).values([
    {
      entityType: "knowledge_page",
      entityId: plcPage.id,
      kind: "experience",
      body: "[DEMO EXPERIENCE] The PLC registration took me about 2 weeks. Tip: prepare all documents in advance!",
      authorId: contributor.id,
      status: "published",
    },
    {
      entityType: "knowledge_page",
      entityId: tinPage.id,
      kind: "tip",
      body: "[DEMO TIP] TIN registration is free and takes about 30 minutes. Visit early morning to avoid crowds.",
      authorId: trusted.id,
      status: "published",
    },
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📝 Demo users created:");
  console.log("  admin@civic.et / admin123 (Administrator)");
  console.log("  reviewer@civic.et / reviewer123 (Reviewer)");
  console.log("  contributor@civic.et / contributor123 (Contributor)");
  console.log("  trusted@civic.et / trusted123 (Trusted Contributor)");
  console.log("\n⚠️  All content is marked as DEMO/COMMUNITY TEMPLATE");
  console.log("   Never confuse with official government information!");
  console.log("\n💡 To build the search index, start the dev server and run:");
  console.log("   curl -X POST http://localhost:3000/api/admin/reindex\n");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
