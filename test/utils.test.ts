import { describe, it, expect } from "vitest";

describe("Slug Generation", () => {
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  it("should convert to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("should replace spaces with hyphens", () => {
    expect(slugify("test page name")).toBe("test-page-name");
  });

  it("should remove special characters", () => {
    expect(slugify("test@page!name#")).toBe("testpagename");
  });

  it("should handle multiple spaces", () => {
    expect(slugify("test   page   name")).toBe("test-page-name");
  });

  it("should trim leading/trailing hyphens", () => {
    expect(slugify("-test-page-")).toBe("test-page");
  });

  it("should handle empty strings", () => {
    expect(slugify("")).toBe("");
  });

  it("should handle Amharic text", () => {
    // Amharic should be removed by special char filter
    const result = slugify("ሰላም test");
    expect(result).toBe("test");
  });
});

describe("Text Truncation", () => {
  const truncate = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.slice(0, length - 3) + "...";
  };

  it("should not truncate short text", () => {
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("should truncate long text", () => {
    const result = truncate("This is a very long text", 10);
    expect(result).toBe("This is...");
    expect(result.length).toBe(10);
  });

  it("should add ellipsis", () => {
    const result = truncate("Long text here", 10);
    expect(result.endsWith("...")).toBe(true);
  });

  it("should handle exact length", () => {
    expect(truncate("Exactly10!", 10)).toBe("Exactly10!");
  });

  it("should handle empty strings", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("Date Formatting", () => {
  it("should format ISO date", () => {
    const date = new Date("2024-01-15T10:30:00Z");
    expect(date.toISOString()).toContain("2024-01-15");
  });

  it("should handle current date", () => {
    const now = new Date();
    expect(now).toBeInstanceOf(Date);
  });

  it("should parse date strings", () => {
    const parsed = new Date("2024-01-01");
    expect(parsed.getFullYear()).toBe(2024);
    expect(parsed.getMonth()).toBe(0); // January
    expect(parsed.getDate()).toBe(1);
  });
});

describe("Markdown Utilities", () => {
  const markdownToPlainText = (md: string): string => {
    return md
      .replace(/^#{1,6}\s+/gm, "") // Headers
      .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
      .replace(/\*(.+?)\*/g, "$1") // Italic
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Links
      .replace(/`(.+?)`/g, "$1") // Inline code
      .trim();
  };

  it("should remove headers", () => {
    expect(markdownToPlainText("# Header")).toBe("Header");
    expect(markdownToPlainText("## Header")).toBe("Header");
  });

  it("should remove bold formatting", () => {
    expect(markdownToPlainText("**bold text**")).toBe("bold text");
  });

  it("should remove italic formatting", () => {
    expect(markdownToPlainText("*italic text*")).toBe("italic text");
  });

  it("should extract link text", () => {
    expect(markdownToPlainText("[link text](https://example.com)")).toBe("link text");
  });

  it("should remove inline code", () => {
    expect(markdownToPlainText("`code`")).toBe("code");
  });

  it("should handle mixed formatting", () => {
    const result = markdownToPlainText("# Title with **bold** and *italic*");
    expect(result).toContain("Title with bold and italic");
  });
});
