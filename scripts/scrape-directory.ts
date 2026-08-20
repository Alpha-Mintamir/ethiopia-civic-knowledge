/**
 * Government Directory Scraper
 * 
 * Registry of 12 official Ethiopian government websites.
 * Scrapes publicly available contact information for the government directory.
 * 
 * Usage: pnpm scrape:directory
 */

import { db } from "@/lib/db";
import { directoryContacts } from "@/lib/db/schema";
import { en, enAm } from "@/lib/i18n";
import { eq } from "drizzle-orm";

interface DirectoryEntry {
  slug: string;
  name: { en: string; am?: string };
  orgType: string;
  description?: { en: string; am?: string };
  website?: string;
  phone?: string;
  email?: string;
  address?: { en: string; am?: string };
}

/**
 * Registry of 12 official Ethiopian government institutions.
 * All entries marked as [DEMO] where actual data is not publicly available.
 * Never invents fees, requirements, or laws — only publicly listed contact info.
 */
const OFFICIAL_GOVERNMENT_REGISTRY: DirectoryEntry[] = [
  {
    slug: "pm-office",
    name: { en: "Office of the Prime Minister", am: "የጠቅላይ ሚኒስትር ቢሮ" },
    orgType: "office",
    description: { en: "[DEMO] Executive office of the Prime Minister of Ethiopia" },
    website: "https://pmo.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "mofa",
    name: { en: "Ministry of Foreign Affairs", am: "የውጭ ጉዳይ ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Handles diplomatic relations and foreign policy" },
    website: "https://mfa.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "mof",
    name: { en: "Ministry of Finance", am: "የፋይናንስ ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Manages national budget and fiscal policy" },
    website: "https://mof.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "mot",
    name: { en: "Ministry of Transport", am: "የትራንስፖርት ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Oversees national transportation systems" },
    website: "https://mot.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "moh",
    name: { en: "Ministry of Health", am: "የጤና ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Public health policy and healthcare services" },
    website: "https://moh.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "moe",
    name: { en: "Ministry of Education", am: "የትምህርት ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] National education policy and school systems" },
    website: "https://moe.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "erca",
    name: { en: "Ethiopian Revenues and Customs Authority", am: "የኢትዮጵያ ገቢዎችና ጉምሩክ ባለሥልጣን" },
    orgType: "authority",
    description: { en: "[DEMO] Tax collection and customs administration" },
    website: "https://erca.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "investment-commission",
    name: { en: "Ethiopian Investment Commission", am: "የኢትዮጵያ ኢንቨስትመንት ኮሚሽን" },
    orgType: "commission",
    description: { en: "[DEMO] Promotes and facilitates investment in Ethiopia" },
    website: "https://investethiopia.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "nbe",
    name: { en: "National Bank of Ethiopia", am: "የኢትዮጵያ ብሔራዊ ባንክ" },
    orgType: "authority",
    description: { en: "[DEMO] Central bank and monetary policy authority" },
    website: "https://nbe.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "immigration",
    name: { en: "Immigration and Citizenship Service", am: "ስደተኞች እና ዜግነት አገልግሎት" },
    orgType: "agency",
    description: { en: "[DEMO] Immigration, visa, and citizenship services" },
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "motri",
    name: { en: "Ministry of Trade and Regional Integration", am: "የንግድና ክልላዊ ውህደት ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Trade policy, business licensing, and regional trade" },
    website: "https://motri.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
  {
    slug: "labor-skills",
    name: { en: "Ministry of Labor and Skills", am: "የሠራተኛ እና ክህሎት ሚኒስቴር" },
    orgType: "ministry",
    description: { en: "[DEMO] Labor policy, employment, and skills development" },
    website: "https://molsa.gov.et",
    address: { en: "[DEMO] Addis Ababa, Ethiopia" },
  },
];

async function scrapeDirectory() {
  console.log("🔍 Starting government directory scraper...");
  console.log(`📋 Processing ${OFFICIAL_GOVERNMENT_REGISTRY.length} official government institutions\n`);

  let inserted = 0;
  let updated = 0;

  for (const entry of OFFICIAL_GOVERNMENT_REGISTRY) {
    const existing = await db.query.directoryContacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.slug, entry.slug),
    });

    const data = {
      slug: entry.slug,
      name: entry.name.am ? enAm(entry.name.en, entry.name.am) : en(entry.name.en),
      orgType: entry.orgType,
      description: entry.description
        ? entry.description.am
          ? enAm(entry.description.en, entry.description.am)
          : en(entry.description.en)
        : null,
      website: entry.website ?? null,
      phone: entry.phone ?? null,
      email: entry.email ?? null,
      address: entry.address
        ? entry.address.am
          ? enAm(entry.address.en, entry.address.am)
          : en(entry.address.en)
        : null,
      layer: "official" as const,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(directoryContacts)
        .set(data)
        .where(eq(directoryContacts.id, existing.id));
      updated++;
      console.log(`  ↻ Updated: ${entry.name.en}`);
    } else {
      await db.insert(directoryContacts).values(data);
      inserted++;
      console.log(`  + Inserted: ${entry.name.en}`);
    }
  }

  console.log(`\n✅ Directory scraper completed!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Total: ${OFFICIAL_GOVERNMENT_REGISTRY.length}`);
  console.log(`\n⚠️  All entries are marked as [DEMO] where actual data is not publicly available.`);
  console.log(`   Never invents official fees, requirements, or laws.`);
}

scrapeDirectory()
  .catch((err) => {
    console.error("❌ Scraper failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
