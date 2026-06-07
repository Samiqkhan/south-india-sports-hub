import { describe, it, expect } from "vitest";
import { tournaments } from "../data/tournaments";

describe("Tournaments Data Verification", () => {
  it("should have Chess Tournament 2026", () => {
    const chess = tournaments.find((t) => t.slug === "chess-tournament-2026");
    expect(chess).toBeDefined();
    expect(chess?.title).toBe("Chess Tournament 2026");
  });

  it("should have Tamilnadu Badminton Tournament 2026 with correct details", () => {
    const badminton = tournaments.find((t) => t.slug === "tamilnadu-badminton-tournament-2026");
    expect(badminton).toBeDefined();
    expect(badminton?.title).toBe("Tamilnadu Badminton tournament 2026");
    expect(badminton?.sport).toBe("Badminton");
    expect(badminton?.date).toBe("June 27 & 28, 2026");
    expect(badminton?.venue).toBe("SBM Shuttle Court, Sangagiri");
    expect(badminton?.lastDateToRegister).toBe("25.06.2026");
    
    // Check contact numbers
    expect(badminton?.contactNumbers).toContain("90800 60483");
    expect(badminton?.contactNumbers).toContain("90923 85001");
    
    // Check categories
    expect(badminton?.registrationCategories).toContain("Girls Singles");
    expect(badminton?.registrationCategories).toContain("Boys Singles");
    expect(badminton?.registrationCategories).toContain("Boys Open Singles");
    
    // Check age categories
    expect(badminton?.ageCategories).toContain("U-7");
    expect(badminton?.ageCategories).toContain("U-9");
    expect(badminton?.ageCategories).toContain("U-11");
    expect(badminton?.ageCategories).toContain("U-13");
    expect(badminton?.ageCategories).toContain("U-15");
    expect(badminton?.ageCategories).toContain("Open");
    
    // Check rules exist
    expect(badminton?.rules.length).toBeGreaterThan(0);
    
    // Check rewards exist
    expect(badminton?.rewards?.length).toBe(10);
    
    // Check player fees are defined for all categories
    expect(badminton?.playerFees?.length).toBe(10);
    badminton?.playerFees?.forEach((pf) => {
      expect(pf.fee).toBe("₹400");
    });
  });
});
