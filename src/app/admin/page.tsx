import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  FileText,
  Flag,
  Inbox,
  Route,
  ScrollText,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { listRecentDecisions } from "@/lib/services/moderation";
import { getAdminStats, listMostReported } from "@/lib/services/stats";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!hasPermission(user.role, "admin:access_dashboard")) redirect("/");

  const [stats, mostReported, recentDecisions] = await Promise.all([
    getAdminStats(),
    listMostReported(),
    listRecentDecisions(10),
  ]);

  const metricCards = [
    { label: "Published guides", value: stats.totalPages, icon: ScrollText },
    { label: "Processes", value: stats.totalProcesses, icon: Route },
    { label: "Offices", value: stats.totalOffices, icon: Building2 },
    { label: "Documents", value: stats.totalDocuments, icon: FileText },
    { label: "Pending contributions", value: stats.pendingContributions, icon: Inbox, href: "/moderation" },
    { label: "Pending documents", value: stats.pendingDocuments, icon: FileText, href: "/moderation" },
    { label: "Open reports", value: stats.openFlags, icon: Flag, href: "/moderation" },
    { label: "Unverified pages", value: stats.unverifiedPages, icon: AlertTriangle },
    { label: "Outdated items", value: stats.outdatedItems, icon: AlertTriangle },
    { label: "Active contributors (30d)", value: stats.activeContributors30d, icon: Users },
    { label: "Total users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Admin" }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 
          className="font-display text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--color-fg)' }}
        >
          Admin dashboard
        </h1>
        <nav aria-label="Admin sections" className="flex flex-wrap gap-2.5 text-sm">
          <Link
            href="/moderation"
            className="font-medium transition-all"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-elevated)',
              color: 'var(--color-fg)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-muted)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-elevated)';
            }}
          >
            Moderation
          </Link>
          <Link
            href="/admin/users"
            className="font-medium transition-all"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-elevated)',
              color: 'var(--color-fg)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-muted)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-elevated)';
            }}
          >
            Users
          </Link>
          <Link
            href="/admin/sources"
            className="font-medium transition-all"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-elevated)',
              color: 'var(--color-fg)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-muted)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-paper-elevated)';
            }}
          >
            Sources
          </Link>
        </nav>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const body = (
            <>
              <metric.icon 
                aria-hidden="true" 
                className="size-4" 
                style={{ color: 'var(--color-fg-subtle)' }}
              />
              <p 
                className="mt-3 font-display text-2xl font-semibold"
                style={{ color: 'var(--color-fg)' }}
              >
                {metric.value}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                {metric.label}
              </p>
            </>
          );
          return metric.href ? (
            <Link
              key={metric.label}
              href={metric.href}
              className="transition-all"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-elevated)',
                padding: '16px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary-600)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              {body}
            </Link>
          ) : (
            <div 
              key={metric.label}
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-elevated)',
                padding: '16px',
              }}
            >
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most reported content</CardTitle>
          </CardHeader>
          <CardContent>
            {mostReported.length === 0 ? (
              <p className="py-4 text-center text-sm text-stone-500">No open reports.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {mostReported.map((row) => (
                  <li
                    key={`${row.entityType}-${row.entityId}`}
                    className="flex items-center gap-3 py-2.5 text-sm"
                  >
                    <Badge variant="danger">{row.reportCount}</Badge>
                    <span className="text-stone-700 capitalize">
                      {row.entityType.replace("_", " ")}
                    </span>
                    <code className="ml-auto text-xs text-stone-400">
                      {row.entityId.slice(0, 8)}…
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent moderation decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDecisions.length === 0 ? (
              <p className="py-4 text-center text-sm text-stone-500">No decisions yet.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {recentDecisions.map(({ contribution, authorName }) => (
                  <li key={contribution.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <Badge
                      variant={
                        contribution.status === "approved"
                          ? "success"
                          : contribution.status === "rejected"
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {contribution.status.replace("_", " ")}
                    </Badge>
                    <span className="min-w-0 flex-1 truncate text-stone-700">
                      {contribution.type.replace("_", " ")} by {authorName}
                    </span>
                    <span className="text-xs text-stone-400">
                      {contribution.decidedAt ? formatDate(contribution.decidedAt) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
