import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/account");
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 
        className="font-display text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--color-fg)' }}
      >
        Sign in
      </h1>
      <p className="mt-2 mb-8 text-sm leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
        Sign in to contribute, suggest edits, and share documents.
      </p>
      <LoginForm next={next} />
      <p className="mt-6 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
        New here?{" "}
        <Link 
          href="/register" 
          className="font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-primary-600)' }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
