/**
 * Government Directory Scraper
 * 
 * Loads official Ethiopian federal government contacts from verified sources.
 * Scrapes publicly available contact information for the government directory.
 * 
 * Usage: pnpm scrape:directory
 */

import { db } from "@/lib/db";
import { directoryContacts } from "@/lib/db/schema";
import { en, enAm } from "@/lib/i18n";
import { eq, inArray } from "drizzle-orm";
import { readFileSync } from "fs";
import { join } from "path";

interface DirectoryEntry {
  slug: string;
  name: { en: string; am?: string };
  orgType: string;
  description?: { en?: string; am?: string } | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: { en?: string; am?: string } | null;
  sources?: Record<string, string | null>;
}

interface FederalRegistry {
  generatedAt: string;
  notes: string;
  institutions: DirectoryEntry[];
}

/**
 * Load federal government registry from verified JSON file.
 */
function loadFederalRegistry(): DirectoryEntry[] {
  const registryPath = join(process.cwd(), "data", "directory-federal.json");
  const registryData = readFileSync(registryPath, "utf-8");
  const registry: FederalRegistry = JSON.parse(registryData);
  
  return registry.institutions.map((entry) => {
    // Fix "Ministry of Transport and Logistic" -> "Ministry of Transport and Logistics"
    // per PMO council naming (keep all other strings exactly as in JSON)
    if (entry.name.en === "Ministry of Transport and Logistic") {
      return { ...entry, name: { ...entry.name, en: "Ministry of Transport and Logistics" } };
    }
    return entry;
  });
}

async function scrapeDirectory() {
  console.log("🔍 Starting government directory scraper...");
  
  const registry = loadFederalRegistry();
  const slugsInRegistry = registry.map((entry) => entry.slug);
  
  console.log(`📋 Processing ${registry.length} official federal institutions\n`);

  let inserted = 0;
  let updated = 0;

  for (const entry of registry) {
    const existing = await db.query.directoryContacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.slug, entry.slug),
    });

    const data = {
      slug: entry.slug,
      name: entry.name.am ? enAm(entry.name.en, entry.name.am) : en(entry.name.en),
      orgType: entry.orgType,
      description: entry.description
        ? entry.description.am
          ? enAm(entry.description.en ?? "", entry.description.am)
          : entry.description.en
          ? en(entry.description.en)
          : null
        : null,
      website: entry.website ?? null,
      phone: entry.phone ?? null,
      email: entry.email ?? null,
      address: entry.address
        ? entry.address.am
          ? enAm(entry.address.en ?? "", entry.address.am)
          : entry.address.en
          ? en(entry.address.en)
          : null
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

  // Delete old demo entries not in the new registry
  const demoSlugs = [
    "pm-office",
    "mofa",
    "mof",
    "mot",
    "moh",
    "moe",
    "erca",
    "investment-commission",
    "nbe",
    "immigration",
    "motri",
    "labor-skills",
  ].filter((slug) => !slugsInRegistry.includes(slug));

  if (demoSlugs.length > 0) {
    const deleted = await db
      .delete(directoryContacts)
      .where(
        inArray(directoryContacts.slug, demoSlugs)
      )
      .returning();
    
    console.log(`\n🗑️  Removed ${deleted.length} old demo entries:`);
    deleted.forEach((entry) => {
      console.log(`     - ${entry.slug}`);
    });
  }

  console.log(`\n✅ Directory scraper completed!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Total: ${registry.length}`);
  console.log(`\n📝 Contacts taken from official .gov.et pages and PMO listings.`);
  console.log(`   Unpublished fields remain null (never invented).`);
}

scrapeDirectory()
  .catch((err) => {
    console.error("❌ Scraper failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
