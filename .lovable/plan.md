# Admin Main Navigation – Audit & Fix Plan

## Audit findings (`src/pages/Admin.tsx`)

Scanned every sidebar item, its click handler, the `<Routes>` map, and the top-bar `currentView` title block.

**Working:** All 13 top-level groups expand/collapse; almost every submenu label has a matching `navigate(...)` and a matching `<Route>` and its content component exists in `src/components/admin/`.

**Broken / out-of-sync items found:**

1. **Top bar shows wrong title on most pages.** The `currentView` title and subtitle blocks (lines ~640–691) only cover ~28 of the 60+ routes. Pages like Auto Generate, Certificate Management, Marksheet Management, Alot Number, Ready Marksheet, Report, Edit CRT, Student Marksheet, Attendance Management, Student Attendance, Class Fees, all Fees pages, all Expense pages, all Franchise pages, Payment pages, Student Editing, Course Subject, Real-Time Student Management, Student Reg. Print, Admit Card pages, Upload Student Content all fall back to **"Dashboard"** in the header — looks broken.
2. **No active highlighting for submenu items.** Only the Dashboard pill gets the active style. Submenu rows never show which page you're on.
3. **Parent group doesn't auto-open for the current route.** If you refresh on `/admin/fees-management`, the Fees Master group is collapsed and the user can't see where they are.
4. **Collapsed sidebar can't reach submenus.** When `sidebarCollapsed` is true, clicking a parent with `hasSubmenu` does nothing (the handler is gated on `!sidebarCollapsed`). User is stuck unless they expand first.
5. **"Course Subject" is orphaned.** Route + click handler exist, but the label is missing from every submenu list — unreachable from the nav.
6. **Fragile giant `if/else` chains.** Three places (`getCurrentView`, submenu `onClick`, title block) all duplicate the same label↔path↔title mapping. Easy to drift; that's how (1)/(2)/(5) happened.

All sidebar labels otherwise route to components that exist and render.

## Fix plan

### 1. Single source of truth: route map
Introduce one config in `src/pages/Admin.tsx` (or a sibling `adminNav.ts`) that, for each menu item, declares:
```ts
{ label, icon, path, title, subtitle }
```
Build `sidebarItems` from it, and drive `getCurrentView`, the submenu `onClick`, and the top-bar title/subtitle from the same map. Removes the three-way duplication and prevents future drift.

### 2. Wire every route into the top bar
Replace the long ternary in the header with a lookup against the map so the title & subtitle update correctly for **every** admin route, including Auto Generate, Certificate/Marksheet Management, Fees, Expense, Franchise, Payment, etc.

### 3. Active highlighting on submenu items
Compare `location.pathname` to each `subItem.path` and apply the indigo/blue active style (matching the existing Dashboard active treatment) to the current row. Also highlight the parent group row when any of its children is active.

### 4. Auto-open the parent group for the current route
On mount and on route change, compute which parent contains the active path and add its index to `openSubmenus` so users always see context after a refresh or deep link.

### 5. Make collapsed sidebar usable
When the sidebar is collapsed and the user clicks a parent with a submenu, expand the sidebar (`setSidebarCollapsed(false)`) and open that group, instead of silently doing nothing.

### 6. Add "Course Subject" to the nav
Add it under **Student Master** (matches the existing route `/admin/course-subject` and `CourseSubjectContent`). Now reachable.

### 7. Light sanity sweep
- Confirm Dashboard, Logout, Back-to-Home buttons still work.
- Confirm every `<Route>` still resolves (no imports removed).
- Confirm `/admin` with no sub-path still lands on Dashboard.

## Out of scope
- No visual redesign of the sidebar or top bar (only active-state + title text driven by data).
- No renames of typo'd labels ("Markseet", "Student Attandance", "Distt Master") unless you ask.
- No changes to the individual page components — only the navigation layer in `Admin.tsx`.

## File(s) touched
- `src/pages/Admin.tsx` (refactor nav config, header lookup, active state, auto-open, collapsed-click behavior, add Course Subject entry).

## Verification
- Click through each parent group and each submenu item; confirm route changes, page renders, header title updates, and active highlight follows.
- Refresh on a deep route (e.g. `/admin/balance-sheet`) and confirm the Expense Panel group is auto-opened and Balance Sheet row is highlighted.
- Collapse the sidebar, click a group icon → sidebar expands and that group opens.
