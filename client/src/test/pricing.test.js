import { describe, it, expect } from "vitest";
import {
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  getDeliveryFee,
} from "../utils/pricing";

describe("getDeliveryFee", () => {
  it("charges full fee below the threshold", () => {
    expect(getDeliveryFee(0)).toBe(DELIVERY_FEE);
    expect(getDeliveryFee(500)).toBe(DELIVERY_FEE);
    expect(getDeliveryFee(999)).toBe(DELIVERY_FEE);
  });

  it("is free at exactly the threshold (boundary)", () => {
    expect(getDeliveryFee(FREE_DELIVERY_THRESHOLD)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(getDeliveryFee(1001)).toBe(0);
    expect(getDeliveryFee(2500)).toBe(0);
  });

  it("threshold is 1000 and fee is 100", () => {
    expect(FREE_DELIVERY_THRESHOLD).toBe(1000);
    expect(DELIVERY_FEE).toBe(100);
  });
});
