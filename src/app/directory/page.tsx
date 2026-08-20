import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { lt } from "@/lib/i18n";
import { getOrganizationTypes, listDirectoryContacts } from "@/lib/services/directory";

export const metadata: Metadata = {
  title: "Government Directory",
  description:
    "Directory of Ethiopian government institutions with official contact information: ministries, authorities, agencies, and commissions.",
};

export const revalidate = 300;

const ORG_TYPE_LABELS: Record<string, string> = {
  ministry: "Ministry",
  authority: "Authority",
  agency: "Agency",
  bureau: "Bureau",
  commission: "Commission",
  office: "Office",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; layer?: string }>;
}) {
  const params = await searchParams;
  const typeFilter = params.type;
  const layerFilter = params.layer === "community" ? "community" : undefined;

  const [contacts, availableTypes] = await Promise.all([
    listDirectoryContacts({
      orgType: typeFilter,
      layer: layerFilter,
    }),
    getOrganizationTypes(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Directory" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Government Directory</h1>
        <p className="mt-1 max-w-2xl text-stone-600">
          Contact information for Ethiopian government institutions: ministries, authorities,
          agencies, and commissions.
        </p>
      </div>

      {availableTypes.length > 1 && (
        <nav aria-label="Filter by type" className="mb-6 overflow-x-auto">
          <ul className="flex gap-1.5">
            <li>
              <Link
                href="/directory"
                aria-current={!typeFilter ? "page" : undefined}
                className={
                  !typeFilter
                    ? "inline-block rounded-full bg-primary-700 px-3 py-1 text-xs font-medium text-white"
                    : "inline-block rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 hover:border-primary-300"
                }
              >
                All types
              </Link>
            </li>
            {availableTypes.map((type) => (
              <li key={type}>
                <Link
                  href={`/directory?type=${type}`}
                  aria-current={typeFilter === type ? "page" : undefined}
                  className={
                    typeFilter === type
                      ? "inline-block rounded-full bg-primary-700 px-3 py-1 text-xs font-medium text-white"
                      : "inline-block rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 hover:border-primary-300"
                  }
                >
                  {ORG_TYPE_LABELS[type] ?? type}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts found"
          description="No directory contacts match your criteria."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <Building2 aria-hidden="true" className="size-5 shrink-0 text-primary-700" />
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium capitalize text-stone-600">
                      {contact.orgType}
                    </span>
                  </div>

                  <h2 className="font-semibold text-stone-900">{lt(contact.name)}</h2>
                  {contact.name.am && (
                    <p className="mt-0.5 text-sm text-stone-500" lang="am">
                      {contact.name.am}
                    </p>
                  )}

                  {contact.description && (
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                      {lt(contact.description)}
                    </p>
                  )}

                  <dl className="mt-3 space-y-2 text-sm">
                    {contact.website && (
                      <div className="flex items-start gap-2">
                        <Globe aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-stone-400" />
                        <dd className="min-w-0">
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-primary-700 hover:underline break-all"
                          >
                            {contact.website.replace(/^https?:\/\//, "")}
                          </a>
                        </dd>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-start gap-2">
                        <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-stone-400" />
                        <dd>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-stone-700 hover:text-primary-700"
                          >
                            {contact.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-start gap-2">
                        <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-stone-400" />
                        <dd className="min-w-0">
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-stone-700 hover:text-primary-700 break-all"
                          >
                            {contact.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-2">
                        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-stone-400" />
                        <dd className="text-stone-600">{lt(contact.address)}</dd>
                      </div>
                    )}
                  </dl>

                  {contact.layer === "community" && (
                    <p className="mt-3 text-xs text-amber-700">
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 font-medium">COMMUNITY</span>{" "}
                      Community-reported contact
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">About this directory</p>
        <p className="mt-1">
          Contact information is sourced from publicly available government resources. While we
          strive to keep it current, always verify critical information directly with the relevant
          institution. Some entries are marked <strong>[DEMO]</strong> for platform testing.
        </p>
      </div>
    </div>
  );
}
