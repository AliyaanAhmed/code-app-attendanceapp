# Datanox Attendance App - Dataverse Data Structure

## Scope
This document defines the recommended production Dataverse schema for the existing Datanox Attendance Management app (React frontend + model-driven backend).

Prefix used: `dnx_`

---

## 1) Table: `dnx_employee`
Primary Name: `dnx_employee` (Text, 150)

Columns:
- `dnx_employeecode` - Text(50), Required, Unique
- `dnx_email` - Email, Required, Unique
- `dnx_phone` - Text(50)
- `dnx_role` - Choice: `Director`, `Lead`, `Employee` (Required)
- `dnx_department` - Text(100)
- `dnx_contactnumber` - Text(50)
- `dnx_emergencycontact` - Text(200)
- `dnx_isactive` - Yes/No (Default: Yes)
- `dnx_team` - Lookup -> `dnx_team` (Required)
- `dnx_manager` - Lookup -> `dnx_employee` (Self reference)
- `dnx_officelocation` - Lookup -> `dnx_office_location`

---

## 2) Table: `dnx_team`
Primary Name: `dnx_team` (Text, 100)

Columns:
- `dnx_description` - Multiline Text
- `dnx_teamlead` - Lookup -> `dnx_employee` (Required)

---

## 3) Table: `dnx_office_location`
Primary Name: `dnx_locationname` (Text, 150)

Columns:
- `dnx_address` - Multiline Text
- `dnx_latitude` - Decimal(8,6)
- `dnx_longitude` - Decimal(9,6)
- `dnx_radiusmeters` - Whole Number (Default: 1500)
- `dnx_timezone` - Text(50)

---

## 4) Table: `dnx_attendance`
Primary Name: `dnx_attendance` (Text, 150, auto label allowed)

Columns:
- `dnx_employee` - Lookup -> `dnx_employee` (Required)
- `dnx_date` - Date Only (Required)
- `dnx_checkin` - DateTime
- `dnx_checkout` - DateTime
- `dnx_durationhours` - Decimal(5,2)
- `dnx_status` - Choice: `Present`, `Late`, `Absent`, `Leave` (Required)
- `dnx_workmode` - Choice: `OnSite`, `WFH`
- `dnx_locationlabel` - Text(200)
- `dnx_checkinlat` - Decimal(8,6)
- `dnx_checkinlong` - Decimal(9,6)
- `dnx_iswithinofficegeofence` - Yes/No
- `dnx_officelocation` - Lookup -> `dnx_office_location`

---

## 5) Table: `dnx_leave_request`
Primary Name: `dnx_leave_request` (Text, 150)

Columns:
- `dnx_employee` - Lookup -> `dnx_employee` (Required)
- `dnx_leavetype` - Choice: `Sick Leave`, `Casual Leave`, `Annual Leave`, `Time In Lieu` (Required)
- `dnx_startdate` - Date Only (Required)
- `dnx_enddate` - Date Only (Required)
- `dnx_days` - Decimal(4,1)
- `dnx_reason` - Multiline Text
- `dnx_attachment` - File
- `dnx_status` - Choice: `Pending`, `Approved`, `Rejected` (Default: Pending)
- `dnx_approver` - Lookup -> `dnx_employee`
- `dnx_decisiondate` - DateTime
- `dnx_rejectionreason` - Multiline Text

---

## 6) Table: `dnx_leave_balance`
Primary Name: `dnx_leave_balance` (Text, 150)

Columns:
- `dnx_employee` - Lookup -> `dnx_employee` (Required)
- `dnx_year` - Whole Number (Required)
- `dnx_leavetype` - Choice: `Sick Leave`, `Casual Leave`, `Annual Leave`, `Time In Lieu` (Required)
- `dnx_total` - Decimal(5,1)
- `dnx_used` - Decimal(5,1)
- `dnx_remaining` - Calculated Decimal (`dnx_total - dnx_used`)

---

## 7) Table: `dnx_project`
Primary Name: `dnx_projectname` (Text, 150)

Columns:
- `dnx_categorydefault` - Choice: `Development`, `Design`, `Management`, `Leave`, `Other`
- `dnx_startdate` - Date Only
- `dnx_enddate` - Date Only
- `dnx_isactive` - Yes/No (Default: Yes)

---

