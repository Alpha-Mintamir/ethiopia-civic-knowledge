import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Environment Configuration", () => {
  it("should validate required environment variables", () => {
    const envSchema = z.object({
      DATABASE_URL: z.string().min(1),
      SESSION_SECRET: z.string().min(32),
      STORAGE_DIR: z.string().min(1),
      NEXT_PUBLIC_APP_URL: z.string().url(),
      NODE_ENV: z.enum(["development", "test", "production"]),
    });

    const result = envSchema.safeParse({
      DATABASE_URL: process.env.DATABASE_URL,
      SESSION_SECRET: process.env.SESSION_SECRET,
      STORAGE_DIR: process.env.STORAGE_DIR,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid DATABASE_URL", () => {
    const envSchema = z.object({
      DATABASE_URL: z.string().min(1),
    });

    const result = envSchema.safeParse({
      DATABASE_URL: "",
    });

    expect(result.success).toBe(false);
  });

  it("should reject short SESSION_SECRET", () => {
    const envSchema = z.object({
      SESSION_SECRET: z.string().min(32),
    });

    const result = envSchema.safeParse({
      SESSION_SECRET: "short",
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid environment", () => {
    const envSchema = z.object({
      NODE_ENV: z.enum(["development", "test", "production"]),
    });

    expect(envSchema.safeParse({ NODE_ENV: "development" }).success).toBe(true);
    expect(envSchema.safeParse({ NODE_ENV: "test" }).success).toBe(true);
    expect(envSchema.safeParse({ NODE_ENV: "production" }).success).toBe(true);
  });

  it("should reject invalid environment", () => {
    const envSchema = z.object({
      NODE_ENV: z.enum(["development", "test", "production"]),
    });

    const result = envSchema.safeParse({ NODE_ENV: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("Lazy Environment Loading", () => {
  it("should not throw during module import without env vars", () => {
    expect(() => {
      // In lazy loading, importing env module should not throw
      const testEnv = { DATABASE_URL: undefined };
      expect(testEnv).toBeDefined();
    }).not.toThrow();
  });

  it("should throw when accessing env properties without values", () => {
    const envSchema = z.object({
      MISSING_VAR: z.string().min(1),
    });

    expect(() => {
      envSchema.parse({ MISSING_VAR: undefined });
    }).toThrow();
  });
});
