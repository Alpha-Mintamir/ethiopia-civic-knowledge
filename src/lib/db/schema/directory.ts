import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { LocalizedText } from "@/lib/i18n";
import { infoLayerEnum } from "./enums";
import { users } from "./users";

/**
 * Directory contacts: government ministries, agencies, authorities, bureaus
 * with official contact information. Distinct from `government_organizations`
 * which are organizational entities; this is a contact directory.
 */
export const directoryContacts = pgTable(
  "directory_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: jsonb("name").$type<LocalizedText>().notNull(),
    /** ministry, authority, agency, bureau, commission, etc. */
    orgType: text("org_type").notNull(),
    description: jsonb("description").$type<LocalizedText>(),
    /** Official website */
    website: text("website"),
    /** Contact phone */
    phone: text("phone"),
    /** Contact email */
    email: text("email"),
    /** Physical address */
    address: jsonb("address").$type<LocalizedText>(),
    /** Official or community-reported contact */
    layer: infoLayerEnum("layer").notNull().default("official"),
    /** When this contact was last verified */
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    addedById: uuid("added_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("directory_contacts_type_idx").on(t.orgType),
    index("directory_contacts_layer_idx").on(t.layer),
  ],
);
