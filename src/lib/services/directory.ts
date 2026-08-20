import "server-only";
import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { directoryContacts } from "@/lib/db/schema";

export type DirectoryContactRow = typeof directoryContacts.$inferSelect;

export async function listDirectoryContacts(options?: {
  orgType?: string;
  search?: string;
  layer?: "official" | "community";
  limit?: number;
  offset?: number;
}) {
  const conditions = [];

  if (options?.orgType) {
    conditions.push(eq(directoryContacts.orgType, options.orgType));
  }

  if (options?.layer) {
    conditions.push(eq(directoryContacts.layer, options.layer));
  }

  if (options?.search) {
    const searchPattern = `%${options.search}%`;
    conditions.push(
      or(
        ilike(directoryContacts.slug, searchPattern),
        // Note: JSONB search would require custom SQL, simplified here
      ),
    );
  }

  return db.query.directoryContacts.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [asc(directoryContacts.name)],
    limit: Math.min(options?.limit ?? 50, 100),
    offset: options?.offset ?? 0,
  });
}

export async function getDirectoryContactBySlug(slug: string): Promise<DirectoryContactRow | null> {
  const result = await db.query.directoryContacts.findFirst({
    where: eq(directoryContacts.slug, slug),
  });
  return result ?? null;
}

export async function getOrganizationTypes(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ orgType: directoryContacts.orgType })
    .from(directoryContacts)
    .orderBy(asc(directoryContacts.orgType));

  return rows.map((r) => r.orgType);
}
