import { describe, it, expect } from "vitest";
import { en, enAm, lt, type LocalizedText } from "@/lib/i18n";

describe("i18n Utilities", () => {
  describe("en() helper", () => {
    it("should create English-only localized text", () => {
      const text = en("Hello");
      expect(text).toEqual({ en: "Hello" });
    });

    it("should handle empty strings", () => {
      const text = en("");
      expect(text).toEqual({ en: "" });
    });

    it("should create distinct objects", () => {
      const text1 = en("Test");
      const text2 = en("Test");
      expect(text1).not.toBe(text2);
      expect(text1).toEqual(text2);
    });
  });

  describe("enAm() helper", () => {
    it("should create bilingual localized text", () => {
      const text = enAm("Hello", "ሰላም");
      expect(text).toEqual({ en: "Hello", am: "ሰላም" });
    });

    it("should handle empty Amharic", () => {
      const text = enAm("Hello", "");
      expect(text.en).toBe("Hello");
      // enAm may omit empty am field
    });

    it("should preserve both languages", () => {
      const text = enAm("Ethiopia", "ኢትዮጵያ");
      expect(text.en).toBe("Ethiopia");
      expect(text.am).toBe("ኢትዮጵያ");
    });
  });

  describe("lt() helper", () => {
    it("should extract English text", () => {
      const text = en("Test");
      expect(lt(text)).toBe("Test");
    });

    it("should extract Amharic when specified", () => {
      const text = enAm("Test", "ሙከራ");
      expect(lt(text, "am")).toBe("ሙከራ");
    });

    it("should fallback to English when Amharic missing", () => {
      const text = en("Test");
      expect(lt(text, "am")).toBe("Test");
    });

    it("should default to English locale", () => {
      const text = enAm("Hello", "ሰላም");
      expect(lt(text)).toBe("Hello");
    });

    it("should handle empty strings", () => {
      const text = en("");
      expect(lt(text)).toBe("");
    });

    it("should prioritize requested locale", () => {
      const text: LocalizedText = { en: "English", am: "አማርኛ" };
      expect(lt(text, "en")).toBe("English");
      expect(lt(text, "am")).toBe("አማርኛ");
    });
  });
});