## 8) Table: `dnx_timesheet_week`
Primary Name: `dnx_timesheet_week` (Text, 150)

Columns:
- `dnx_weekkey` - Text(120), Unique
- `dnx_employee` - Lookup -> `dnx_employee` (Required)
- `dnx_year` - Whole Number (Required)
- `dnx_month` - Whole Number (1-12)
- `dnx_weeklabel` - Text(30) (e.g., Week 1)
- `dnx_weekstartdate` - Date Only (Required)
- `dnx_weekenddate` - Date Only (Required)
- `dnx_totalhours` - Decimal(5,2)
- `dnx_status` - Choice: `Draft`, `Submitted`, `Pending Review`, `Approved`, `Returned` (Default: Draft)
- `dnx_submittedon` - DateTime
- `dnx_approver` - Lookup -> `dnx_employee`
- `dnx_reviewnote` - Multiline Text

---

## 9) Table: `dnx_timesheet_entry`
Primary Name: `dnx_timesheet_entry` (Text, 150)

Columns:
- `dnx_timesheet_week` - Lookup -> `dnx_timesheet_week` (Required)
- `dnx_project` - Lookup -> `dnx_project`
- `dnx_date` - Date Only
- `dnx_category` - Choice: `Development`, `Design`, `Management`, `Leave`, `Other`
- `dnx_task` - Text(300)
- `dnx_tasktype` - Choice: `Billable`, `Non-Billable`, `Internal`
- `dnx_monhours` - Decimal(4,1)
- `dnx_tuehours` - Decimal(4,1)
- `dnx_wedhours` - Decimal(4,1)
- `dnx_thuhours` - Decimal(4,1)
- `dnx_frihours` - Decimal(4,1)
- `dnx_rowtotalhours` - Calculated Decimal (`Mon+Tue+Wed+Thu+Fri`)
- `dnx_description` - Multiline Text

---

## 10) Table: `dnx_notification`
Primary Name: `dnx_notification` (Text, 150)

Columns:
- `dnx_employee` - Lookup -> `dnx_employee` (Required)
- `dnx_notificationdatetime` - DateTime
- `dnx_type` - Choice: `Reminder`, `Approval`, `Policy`, `System`
- `dnx_message` - Multiline Text
- `dnx_isread` - Yes/No (Default: No)

---

## 11) Table: `dnx_holiday`
Primary Name: `dnx_holidayname` (Text, 150)

Columns:
- `dnx_date` - Date Only (Required)
- `dnx_country` - Text(80)
- `dnx_ishalfday` - Yes/No

---

## Relationships (1:N)
- `dnx_team` -> `dnx_employee`
- `dnx_employee (manager)` -> `dnx_employee (direct reports)`
- `dnx_office_location` -> `dnx_employee`
- `dnx_office_location` -> `dnx_attendance`
- `dnx_employee` -> `dnx_attendance`
- `dnx_employee` -> `dnx_leave_request`
- `dnx_employee (approver)` -> `dnx_leave_request`
- `dnx_employee` -> `dnx_leave_balance`
- `dnx_employee` -> `dnx_timesheet_week`
- `dnx_employee (approver)` -> `dnx_timesheet_week`
- `dnx_timesheet_week` -> `dnx_timesheet_entry`
- `dnx_project` -> `dnx_timesheet_entry`
- `dnx_employee` -> `dnx_notification`

---

## Alternate Keys
- `dnx_employee`: `dnx_employeecode`
- `dnx_employee`: `dnx_email`
- `dnx_attendance`: (`dnx_employee`, `dnx_date`)
- `dnx_leave_balance`: (`dnx_employee`, `dnx_year`, `dnx_leavetype`)
- `dnx_timesheet_week`: `dnx_weekkey`
- `dnx_holiday`: `dnx_date`

---

## Delete Behavior
- Restrict delete for all business parent-child links.
- Cascade delete only:
  - `dnx_timesheet_week` -> `dnx_timesheet_entry`

---

## Notes For Model-Driven App
- Create views:
  - My Attendance, My Leave Requests, My Timesheets
  - Pending Leave Approvals, Pending Timesheet Reviews
- Create forms:
  - Main + quick create for core transactional tables
- Security roles:
  - Employee: own records
  - Lead: team records + approvals
  - Director: organization-wide
