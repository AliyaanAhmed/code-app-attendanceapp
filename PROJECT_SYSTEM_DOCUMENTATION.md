# Datanox Attendance Management App - Full System Documentation

## 1) What This App Is For
Datanox Attendance Management App is a production-style enterprise HR frontend that handles:
- Daily attendance check-in/check-out
- Attendance visibility and reports
- Leave requests and approvals
- Weekly/monthly timesheet tracking
- Team hierarchy and manager approvals
- Calendar + holiday awareness
- Profile and notification workflows

The app currently runs as a **Power Apps Code App** (React + Vite) and uses Dataverse-backed data source bindings.

---

## 2) Business Goals
- Give employees a modern self-service attendance/timesheet portal
- Give Leads and Directors approval and monitoring capabilities
- Prepare the app for deeper integration with Microsoft Power Platform
- Keep strong UX with responsive UI, animations, and clear status feedback

---

## 3) Current Tech Stack
- React 19 + TypeScript
- Vite + `@microsoft/power-apps-vite`
- React Router v6
- Tailwind CSS v4
- Framer Motion
- Lucide React icons
- Recharts
- Day.js
- Zustand state management
- React Hot Toast / Sonner

Main config references:
- `package.json`
- `vite.config.ts`
- `power.config.json`

---

## 4) App Modules / Routes
Core routes:
- `/` -> Login
- `/dashboard`
- `/attendance/checkin`
- `/attendance/list`
- `/leave/request`
- `/timesheet`
- `/calendar`
- `/team` (Lead/Director)
- `/approvals` (Lead/Director)
- `/profile`

Router + guards:
- `src/router/index.tsx`
- `src/router/guards.tsx`

---

## 5) UX and Branding Notes
Brand direction used:
- Primary: `#F56B1F`
- Base text: near black
- Light neutrals for enterprise card/table surfaces
- Icons across KPI, actions, status sections
- Motion on loaders, cards, CTA states, page transitions

Loader and route transitions:
- App boot shows branded route loader (`RouteLoader`)
- Framer Motion used for card/page transitions and feedback

---

## 6) State and Data Flow
### Frontend Store Layer
Zustand stores:
- `authStore.ts`
- `attendanceStore.ts`
- `leaveStore.ts`
- `timesheetStore.ts`
- `appStore.ts`

### Mock Data Layer
`src/data/mockData.ts` contains:
- Employees, teams
- 3 months attendance
- Leave requests
- Weekly timesheets
- Holidays
- Notifications
- Login test users

### Dataverse Runtime Layer
Generated client services under:
- `src/generated/models/*`
- `src/generated/services/*`

These services are bound by `power.config.json` data source definitions and are used for runtime retrieval/CRUD operations.

---

## 7) Dataverse Integration (Current)
Power Code App identity:
- `appId`: `a152f78d-7ed2-4e7d-9dc6-1a5e3d6be47c`
- `environmentId`: `116d490e-4dcc-ed73-95a8-b1d7633687c4`
- `region`: `prod`

Configured Dataverse logical tables (`power.config.json`):
- `dnx_employee`
- `dnx_dnx_attendance`
- `dnx_leave_request`
- `dnx_leave_balance`
- `dnx_timesheet_week`
- `dnx_timesheet_entry`
- `dnx_dnx_team`
- `dnx_dnxofficelocation`
- `dnx_dnx_project`
- `dnx_dnx_holiday`
- `dnx_notification`

Entity-set mappings are in:
- `power.config.json -> databaseReferences.default.cds.dataSources`

---

## 8) Data Structure (Recommended)
Full recommended schema and relationships are documented in:
- `DATAVERSE_DATA_STRUCTURE.md`

Includes:
- Table-by-table columns and data types
- Lookups and 1:N relationships
- Alternate keys
- Delete behavior
- Role/view guidance for model-driven usage

---

## 9) Deployment Process Used
### One-time auth (Power Platform CLI)
```powershell
pac auth create --environment https://<env>.crm?.dynamics.com/
```

### Regular deploy cycle
```powershell
cd "C:\Code Apps\my-crud-app"
npm run build
npx power-apps push --solution-id DatanoxAttendanceAppManagement2026
```

### Local run
```powershell
npx power-apps run
```

---

## 10) Runtime Diagnostics Added
Dataverse startup diagnostics were added in `src/App.tsx` to print:
- Startup begin/end markers
- Per-table retrieval checks
- Success/failure state and row counts

Typical success logs:
- `[Datanox] Dataverse startup diagnostics: START`
- `[Datanox] Checking table: dnx_employee`
- `[Datanox] dnx_employee: OK, rows=1`
- ...
- `[Datanox] Dataverse startup diagnostics: END`

---

## 11) Asset Reliability Work Completed
Issue addressed: assets (logo/avatar) not reliably loading in embedded Power Apps runtime.

Fixes applied:
- Datanox logo rendered inline (no network dependency)
- Generic `SafeImage` component created (`src/components/app/safe-image.tsx`)
- Multi-source image fallback strategy for assistant avatar
- Dashboard and check-in assistant components migrated to `SafeImage`
- Avatar image resized to reduce runtime load pressure

---

## 12) Important Warnings and Their Meaning
Warnings often seen but mostly non-blocking:
- `componentWillReceiveProps` warnings: from Power Apps host shell dependencies
- `graph.microsoft.com ... /photo/$value 404`: tenant user profile photo missing (not app failure)
- `ECS telemetry config` messages: host telemetry bootstrap

Blocking issue that was fixed:
- CSP blocked Google Fonts import (`style-src 'self'`) -> removed external import and used fallback font stack

---

## 13) Security and Role Model
Roles used in app logic:
- Director
- Lead
- Employee

Role behavior:
- Employee: own records/actions
- Lead: team visibility + approvals
- Director: org-wide visibility + approvals

---

## 14) Known Improvement Areas
- `SafeImage` inline fallback increases JS chunk size; optimize by:
  - using WebP/AVIF assets
  - smaller avatar resolution variants
  - route-level splitting for media-heavy views
- Introduce centralized API repository layer to shift stores from mock-first to Dataverse-first
- Add automated smoke checks for Dataverse table availability at login

---

## 15) Suggested Production Checklist
- [ ] Finalize all table and column names exactly as backend standard
- [ ] Replace mock store persistence with generated Dataverse service calls page by page
- [ ] Add audit columns and approval metadata enforcement in Dataverse
- [ ] Add environment-specific config (Dev/UAT/Prod)
- [ ] Add E2E test flow for login -> check-in -> leave -> timesheet -> approval
- [ ] Add release notes file per deployment

---

## 16) Project File Pointers
- App shell: `src/App.tsx`
- Router: `src/router/index.tsx`
- Layouts: `src/layouts/*`
- Pages: `src/pages/*`
- Shared app components: `src/components/app/*`
- UI primitives: `src/components/ui/*`
- Mock dataset: `src/data/mockData.ts`
- Zustand stores: `src/store/*`
- Dataverse generated services: `src/generated/*`
- Power code app config: `power.config.json`

---

## 17) Summary
This app is now a modern attendance/timesheet HR portal prepared for Power Platform integration, with:
- Role-aware workflows
- Dataverse table bindings
- Deployment-ready Code App setup
- Enhanced runtime diagnostics
- Hardened asset-loading strategy for embedded Power Apps execution
