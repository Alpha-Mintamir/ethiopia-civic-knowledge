import {
  ArrowRight,
  Building2,
  FileText,
  FolderOpen,
  MapPin,
  Route,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { VerificationBadge } from "@/components/verification-badge";
import { Badge } from "@/components/ui/badge";
import { lt } from "@/lib/i18n";
import { listRecentDocuments } from "@/lib/services/documents";
import { listPopularOffices } from "@/lib/services/offices";
import { listPopularProcesses } from "@/lib/services/processes";
import { listRecentlyUpdatedPages, listRecentlyVerifiedPages } from "@/lib/services/pages";
import { listCategories } from "@/lib/services/taxonomy";
import { listLocations } from "@/lib/services/locations";
import { listRecentCommunityActivity } from "@/lib/services/stats";
import { formatMonthYear, timeAgo, truncate } from "@/lib/utils";

export const revalidate = 300;

const EXAMPLE_SEARCHES = [
  "How to create a PLC",
  "Addis Ababa rental contract",
  "How to get TIN",
  "Vehicle transfer",
  "Power of attorney",
  "Where do I authenticate documents?",
  "How to renew a trade license?",
];

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 
        className="font-display text-xl font-semibold"
        style={{ color: 'var(--color-fg)' }}
      >
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: 'var(--color-primary-600)' }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--color-primary-700)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--color-primary-600)';
          }}
        >
          {linkLabel ?? "View all"} <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export default async function HomePage() {
  const [processes, documents, offices, updatedPages, verifiedPages, categories, locations, activity] =
    await Promise.all([
      listPopularProcesses(6),
      listRecentDocuments(6),
      listPopularOffices(6),
      listRecentlyUpdatedPages(5),
      listRecentlyVerifiedPages(5),
      listCategories(),
      listLocations(),
      listRecentCommunityActivity(5),
    ]);

  const regionsAndCities = locations.filter((l) => l.type === "region" || l.type === "city");

  return (
    <div>
      {/* Hero */}
      <section 
        style={{ 
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-paper-elevated)',
        }}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <h1 
            className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ color: 'var(--color-fg)' }}
          >
            Understand how things work in Ethiopia
          </h1>
          <p 
            className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            Community civic knowledge about procedures, offices, documents, and processes. 
            Official sources and real experience, clearly separated.
          </p>
          <div className="mt-8">
            <SearchBar size="lg" />
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Example searches">
            {EXAMPLE_SEARCHES.map((example) => (
              <li key={example}>
                <Link
                  href={`/search?q=${encodeURIComponent(example)}`}
                  className="inline-block text-xs transition-colors"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-paper)',
                    color: 'var(--color-fg-muted)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
                    e.currentTarget.style.color = 'var(--color-primary-700)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.backgroundColor = 'var(--color-paper)';
                    e.currentTarget.style.color = 'var(--color-fg-muted)';
                  }}
                >
                  {example}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        {/* Popular processes */}
        <section aria-labelledby="popular-processes">
          <SectionHeading title="Popular processes" href="/processes" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processes.map((process) => (
              <Link
                key={process.id}
                href={`/processes/${process.slug}`}
                className="group relative overflow-hidden transition-all"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-elevated)',
                  padding: '18px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}
                />
                <div className="flex items-start justify-between gap-2">
                  <Route 
                    aria-hidden="true" 
                    className="size-5" 
                    style={{ color: 'var(--color-primary-600)' }}
                  />
                  <VerificationBadge status={process.verificationStatus} />
                </div>
                <h3 
                  className="mt-2.5 font-medium leading-snug transition-colors group-hover:text-primary-700"
                  style={{ color: 'var(--color-fg)' }}
                >
                  {lt(process.title)}
                </h3>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
                  {truncate(lt(process.summary), 110)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Documents + Offices */}
        <div className="grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="popular-documents">
            <SectionHeading title="Documents & templates" href="/documents" />
            <ul 
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-elevated)',
              }}
            >
              {documents.map((doc, idx) => (
                <li 
                  key={doc.id}
                  style={idx > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}
                >
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                    style={{ color: 'var(--color-fg)' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-paper-muted)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FileText 
                      aria-hidden="true" 
                      className="size-4 shrink-0" 
                      style={{ color: 'var(--color-fg-subtle)' }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {lt(doc.title)}
                    </span>
                    <Badge variant={doc.layer === "official" ? "official" : "community"}>
                      {doc.layer === "official" ? "Official" : "Community"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="popular-offices">
            <SectionHeading title="Government offices" href="/offices" />
            <ul 
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-elevated)',
              }}
            >
              {offices.map((office, idx) => (
                <li 
                  key={office.id}
                  style={idx > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}
                >
                  <Link
                    href={`/offices/${office.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                    style={{ color: 'var(--color-fg)' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-paper-muted)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Building2 
                      aria-hidden="true" 
                      className="size-4 shrink-0" 
                      style={{ color: 'var(--color-fg-subtle)' }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {lt(office.name)}
                    </span>
                    <VerificationBadge status={office.verificationStatus} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Recently updated / verified / community activity */}
        <div className="grid gap-12 lg:grid-cols-3">
          <section aria-labelledby="recently-updated">
            <SectionHeading title="Recently updated" href="/pages" />
            <ul className="space-y-2.5">
              {updatedPages.map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/pages/${page.slug}`}
                    className="block text-sm transition-all"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-paper-elevated)',
                      padding: '12px 14px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <span className="font-medium" style={{ color: 'var(--color-fg)' }}>
                      {lt(page.title)}
                    </span>
                    <span className="mt-1 block text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
                      Updated {timeAgo(page.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="recently-verified">
            <SectionHeading title="Recently verified" />
            <ul className="space-y-2.5">
              {verifiedPages.map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/pages/${page.slug}`}
                    className="block text-sm transition-all"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-paper-elevated)',
                      padding: '12px 14px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-medium" style={{ color: 'var(--color-fg)' }}>
                        {lt(page.title)}
                      </span>
                      <VerificationBadge status={page.verificationStatus} />
                    </span>
                    <span className="mt-1 block text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
                      Verified {formatMonthYear(page.lastVerifiedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="community-activity">
            <SectionHeading title="Community activity" />
            {activity.length === 0 ? (
              <p 
                className="px-3 py-8 text-center text-sm"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--color-border-strong)',
                  backgroundColor: 'var(--color-paper-elevated)',
                  color: 'var(--color-fg-subtle)',
                }}
              >
                No activity yet
              </p>
            ) : (
              <ul className="space-y-2.5">
                {activity.map(({ note, authorName }) => (
                  <li
                    key={note.id}
                    className="text-sm"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-paper-elevated)',
                      padding: '12px 14px',
                    }}
                  >
                    <p style={{ color: 'var(--color-fg-muted)' }}>
                      {truncate(note.body, 100)}
                    </p>
                    <p 
                      className="mt-1.5 flex items-center gap-1.5 text-xs"
                      style={{ color: 'var(--color-fg-subtle)' }}
                    >
                      <Users aria-hidden="true" className="size-3" />
                      {authorName} · {timeAgo(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Browse by category and location */}
        <div className="grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="browse-category">
            <SectionHeading title="Browse by category" />
            <ul className="flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm transition-all"
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-paper-elevated)',
                      color: 'var(--color-fg)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                      e.currentTarget.style.color = 'var(--color-primary-700)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-fg)';
                    }}
                  >
                    <FolderOpen 
                      aria-hidden="true" 
                      className="size-3.5" 
                      style={{ color: 'var(--color-fg-subtle)' }}
                    />
                    {lt(category.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="browse-location">
            <SectionHeading title="Browse by location" href="/locations" />
            <ul className="flex flex-wrap gap-2.5">
              {regionsAndCities.map((location) => (
                <li key={location.id}>
                  <Link
                    href={`/locations/${location.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm transition-all"
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-paper-elevated)',
                      color: 'var(--color-fg)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                      e.currentTarget.style.color = 'var(--color-primary-700)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-fg)';
                    }}
                  >
                    <MapPin 
                      aria-hidden="true" 
                      className="size-3.5" 
                      style={{ color: 'var(--color-fg-subtle)' }}
                    />
                    {lt(location.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
