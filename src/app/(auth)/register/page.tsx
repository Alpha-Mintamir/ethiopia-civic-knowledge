import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 
        className="font-display text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--color-fg)' }}
      >
        Create an account
      </h1>
      <p className="mt-2 mb-8 text-sm leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
        Help keep civic information accurate for everyone. All contributions are reviewed before publishing.
      </p>
      <RegisterForm />
      <p className="mt-6 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-medium transition-colors"
          style={{ color: 'var(--color-primary-600)' }}
          onMouseOver={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
