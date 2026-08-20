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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Directory" }]} />
      <div className="mb-8">
        <h1 
          className="font-display text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--color-fg)' }}
        >
          Government Directory
        </h1>
        <p className="mt-2 max-w-2xl text-lg" style={{ color: 'var(--color-fg-muted)' }}>
          Contact information for Ethiopian government institutions.
        </p>
      </div>

      {availableTypes.length > 1 && (
        <nav aria-label="Filter by type" className="mb-8 overflow-x-auto">
          <ul className="flex gap-2">
            <li>
              <Link
                href="/directory"
                aria-current={!typeFilter ? "page" : undefined}
                className={
                  !typeFilter
                    ? "inline-block text-xs font-medium"
                    : "inline-block text-xs font-medium transition-all hover-border-primary"
                }
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: !typeFilter ? 'var(--color-primary-600)' : 'var(--color-paper-elevated)',
                  color: !typeFilter ? 'var(--color-paper-elevated)' : 'var(--color-fg-muted)',
                  border: !typeFilter ? 'none' : '1px solid var(--color-border)',
                }}
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
                      ? "inline-block text-xs font-medium"
                      : "inline-block text-xs font-medium transition-all hover-border-primary"
                  }
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: typeFilter === type ? 'var(--color-primary-600)' : 'var(--color-paper-elevated)',
                    color: typeFilter === type ? 'var(--color-paper-elevated)' : 'var(--color-fg-muted)',
                    border: typeFilter === type ? 'none' : '1px solid var(--color-border)',
                  }}
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
        <ul className="grid gap-5 sm:grid-cols-2">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <div 
                className="relative h-full overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-elevated)',
                  padding: '20px',
                }}
              >
                <div 
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}
                />
                <div className="mb-4 flex items-start justify-between gap-3">
                  <Building2 
                    aria-hidden="true" 
                    className="size-5 shrink-0" 
                    style={{ color: 'var(--color-primary-600)' }}
                  />
                  <span 
                    className="text-xs font-medium capitalize"
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-paper-muted)',
                      color: 'var(--color-fg-muted)',
                    }}
                  >
                    {contact.orgType}
                  </span>
                </div>

                <h2 className="font-semibold leading-snug" style={{ color: 'var(--color-fg)' }}>
                  {lt(contact.name)}
                </h2>
                {contact.name.am && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-fg-muted)' }} lang="am">
                    {contact.name.am}
                  </p>
                )}

                {contact.description && (
                  <p className="mt-3 text-sm line-clamp-2" style={{ color: 'var(--color-fg-muted)' }}>
                    {lt(contact.description)}
                  </p>
                )}

                <dl className="mt-4 space-y-2.5 text-sm">
                  {contact.website && (
                    <div className="flex items-start gap-2">
                      <Globe 
                        aria-hidden="true" 
                        className="mt-0.5 size-4 shrink-0" 
                        style={{ color: 'var(--color-fg-subtle)' }}
                      />
                      <dd className="min-w-0">
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="break-all transition-colors hover:underline"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          {contact.website.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-start gap-2">
                      <Phone 
                        aria-hidden="true" 
                        className="mt-0.5 size-4 shrink-0" 
                        style={{ color: 'var(--color-fg-subtle)' }}
                      />
                      <dd>
                        <a
                          href={`tel:${contact.phone}`}
                          className="transition-colors hover-text-primary"
                          style={{ color: 'var(--color-fg)' }}
                        >
                          {contact.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-start gap-2">
                      <Mail 
                        aria-hidden="true" 
                        className="mt-0.5 size-4 shrink-0" 
                        style={{ color: 'var(--color-fg-subtle)' }}
                      />
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${contact.email}`}
                          className="break-all transition-colors hover-text-primary"
                          style={{ color: 'var(--color-fg)' }}
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-start gap-2">
                      <MapPin 
                        aria-hidden="true" 
                        className="mt-0.5 size-4 shrink-0" 
                        style={{ color: 'var(--color-fg-subtle)' }}
                      />
                      <dd style={{ color: 'var(--color-fg-muted)' }}>{lt(contact.address)}</dd>
                    </div>
                  )}
                </dl>

                {contact.layer === "community" && (
                  <p className="mt-4 text-xs" style={{ color: 'var(--color-accent-700)' }}>
                    <span 
                      className="font-medium"
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-accent-50)',
                      }}
                    >
                      COMMUNITY
                    </span>
                    {" "}Community-reported
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div 
        className="mt-8 text-sm"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-paper-muted)',
          padding: '18px',
        }}
      >
        <p className="font-medium" style={{ color: 'var(--color-fg)' }}>About this directory</p>
        <p className="mt-2 leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
          Contact information from official government websites and PM Office listings.
          We never invent contact information. Always verify with the relevant institution.
        </p>
      </div>
    </div>
  );
}
