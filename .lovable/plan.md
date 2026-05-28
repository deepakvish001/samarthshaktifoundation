# Auto Certificate & Marksheet Generator (ADCA / DCA / Typing)

Build a single dynamic admin tool where selecting **Course** + **Student** auto-fills everything (personal details, subjects, max marks, photo, signatures, dates), admin only enters obtained marks, and a print-ready **Certificate + Marksheet PDF** is generated with one click.

## 1. Course templates (hard-coded, central config)

New file `src/lib/courseTemplates.ts` exposing a registry:

```text
ADCA  → 1 Year   → 8 subjects (theory+practical), total 800
DCA   → 6 Months → 5 subjects (theory+practical), total 500
Typing → 3 Months → English Typing (100), Hindi Typing (100), Theory (50), Practical (50) — total 300
```

Each entry stores: `code, fullName, duration, subjects[{name, theoryMax, practicalMax}], totalMax, certificateTitle`. Adding a new course later = one entry in this file.

## 2. Student auto-fill source

Reuse existing `student_profiles` table (full_name, email, phone, course_name) plus pull father/mother/DOB/photo from `alot_numbers` when a matching `student_id` exists. A `Student` combobox (searchable) on the form returns one record and fills: Student ID, Name, Father Name, Mother Name, DOB, Photo, Center.

If student not found in DB, admin can switch to **Manual mode** toggle and type the personal fields.

## 3. New admin page: `Auto Certificate & Marksheet`

Route: `/admin/auto-generate` (new sidebar entry under Certificates section).
Component: `src/components/admin/AutoGenerateContent.tsx`.

### Form layout (top → bottom)
1. **Course** dropdown → ADCA / DCA / Typing → on change, subjects table renders auto.
2. **Student** searchable combobox (or Manual toggle) → personal fields auto-fill.
3. **Subjects marks table** (auto-generated rows): each row shows `Subject | Theory Max | Theory Obtained | Practical Max | Practical Obtained`. Admin only types obtained values.
4. **Auto-calculated**: total obtained, total max, percentage, grade (A+/A/B+/B/C/F), result (pass/fail with per-subject min check).
5. **Other fields** auto-defaulted, editable: Certificate Number (auto `SSF/<COURSE>/<YYYY>/<seq>`), Issue Date (today), Place, Examination Date.
6. **Director signature + Foundation seal**: pulled from `director_messages.photo` and a static `/public/seal.png`. Editable upload override.
7. Buttons: `Save to Database`, `Preview Certificate`, `Preview Marksheet`, `Download Both PDF`.

## 4. PDF generation

Use `jspdf` + `html2canvas` (already a typical pattern; will add via `bun add jspdf html2canvas`).

- Two printable templates as hidden React components: `CertificateTemplate.tsx` and `MarksheetTemplate.tsx` styled with Tailwind, A4 size, gold borders, Samarth Shakti Foundation logo (from `public/favicon.png`), student photo, signatures, seal.
- `Download Both PDF` renders both templates off-screen, captures each with html2canvas, builds a 2-page PDF, triggers download named `<StudentID>_<Course>_Certificate.pdf`.
- `Preview` opens a modal with the same template.

## 5. Database persistence

On `Save to Database` the same submission writes to existing tables (no schema change needed):
- `certificate_management` (one row) — student_id, student_name, course_name, certificate_number, issue_date, completion_date, grade, status='active'.
- `marksheet_management` (one row) — same student, roll_number = student_id, total_marks, obtained_marks, percentage, grade, result_status.

CRUD continues to flow through existing `useOptimisticCrud` so Reports and existing list views update in real-time automatically.

## 6. Wiring

- Add menu item in admin sidebar (`src/pages/Admin.tsx` / sidebar config) → "Auto Generate Certificate".
- Cross-link from existing `CertificateManagementContent` and `MarksheetManagementContent` headers: an "Auto Generate" button that opens the new page.

## 7. Technical notes (for reviewers)

- No DB migration required — uses existing `certificate_management`, `marksheet_management`, `student_profiles`, `alot_numbers`, `director_messages`.
- New deps: `jspdf`, `html2canvas`.
- New files: `src/lib/courseTemplates.ts`, `src/components/admin/AutoGenerateContent.tsx`, `src/components/admin/templates/CertificateTemplate.tsx`, `src/components/admin/templates/MarksheetTemplate.tsx`.
- Edited: admin router + sidebar registration; small "Auto Generate" link on existing Certificate/Marksheet pages.
- Grade rules centralized in `courseTemplates.ts` so per-course rules can differ (Typing pass = 40%, ADCA/DCA pass = 33% theory + 50% practical).
- All colors use existing semantic tokens; no hard-coded hex.

Approve karein toh main implement kar dunga.
