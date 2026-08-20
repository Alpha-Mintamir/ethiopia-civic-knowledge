import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Contribution Validation", () => {
  const contributionSchema = z.object({
    type: z.enum(["edit_page", "create_page", "submit_official_info", "submit_document"]),
    title: z.string().min(3).max(200),
    body: z.string().min(10),
    sourceUrl: z.string().url().optional(),
  });

  it("should validate valid contribution", () => {
    const valid = {
      type: "edit_page",
      title: "Test Page",
      body: "This is test content that is long enough",
      sourceUrl: "https://example.com",
    };

    const result = contributionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject short title", () => {
    const invalid = {
      type: "edit_page",
      title: "AB",
      body: "This is test content",
    };

    const result = contributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject short body", () => {
    const invalid = {
      type: "edit_page",
      title: "Test Page",
      body: "Short",
    };

    const result = contributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject invalid URL", () => {
    const invalid = {
      type: "edit_page",
      title: "Test Page",
      body: "This is test content",
      sourceUrl: "not-a-url",
    };

    const result = contributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should allow optional sourceUrl", () => {
    const valid = {
      type: "create_page",
      title: "Test Page",
      body: "This is test content",
    };

    const result = contributionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe("User Registration Validation", () => {
  const registrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(100),
  });

  it("should validate valid registration", () => {
    const valid = {
      email: "test@example.com",
      password: "securepass123",
      name: "Test User",
    };

    const result = registrationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalid = {
      email: "not-an-email",
      password: "securepass123",
      name: "Test User",
    };

    const result = registrationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const invalid = {
      email: "test@example.com",
      password: "short",
      name: "Test User",
    };

    const result = registrationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject short name", () => {
    const invalid = {
      email: "test@example.com",
      password: "securepass123",
      name: "A",
    };

    const result = registrationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("Process Fee Validation", () => {
  const feeSchema = z.object({
    label: z.string().min(1),
    amountMin: z.string().regex(/^\d+(\.\d{1,2})?$/),
    amountMax: z.string().regex(/^\d+(\.\d{1,2})?$/),
    currency: z.enum(["ETB", "USD", "EUR"]),
    kind: z.enum(["official", "community_reported", "unknown"]),
  });

  it("should validate official fee", () => {
    const valid = {
      label: "Registration fee",
      amountMin: "100.00",
      amountMax: "100.00",
      currency: "ETB",
      kind: "official",
    };

    const result = feeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should validate community fee", () => {
    const valid = {
      label: "Estimated fee",
      amountMin: "50.00",
      amountMax: "100.00",
      currency: "ETB",
      kind: "community_reported",
    };

    const result = feeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject invalid amount format", () => {
    const invalid = {
      label: "Test fee",
      amountMin: "invalid",
      amountMax: "100.00",
      currency: "ETB",
      kind: "official",
    };

    const result = feeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject invalid currency", () => {
    const invalid = {
      label: "Test fee",
      amountMin: "100.00",
      amountMax: "100.00",
      currency: "INVALID",
      kind: "official",
    };

    const result = feeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("Document Upload Validation", () => {
  const documentSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(500).optional(),
    docType: z.enum(["form", "template", "guide", "certificate"]),
    layer: z.enum(["official", "community"]),
    format: z.enum(["pdf", "docx", "xlsx"]),
  });

  it("should validate official document", () => {
    const valid = {
      title: "Official Form",
      description: "Test description",
      docType: "form",
      layer: "official",
      format: "pdf",
    };

    const result = documentSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should validate community template", () => {
    const valid = {
      title: "Community Template",
      docType: "template",
      layer: "community",
      format: "docx",
    };

    const result = documentSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject unsupported format", () => {
    const invalid = {
      title: "Test Document",
      docType: "form",
      layer: "official",
      format: "txt",
    };

    const result = documentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
