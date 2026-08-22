import { describe, it, expect } from "vitest";
import {
  ORDER_STATUSES,
  getStatusBadgeClass,
  getStatusSolidClass,
  getStatusBorderedClass,
  getStatusStorefrontClass,
  getOrderStatusChartColor,
} from "../utils/orderStatus";

describe("orderStatus utils", () => {
  it("covers all five order statuses", () => {
    expect(ORDER_STATUSES).toEqual([
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ]);
  });

  it("returns badge class for a known status", () => {
    expect(getStatusBadgeClass("Pending")).toBe(
      "bg-yellow-100 text-yellow-700"
    );
  });

  it("falls back for unknown status", () => {
    expect(getStatusBadgeClass("Unknown")).toBe("bg-gray-100 text-gray-600");
    expect(getStatusSolidClass("Unknown")).toBe("bg-gray-500");
    expect(getStatusBorderedClass("Unknown")).toBe(
      "bg-gray-100 text-gray-600"
    );
    expect(getStatusStorefrontClass("Unknown")).toBe(
      "bg-[#EADFC8] text-[#1D1512]"
    );
    expect(getOrderStatusChartColor("Unknown")).toBe("#6b7280");
  });

  it("supports custom fallbacks", () => {
    expect(getStatusBadgeClass("Nope", "custom-class")).toBe("custom-class");
  });

  it("returns solid classes with white text variants", () => {
    expect(getStatusSolidClass("Delivered")).toBe("bg-green-500");
    expect(getStatusSolidClass("Cancelled")).toBe("bg-red-500");
  });

  it("returns chart hex colors", () => {
    expect(getOrderStatusChartColor("Pending")).toBe("#eab308");
    expect(getOrderStatusChartColor("Delivered")).toBe("#15803d");
  });
});
