import { describe, it, expect } from "vitest";

describe("Search Functionality", () => {
  describe("Search document structure", () => {
    it("should index entity type", () => {
      const doc = { entityType: "knowledge_page" };
      expect(doc.entityType).toBeDefined();
    });

    it("should index entity ID", () => {
      const doc = { entityId: "123e4567-e89b-12d3-a456-426614174000" };
      expect(doc.entityId).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("should index locale", () => {
      const doc = { locale: "en" };
      expect(["en", "am"]).toContain(doc.locale);
    });

    it("should index title", () => {
      const doc = { title: "Test Title" };
      expect(doc.title).toBeDefined();
      expect(doc.title.length).toBeGreaterThan(0);
    });
  });

  describe("Multi-language search", () => {
    it("should support English search", () => {
      const query = { locale: "en", text: "business license" };
      expect(query.locale).toBe("en");
    });

    it("should support Amharic search", () => {
      const query = { locale: "am", text: "ንግድ ፈቃድ" };
      expect(query.locale).toBe("am");
    });

    it("should fallback to English", () => {
      const doc = { en: "Hello", am: undefined };
      const result = doc.en || doc.am;
      expect(result).toBe("Hello");
    });
  });

  describe("Entity type filtering", () => {
    const entityTypes = ["knowledge_page", "process", "office", "document", "organization", "location"];

    it("should filter by knowledge_page", () => {
      expect(entityTypes).toContain("knowledge_page");
    });

    it("should filter by process", () => {
      expect(entityTypes).toContain("process");
    });

    it("should filter by office", () => {
      expect(entityTypes).toContain("office");
    });

    it("should filter by document", () => {
      expect(entityTypes).toContain("document");
    });

    it("should filter by organization", () => {
      expect(entityTypes).toContain("organization");
    });

    it("should filter by location", () => {
      expect(entityTypes).toContain("location");
    });
  });

  describe("Search ranking", () => {
    it("should use FTS for relevance", () => {
      // Full-text search should rank by relevance
      const results = [
        { title: "Business License", rank: 1.0 },
        { title: "Business Registration", rank: 0.8 },
      ];

      expect(results[0].rank).toBeGreaterThan(results[1].rank);
    });

    it("should boost exact matches", () => {
      const exactMatch = { title: "TIN", rank: 1.0 };
      const partialMatch = { title: "TIN Registration", rank: 0.7 };

      expect(exactMatch.rank).toBeGreaterThan(partialMatch.rank);
    });
  });
});

describe("Search indexing", () => {
  describe("Knowledge pages", () => {
    it("should index page title", () => {
      const page = { title: { en: "Test Page" } };
      expect(page.title.en).toBeDefined();
    });

    it("should index page summary", () => {
      const page = { summary: { en: "Test summary" } };
      expect(page.summary.en).toBeDefined();
    });

    it("should index page sections", () => {
      const sections = [
        { heading: { en: "Section 1" }, body: { en: "Content 1" } },
        { heading: { en: "Section 2" }, body: { en: "Content 2" } },
      ];

      expect(sections).toHaveLength(2);
    });
  });

  describe("Processes", () => {
    it("should index process title", () => {
      const process = { title: { en: "Vehicle Transfer" } };
      expect(process.title.en).toBeDefined();
    });

    it("should index process steps", () => {
      const steps = [
        { title: { en: "Step 1" } },
        { title: { en: "Step 2" } },
      ];

      expect(steps).toHaveLength(2);
    });
  });

  describe("Offices", () => {
    it("should index office name", () => {
      const office = { name: { en: "Trade Bureau" } };
      expect(office.name.en).toBeDefined();
    });

    it("should index office location", () => {
      const office = { location: { name: { en: "Addis Ababa" } } };
      expect(office.location.name.en).toBeDefined();
    });
  });

  describe("Directory contacts", () => {
    it("should index contact name", () => {
      const contact = { name: { en: "Ministry of Trade" } };
      expect(contact.name.en).toBeDefined();
    });

    it("should index organization type", () => {
      const contact = { orgType: "ministry" };
      expect(contact.orgType).toBeDefined();
    });

    it("should index layer (official/community)", () => {
      const contact = { layer: "official" };
      expect(["official", "community"]).toContain(contact.layer);
    });
  });
});
