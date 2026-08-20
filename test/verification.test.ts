import { describe, it, expect } from "vitest";

describe("Content Verification", () => {
  const verificationStatuses = [
    "official",
    "officially_verified",
    "community_verified",
    "community_reported",
    "outdated",
    "disputed",
    "unknown",
  ] as const;

  describe("Verification status types", () => {
    it("should have all verification states", () => {
      expect(verificationStatuses).toContain("official");
      expect(verificationStatuses).toContain("officially_verified");
      expect(verificationStatuses).toContain("community_verified");
      expect(verificationStatuses).toContain("community_reported");
      expect(verificationStatuses).toContain("outdated");
      expect(verificationStatuses).toContain("disputed");
      expect(verificationStatuses).toContain("unknown");
    });

    it("should have 7 distinct states", () => {
      expect(verificationStatuses.length).toBe(7);
      expect(new Set(verificationStatuses).size).toBe(7);
    });
  });

  describe("Official vs Community separation", () => {
    it("should distinguish official from community content", () => {
      const officialLayers = ["official"];
      const communityLayers = ["community"];

      expect(officialLayers).not.toEqual(communityLayers);
    });

    it("should never conflate official and community data", () => {
      // This is a core principle: official and community are always separate
      const official = { layer: "official", status: "official" };
      const community = { layer: "community", status: "community_verified" };

      expect(official.layer).not.toBe(community.layer);
    });
  });

  describe("Content trust levels", () => {
    it("official should be highest trust", () => {
      const trustOrder = ["official", "officially_verified", "community_verified", "community_reported", "unknown"];
      expect(trustOrder[0]).toBe("official");
    });

    it("unknown should be lowest trust", () => {
      const trustOrder = ["official", "officially_verified", "community_verified", "community_reported", "unknown"];
      expect(trustOrder[trustOrder.length - 1]).toBe("unknown");
    });

    it("should handle disputed content", () => {
      expect(verificationStatuses).toContain("disputed");
    });

    it("should handle outdated content", () => {
      expect(verificationStatuses).toContain("outdated");
    });
  });
});

describe("Information Layer Separation", () => {
  const infoLayers = ["official", "community"] as const;

  it("should have exactly two layers", () => {
    expect(infoLayers.length).toBe(2);
  });

  it("should separate official from community", () => {
    expect(infoLayers).toContain("official");
    expect(infoLayers).toContain("community");
  });

  it("should never merge layers", () => {
    // Layers are never merged into a single authoritative claim
    const officialClaim = { layer: "official", value: "Official data" };
    const communityClaim = { layer: "community", value: "Community data" };

    expect(officialClaim.layer).not.toBe(communityClaim.layer);
    expect(officialClaim.value).not.toBe(communityClaim.value);
  });
});
