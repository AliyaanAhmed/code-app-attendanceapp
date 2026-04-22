# Datanox Finance + HR Module Extension

## Scope
This extension adds two enterprise modules to the existing Datanox attendance system:
- Finance Manager module
- HR Manager module

The implementation keeps existing flows intact and follows current patterns in routing, RBAC, Zustand stores, mock data, and UI components.

## New Roles
- Finance Manager
- HR Manager

## Implemented Frontend Modules

### Finance
- `/finance` Finance dashboard
- `/finance/payroll` payroll structure and bulk disbursement
- `/finance/payslips` payslip listing and employee self-view
- `/finance/reimbursements` reimbursement submission + approval workflow
- `/finance/procurement` procurement/expense submission + finance action
- `/finance/petty-cash` petty cash ledger and entry management

### HR
- `/hr` HR dashboard
- `/hr/policies` policy listing + creation
- `/hr/employees` employee lifecycle screen
- `/hr/leave-rules` leave policy rules configuration

## Updated Files
- `src/data/mockData.ts`
- `src/store/financeStore.ts`
- `src/store/hrStore.ts`
- `src/store/appStore.ts`
- `src/router/index.tsx`
- `src/components/app/sidebar.tsx`
- `src/components/app/header-bar.tsx`
- `src/pages/dashboard/dashboard.tsx`
- `src/pages/finance/*`
- `src/pages/hr/*`
- `src/index.css`

## Business Flows Implemented

### Payroll
1. Finance selects payroll month.
2. Salary components are editable per employee.
3. Bulk disbursement marks salary rows as disbursed.
4. Payslips are auto-generated from disbursed month data.
5. Dashboard notification is created for salary credit.

### Reimbursement
1. Employee/Lead/Director submits claim with category, amount, bill name, reason.
2. Lead can forward `Pending Lead Review` to finance.
3. Finance can approve/reject `Pending Finance Review`.
4. User-facing notifications are created for status changes.

### Procurement
1. Employee submits procurement expense.
2. Finance reviews pending procurement entries.
3. Finance marks entries as reimbursed or rejected.
4. Notifications are generated on finance decisions.

### HR Policy & Rules
1. HR/Director can publish policy updates.
2. Employees can browse policy center.
3. HR/Director can update leave limits, notice, and carry-forward rules.
4. HR can activate/deactivate employees in lifecycle view.

## Dataverse Table Plan (Model-driven)

### Core HR
1. `dnx_employee`
- `dnx_employeecode` Text
- `dnx_name` Text
- `dnx_email` Email
- `dnx_role` Choice (Employee, Lead, Director, Finance Manager, HR Manager)
- `dnx_department` Lookup(`dnx_team`) or Text
- `dnx_manager` Lookup(`dnx_employee`)
- `dnx_isactive` Yes/No

2. `dnx_policy`
- `dnx_title` Text
- `dnx_category` Choice
- `dnx_version` Text
- `dnx_effectivedate` Date
- `dnx_summary` Multiline text
- `dnx_updatedby` Lookup(`dnx_employee`)

3. `dnx_leave_policy_rule`
- `dnx_leavetype` Choice
- `dnx_annuallimit` Whole number
- `dnx_minnoticedays` Whole number
- `dnx_carryforward` Yes/No

### Core Finance
4. `dnx_payroll_cycle`
- `dnx_name` Text
- `dnx_month` Whole number
- `dnx_year` Whole number
- `dnx_status` Choice (Draft, Processed, Disbursed)
- `dnx_disbursedon` DateTime

5. `dnx_payroll_line`
- `dnx_payrollcycle` Lookup(`dnx_payroll_cycle`)
- `dnx_employee` Lookup(`dnx_employee`)
- `dnx_basic` Currency
- `dnx_allowances` Currency
- `dnx_deductions` Currency
- `dnx_bonus` Currency
- `dnx_performancebonus` Currency
- `dnx_netpay` Currency

6. `dnx_payslip`
- `dnx_employee` Lookup(`dnx_employee`)
- `dnx_payrollline` Lookup(`dnx_payroll_line`)
- `dnx_month` Whole number
- `dnx_year` Whole number
- `dnx_generatedon` DateTime
- `dnx_document` File

7. `dnx_reimbursement`
- `dnx_employee` Lookup(`dnx_employee`)
- `dnx_submittedon` Date
- `dnx_category` Choice
- `dnx_amount` Currency
- `dnx_bill` File
- `dnx_reason` Multiline text
- `dnx_status` Choice (Pending Lead Review, Pending Finance Review, Approved, Rejected)
- `dnx_leadapprover` Lookup(`dnx_employee`)
- `dnx_financeapprover` Lookup(`dnx_employee`)
- `dnx_rejectionreason` Multiline text

8. `dnx_procurement`
- `dnx_employee` Lookup(`dnx_employee`)
- `dnx_date` Date
- `dnx_item` Text
- `dnx_department` Text
- `dnx_amount` Currency
- `dnx_status` Choice (Pending, Reimbursed, Rejected)

9. `dnx_petty_cash_entry`
- `dnx_date` Date
- `dnx_type` Choice (Credit, Debit)
- `dnx_amount` Currency
- `dnx_department` Text
- `dnx_note` Multiline text

10. `dnx_notification`
- `dnx_employee` Lookup(`dnx_employee`) nullable for org-wide
- `dnx_title` Text
- `dnx_detail` Multiline text
- `dnx_createdon` DateTime
- `dnx_isread` Yes/No

## Required Relationships
- `dnx_employee` 1:N `dnx_payroll_line`
- `dnx_payroll_cycle` 1:N `dnx_payroll_line`
- `dnx_payroll_line` 1:N `dnx_payslip`
- `dnx_employee` 1:N `dnx_reimbursement`
- `dnx_employee` 1:N `dnx_procurement`
- `dnx_employee` 1:N `dnx_notification`
- `dnx_employee` 1:N `dnx_policy` (updated by)

## Power Automate Suggestions
- On payroll disbursement:
  - create payslip rows
  - send email
  - create `dnx_notification`
- On reimbursement decision:
  - notify submitter
  - email lead/finance trail
- On policy add/update:
  - create org-wide notification
  - optional Teams announcement

## Notes
- Frontend currently uses mock state for all new modules.
- Dataverse integration can replace store actions with `Xrm.WebApi` calls without changing route/component contracts.
- Styling remains aligned to Datanox theme and existing component system.
