import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

/**
 * Shared validator used by downstream forms (Fees, Alot, Admit Card,
 * Certificate, Marksheet) to make sure the Student ID typed/selected
 * in the form actually matches a registered student in student_profiles,
 * and — when applicable — that the course (and fee for Fees) in the
 * form still matches what's on file for that student.
 *
 * Returns { ok: true, student } or { ok: false, message }.
 * Callers should `toast.error(result.message)` and return early.
 */

export const studentIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Please pick a student from the Student ID picker." })
  .max(50, { message: "Student ID looks invalid." });

export interface ValidatedStudent {
  id: string;
  student_id: string;
  full_name: string;
  course_name: string | null;
  course_fees: string | null;
}

export interface ValidateOptions {
  studentId: string;
  /** When provided, the form's current course must match the student's course. */
  expectedCourse?: string;
  /** When provided, the form's current total fee must match the student's course_fees. */
  expectedFee?: string | number;
}

export type ValidateResult =
  | { ok: true; student: ValidatedStudent }
  | { ok: false; message: string };

export async function validateStudentSelection(
  opts: ValidateOptions
): Promise<ValidateResult> {
  const parsed = studentIdSchema.safeParse(opts.studentId);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid Student ID." };
  }

  const { data, error } = await (supabase as any)
    .from("student_profiles")
    .select("id, student_id, full_name, course_name, course_fees, status")
    .eq("student_id", parsed.data)
    .maybeSingle();

  if (error) {
    return { ok: false, message: "Could not verify Student ID. Please try again." };
  }
  if (!data) {
    return {
      ok: false,
      message: `Student ID "${parsed.data}" is not registered. Pick a student from the dropdown.`,
    };
  }
  if (data.status && data.status !== "active") {
    return { ok: false, message: `Student "${data.full_name}" is not active.` };
  }

  if (opts.expectedCourse !== undefined) {
    const formCourse = (opts.expectedCourse ?? "").trim();
    const dbCourse = (data.course_name ?? "").trim();
    if (formCourse && dbCourse && formCourse !== dbCourse) {
      return {
        ok: false,
        message: `Course mismatch: form says "${formCourse}" but student is registered for "${dbCourse}". Re-pick the student to refresh.`,
      };
    }
  }

  if (opts.expectedFee !== undefined && opts.expectedFee !== "" && opts.expectedFee !== null) {
    const a = Number(opts.expectedFee);
    const b = Number(data.course_fees);
    if (!Number.isNaN(a) && !Number.isNaN(b) && a !== b) {
      return {
        ok: false,
        message: `Fee mismatch: form total ₹${a} doesn't match registered course fee ₹${b}. Re-pick the student to refresh.`,
      };
    }
  }

  return {
    ok: true,
    student: {
      id: data.id,
      student_id: data.student_id,
      full_name: data.full_name,
      course_name: data.course_name ?? null,
      course_fees: data.course_fees ?? null,
    },
  };
}