import { describe, it, expect } from "vitest";
import { getInitials } from "../utils/format";

describe("getInitials", () => {
  it("returns initials of first and last name", () => {
    expect(getInitials("Ram Bahadur")).toBe("RB");
  });

  it("returns single initial for one-word names", () => {
    expect(getInitials("Sita")).toBe("S");
  });

  it("uppercases the result", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("returns ? for empty or missing names", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials()).toBe("?");
    expect(getInitials("   ")).toBe("?");
  });

  it("handles extra whitespace", () => {
    expect(getInitials("  Ram   Bahadur  ")).toBe("RB");
  });
});
