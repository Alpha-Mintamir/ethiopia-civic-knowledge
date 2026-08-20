import Link from "next/link";

export function Footer() {
  return (
    <footer 
      className="mt-20"
      style={{ 
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-paper-elevated)',
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display font-semibold" style={{ color: 'var(--color-fg)' }}>
            Menged
          </p>
          <p className="mt-2.5 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
            Community civic knowledge for Ethiopia. Official information cited, community experience labeled.
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="text-sm font-medium" style={{ color: 'var(--color-fg)' }}>Explore</p>
          <ul className="mt-2.5 space-y-2 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
            <li>
              <Link 
                className="transition-colors" 
                href="/processes"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Processes
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/documents"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Documents
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/directory"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Directory
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/offices"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Offices
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/pages"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Guides
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Participate">
          <p className="text-sm font-medium" style={{ color: 'var(--color-fg)' }}>Participate</p>
          <ul className="mt-2.5 space-y-2 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
            <li>
              <Link 
                className="transition-colors" 
                href="/contribute"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Contribute
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/contribute/new-page"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Suggest a guide
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/contribute/document"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Share a document
              </Link>
            </li>
            <li>
              <Link 
                className="transition-colors" 
                href="/register"
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
              >
                Create account
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-fg)' }}>
            About this information
          </p>
          <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
            Not a government site. Official content is cited; community content is labeled. 
            Always verify with the relevant office.
          </p>
        </div>
      </div>
      <div 
        className="py-4 text-center text-xs"
        style={{ 
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-fg-subtle)',
        }}
      >
        Built as civic infrastructure for Ethiopia
      </div>
    </footer>
  );
}
