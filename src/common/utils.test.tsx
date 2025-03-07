import { describe, it, expect } from "vitest";
import {
  convertTimestampToDate,
  getDateAndTimeString,
  getLastUpdatedString,
} from "./utils";

describe("utils", () => {
  describe("convertTimestampToDate", () => {
    it("should convert timestamp string to Date object", () => {
      const timestamp = "2024-03-20 15:30:45";
      const result = convertTimestampToDate(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2); // 0-based month (March = 2)
      expect(result.getDate()).toBe(20);
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });

    it("should handle timestamps with T separator", () => {
      const timestamp = "2024-03-20T15:30:45";
      const result = convertTimestampToDate(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(20);
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });
  });

  describe("getDateAndTimeString", () => {
    it("should format date object to localized string", () => {
      const date = new Date(2024, 2, 20, 15, 30, 45);
      const result = getDateAndTimeString(date);

      // Since the actual format depends on the locale, we'll check the general structure
      expect(result).toContain("2024");
      expect(result).toContain("3"); // Month (either as 3 or 03)
      expect(result).toContain("20");
      expect(result).toContain("3:30"); // Time in 12-hour format
      expect(result).toContain("PM"); // Afternoon time
      expect(result).toContain("-"); // Separator between date and time
    });

    it("should handle single digit values", () => {
      const date = new Date(2024, 0, 5, 9, 5, 5); // January 5, 2024 09:05:05
      const result = getDateAndTimeString(date);

      expect(result).toContain("2024");
      expect(result).toContain("1"); // Month (either as 1 or 01)
      expect(result).toContain("5");
      expect(result).toContain("9:05"); // Time in 12-hour format
      expect(result).toContain("AM"); // Morning time
      expect(result).toContain("-");
    });
  });

  describe("getLastUpdatedString", () => {
    it("should convert timestamp to formatted date string", () => {
      const timestamp = "2024-03-20 15:30:45";
      const result = getLastUpdatedString(timestamp);

      expect(result).toContain("2024");
      expect(result).toContain("3"); // Month (either as 3 or 03)
      expect(result).toContain("20");
      expect(result).toContain("3:30"); // Time in 12-hour format
      expect(result).toContain("PM"); // Afternoon time
      expect(result).toContain("-");
    });

    it("should handle timestamps with T separator", () => {
      const timestamp = "2024-03-20T15:30:45";
      const result = getLastUpdatedString(timestamp);

      expect(result).toContain("2024");
      expect(result).toContain("3");
      expect(result).toContain("20");
      expect(result).toContain("3:30"); // Time in 12-hour format
      expect(result).toContain("PM"); // Afternoon time
      expect(result).toContain("-");
    });
  });
});
