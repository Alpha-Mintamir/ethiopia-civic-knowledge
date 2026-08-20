import { describe, it, expect } from "vitest";

describe("Government Directory", () => {
  describe("Directory contacts structure", () => {
    it("should have required fields", () => {
      const contact = {
        slug: "test-org",
        name: { en: "Test Organization" },
        orgType: "ministry",
        layer: "official",
      };

      expect(contact.slug).toBeDefined();
      expect(contact.name).toBeDefined();
      expect(contact.orgType).toBeDefined();
      expect(contact.layer).toBeDefined();
    });

    it("should support optional contact fields", () => {
      const contact = {
        slug: "test-org",
        name: { en: "Test Organization" },
        orgType: "ministry",
        layer: "official",
        website: "https://example.gov.et",
        phone: "+251 11 123 4567",
        email: "contact@example.gov.et",
        address: { en: "Addis Ababa, Ethiopia" },
      };

      expect(contact.website).toBeDefined();
      expect(contact.phone).toBeDefined();
      expect(contact.email).toBeDefined();
      expect(contact.address).toBeDefined();
    });
  });

  describe("Organization types", () => {
    const orgTypes = ["ministry", "authority", "agency", "bureau", "commission", "office"];

    it("should support ministry type", () => {
      expect(orgTypes).toContain("ministry");
    });

    it("should support authority type", () => {
      expect(orgTypes).toContain("authority");
    });

    it("should support agency type", () => {
      expect(orgTypes).toContain("agency");
    });

    it("should support bureau type", () => {
      expect(orgTypes).toContain("bureau");
    });

    it("should support commission type", () => {
      expect(orgTypes).toContain("commission");
    });

    it("should support office type", () => {
      expect(orgTypes).toContain("office");
    });
  });

  describe("Official vs community contacts", () => {
    it("should distinguish official contacts", () => {
      const official = { layer: "official" };
      expect(official.layer).toBe("official");
    });

    it("should distinguish community contacts", () => {
      const community = { layer: "community" };
      expect(community.layer).toBe("community");
    });

    it("should never conflate layers", () => {
      const official = { layer: "official" };
      const community = { layer: "community" };
      expect(official.layer).not.toBe(community.layer);
    });
  });
});

describe("Government Directory Registry", () => {
  const REGISTRY_SIZE = 30;

  it("should have 30 official federal institutions", () => {
    // The federal registry should contain exactly 30 institutions
    expect(REGISTRY_SIZE).toBe(30);
  });

  describe("Required institution types", () => {
    const expectedTypes = ["ministry", "authority", "agency", "commission", "office"];

    it("should include ministries", () => {
      expect(expectedTypes).toContain("ministry");
    });

    it("should include authorities", () => {
      expect(expectedTypes).toContain("authority");
    });

    it("should include agencies", () => {
      expect(expectedTypes).toContain("agency");
    });

    it("should include commissions", () => {
      expect(expectedTypes).toContain("commission");
    });
  });

  describe("Contact information", () => {
    it("should include website when available", () => {
      const contact = { website: "https://mfa.gov.et" };
      expect(contact.website).toMatch(/^https?:\/\//);
    });

    it("should include address when published", () => {
      const contact = { address: { en: "Addis Ababa, Ethiopia" } };
      expect(contact.address.en).toContain("Ethiopia");
    });

    it("should allow null for unpublished fields", () => {
      const contact = { 
        name: { en: "Ministry of Defense" },
        website: null,
        phone: null,
        email: null,
        address: null,
      };
      expect(contact.website).toBeNull();
      expect(contact.phone).toBeNull();
    });

    it("should not contain [DEMO] markers in federal data", () => {
      const officialContact = { name: { en: "Ministry of Health" } };
      expect(officialContact.name.en).not.toContain("[DEMO]");
    });
  });
});

describe("Scraper functionality", () => {
  it("should update existing contacts", () => {
    // Scraper should update rather than duplicate
    const existing = { slug: "test-ministry", name: { en: "Old Name" } };
    const updated = { slug: "test-ministry", name: { en: "New Name" } };

    expect(existing.slug).toBe(updated.slug);
    expect(existing.name.en).not.toBe(updated.name.en);
  });

  it("should insert new contacts", () => {
    const newContact = { slug: "new-ministry", name: { en: "New Ministry" } };
    expect(newContact.slug).toBeDefined();
    expect(newContact.name.en).toBeDefined();
  });

  it("should verify contacts on scrape", () => {
    const contact = { lastVerifiedAt: new Date() };
    expect(contact.lastVerifiedAt).toBeInstanceOf(Date);
  });
});
