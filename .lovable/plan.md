# Student Registration — Dropdown Sources Audit + End-to-End Linkage Plan

I read `src/components/admin/StudentRegistrationContent.tsx`, the `student_profiles` schema, and how Fees, Admit Card, Certificate, Marksheet, and Alot Number pages currently look up students. Here's exactly what is wired and what is broken.

## 1. Where each dropdown's data comes from

| Field | Source | Managed in |
|---|---|---|
| Course Category | `course_master` → distinct `category` where `status='active'` | Admin → Master → **Course Master** (or **Add Course Category**) |
| Course Name | `course_master` filtered by selected category | Admin → Master → **Course Master** |
| Course Fees | Auto-filled from `course_master.fees` of the selected course (no dropdown) | — |
| Study Center | **HARD-CODED** in the file (Azamgarh / Mau / Baliya) | Not in DB |
| Mr./Mrs./Ms. (applicant, father, mother) | **HARD-CODED** | Not in DB |
| Gender | **HARD-CODED** (Male / Female / Other) | Not in DB |
| Category (caste) | **HARD-CODED** (General / OBC / SC / ST) | Not in DB |
| Country code | **HARD-CODED** (+91) | Not in DB |
| State | `state_master` (value stored = UUID `state.id`) | Admin → Master → **State Master** |
| District | `district_master` filtered by selected state's `city_id` (value stored = UUID) | Admin → Master → **District Master** |

So today, only **Course Category / Course Name / State / District** are admin-driven. The rest are static lists baked into the component. Your DB currently has 0 rows in `course_master`, `state_master`, and `district_master`, so those dropdowns will appear empty until you add entries in the Master pages.

## 2. What actually gets saved — and what is silently dropped

The form has ~20 fields but `handleSubmit` writes only these to `student_profiles`:

`full_name, email, phone, course_name, status, city, state, enrollment_date`

**Dropped (never stored anywhere):** father name, mother name, gender, date of birth, category, registration date, full address, district, pin code, qualification, year of passing, aadhar number, study center, course category, course fees, displayed Student ID, password, photo upload.

Other defects in the save path:
- `state` is stored as the **UUID from `state_master`**, not the state name — so the listing table shows a UUID instead of "Uttar Pradesh".
- District is collected but never sent.
- The "Student ID" shown in the form is a **hard-coded placeholder** `"2002318"` and the password is `"58742318"`. They're read-only, identical for every registration, and not persisted.
- Photo input has no `onChange` and is not uploaded.

## 3. Why the chain to Fees / Admit Card / Certificate / Marksheet is broken

`student_profiles` has no `student_id` text column. But every downstream table keys students by a `student_id` TEXT field:

- `fees_receipts.student_id` (text)
- `student_admit_cards.student_id` (text)
- `certificate_management.student_id` (text)
- `marksheet_management.student_id` (text)
- `alot_numbers.student_id` (text)
- `attendance_management.student_id` (text)

And each downstream admin page (Fees Management, Make Student Admit Card, Certificate Management, Marksheet Management, Alot Number) **asks the admin to free-type the Student ID and Student Name** — there is no picker that reads from `student_profiles`. So after registering a student, nothing automatically flows: the admin must remember the ID and retype it everywhere.

## 4. Proposed fix — three milestones

### Milestone A — Make the dropdowns complete & DB-driven (schema)
Migration:
- Add `student_id TEXT UNIQUE`, plus the missing profile columns to `student_profiles`: `father_name, mother_name, gender, date_of_birth, category, registration_date, address, district, pin_code, qualification, year_of_passing, aadhar_number, study_center, course_category, course_fees, photo_url, login_password`.
- (Optional) add small lookup tables `study_centers`, `categories` (caste), `qualifications` so Master pages can drive Study Center / Category / Qualification dropdowns — OR keep them hard-coded for now. **Need your call on this.**

### Milestone B — Fix the Student Registration form
- Auto-generate `student_id` on save (format: `SSF-YYYY-NNNN`, sequence per year) and display the real generated ID after submit.
- Persist every form field listed above (not just 8 of them).
- Resolve `state` UUID → state name before insert; same for district. Store both id and name so the listing reads clean.
- Wire the photo upload to the existing `avatars` storage bucket and save the URL.
- Generate a secure random password instead of the constant `"58742318"`.
- Add light validation (email, phone, aadhar length) via zod.

### Milestone C — Connect downstream features to the registered students
Add a reusable **Student Picker** component (search-as-you-type on `student_id`, `full_name`, `phone`) and drop it into:
- Fees Management (auto-fills `student_id`, `student_name`, `course`, `total_fee`)
- Make / Generate Student Admit Card (auto-fills ID, name, course, father/mother name, photo)
- Certificate Management (auto-fills ID, name, course)
- Marksheet Management (auto-fills ID, name, course)
- Alot Number (auto-fills ID, name, course, father/mother name, photo)
- Attendance Management (already keyed by student_id; same picker)

After this, registering a student once lets the admin select them by name everywhere downstream and the right fields fill in automatically.

## 5. What I will touch
- One migration (Milestone A).
- `src/components/admin/StudentRegistrationContent.tsx` (Milestone B).
- New file `src/components/admin/shared/StudentPicker.tsx` (Milestone C) + the 6 downstream pages above to swap their free-text Student ID inputs for the picker.

## 6. Two decisions I need from you before I start

1. **Hard-coded dropdowns (Study Center, Title, Gender, Caste Category, Qualification):** keep them hard-coded, or make them DB-driven via new Master pages? Hard-coded is faster; DB-driven gives you control without code changes.
2. **Student ID format:** auto-generate (`SSF-2026-0001` style) or let the admin type/edit it? Auto-generate is safer and prevents duplicates across downstream tables.

Reply with your choices and I'll implement Milestones A → C in that order.
