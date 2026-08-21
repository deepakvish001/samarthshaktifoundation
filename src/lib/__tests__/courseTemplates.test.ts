import { describe, it, expect } from "vitest";
import { calcGrade, subjectTotal, courseTotalMax, COURSE_TEMPLATES, COURSE_LIST } from "../courseTemplates";

describe("calcGrade", () => {
  it.each([
    [100, "A+"],
    [90, "A+"],
    [89, "A"],
    [80, "A"],
    [79, "B+"],
    [70, "B+"],
    [69, "B"],
    [60, "B"],
    [59, "C"],
    [50, "C"],
    [49, "D"],
    [40, "D"],
    [39, "F"],
    [0, "F"],
  ])("calcGrade(%d) -> %s", (pct, expected) => {
    expect(calcGrade(pct)).toBe(expected);
  });
});

describe("subjectTotal / courseTotalMax", () => {
  it("sums theory + practical for a single subject", () => {
    expect(subjectTotal({ name: "X", theoryMax: 70, practicalMax: 30 })).toBe(100);
    expect(subjectTotal({ name: "Typing", theoryMax: 0, practicalMax: 100 })).toBe(100);
  });

  it("sums every subject's total for a course", () => {
    const total = courseTotalMax(COURSE_TEMPLATES.DCA);
    const expected = COURSE_TEMPLATES.DCA.subjects.reduce(
      (sum, s) => sum + s.theoryMax + s.practicalMax,
      0,
    );
    expect(total).toBe(expected);
    expect(total).toBe(500); // 5 subjects x (70+30)
  });
});

describe("COURSE_TEMPLATES data integrity", () => {
  it("every template's code matches its object key", () => {
    for (const [key, tpl] of Object.entries(COURSE_TEMPLATES)) {
      expect(tpl.code).toBe(key);
    }
  });

  it("every template has at least one subject", () => {
    for (const tpl of COURSE_LIST) {
      expect(tpl.subjects.length).toBeGreaterThan(0);
    }
  });

  it("passing percentages are within 0-100", () => {
    for (const tpl of COURSE_LIST) {
      expect(tpl.passingTheoryPct).toBeGreaterThanOrEqual(0);
      expect(tpl.passingTheoryPct).toBeLessThanOrEqual(100);
      expect(tpl.passingPracticalPct).toBeGreaterThanOrEqual(0);
      expect(tpl.passingPracticalPct).toBeLessThanOrEqual(100);
    }
  });

  it("COURSE_LIST contains exactly the values of COURSE_TEMPLATES", () => {
    expect(COURSE_LIST).toHaveLength(Object.keys(COURSE_TEMPLATES).length);
    expect(new Set(COURSE_LIST.map((c) => c.code))).toEqual(
      new Set(Object.keys(COURSE_TEMPLATES)),
    );
  });
});
