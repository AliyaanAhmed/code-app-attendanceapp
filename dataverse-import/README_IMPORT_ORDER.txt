Dataverse Import Pack (CSV)

Import Order (important):
1) 01_team.csv
2) 02_office_location.csv
3) 03_employee.csv
4) 04_employee_manager_links.csv (upsert/update existing employees)
5) 05_project.csv
6) 06_holiday.csv
7) 07_leave_balance.csv
8) 08_leave_request.csv
9) 09_attendance.csv
10) 10_timesheet_week.csv
11) 11_timesheet_entry.csv
12) 12_notification.csv

Lookup Mapping Guide:
- Team Name -> lookup Team by alternate key/name
- Lead Employee Code / Employee Code / Approver Employee Code -> lookup Employee by alternate key Employee Code
- Office Location Name -> lookup Office Location by name
- Project Name -> lookup Project by name
- Timesheet Week Key -> lookup Timesheet Week by alternate key (create alternate key on Timesheet Week Key)

Recommended Alternate Keys:
- Employee: Employee Code, Email
- Attendance: Employee + Attendance Date
- Timesheet Week: Timesheet Week Key (or Employee + Week Start Date)
- Leave Balance: Employee + Year + Leave Type
- Holiday: Date

Note:
- CSV opens in Excel; you can save each file as .xlsx if needed.
- Choice values must match your Dataverse choice labels exactly.
