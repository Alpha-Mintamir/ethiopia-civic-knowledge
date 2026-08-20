import Link from "next/link";
import { Landmark } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { canModerate, hasPermission, ROLE_LABELS } from "@/lib/auth/permissions";
import { MobileNav } from "./mobile-nav";

const NAV_ITEMS = [
  { href: "/processes", label: "Processes" },
  { href: "/documents", label: "Documents" },
  { href: "/directory", label: "Directory" },
  { href: "/offices", label: "Offices" },
  { href: "/pages", label: "Guides" },
  { href: "/locations", label: "Locations" },
];

export async function Header() {
  const user = await getCurrentUser();
  const showModeration = canModerate(user?.role);
  const showAdmin = hasPermission(user?.role, "admin:access_dashboard");

  return (
    <header 
      className="sticky top-0 z-40 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(246, 245, 242, 0.85)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link 
          href="/" 
          className="flex shrink-0 items-center gap-2.5"
          style={{ color: 'var(--color-fg)' }}
        >
          <Landmark aria-hidden="true" className="size-5" style={{ color: 'var(--color-primary-600)' }} />
          <span className="text-base font-display font-semibold tracking-tight">
            Menged
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm transition-colors hover-bg-elevated hover-text-fg"
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-fg-muted)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/search"
            className="hidden text-sm hover-bg-elevated sm:block"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-fg-muted)',
            }}
          >
            Search
          </Link>
          <Link
            href="/contribute"
            className="hidden text-sm font-medium hover-bg-primary-700 sm:block"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--color-paper-elevated)',
            }}
          >
            Contribute
          </Link>
          {user ? (
            <details className="group relative">
              <summary 
                className="flex cursor-pointer list-none items-center gap-2 text-sm [&::-webkit-details-marker]:hidden"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-fg)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center text-xs font-semibold"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-primary-600)',
                    color: 'var(--color-paper-elevated)',
                  }}
                >
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate lg:block">{user.name}</span>
              </summary>
              <div 
                className="absolute right-0 z-50 mt-2 w-56 py-1 shadow-lg"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-elevated)',
                }}
              >
                <div 
                  className="px-3 py-2.5"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <p className="truncate text-sm font-medium" style={{ color: 'var(--color-fg)' }}>
                    {user.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
                <Link 
                  href="/account" 
                  className="block px-3 py-2 text-sm hover-bg-muted"
                  style={{ color: 'var(--color-fg-muted)' }}
                >
                  My contributions
                </Link>
                {showModeration ? (
                  <Link
                    href="/moderation"
                    className="block px-3 py-2 text-sm hover-bg-muted"
                    style={{ color: 'var(--color-fg-muted)' }}
                  >
                    Moderation queue
                  </Link>
                ) : null}
                {showAdmin ? (
                  <Link 
                    href="/admin" 
                    className="block px-3 py-2 text-sm hover-bg-muted"
                    style={{ color: 'var(--color-fg-muted)' }}
                  >
                    Admin dashboard
                  </Link>
                ) : null}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="block w-full px-3 py-2 text-left text-sm hover-bg-muted"
                    style={{ color: 'var(--color-fg-muted)' }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium hover-bg-elevated"
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border-strong)',
                color: 'var(--color-fg)',
              }}
            >
              Sign in
            </Link>
          )}
          <MobileNav items={NAV_ITEMS} isSignedIn={user !== null} />
        </div>
      </div>
    </header>
  );
}
