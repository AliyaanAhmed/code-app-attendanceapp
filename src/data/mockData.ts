import dayjs from "dayjs"

export type Role = "Director" | "Lead" | "Employee" | "Finance Manager" | "HR Manager"

export type Employee = {
  id: string
  name: string
  role: Role
  department: string
  isActive?: boolean
  teamId: string
  managerId?: string
  employeeId: string
  contact: string
  emergencyContact: string
}

export type AttendanceStatus = "Present" | "Late" | "Absent" | "Leave"

export type AttendanceRecord = {
  id: string
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  durationHours: number
  location: string
  status: AttendanceStatus
}

export type LeaveStatus = "Pending" | "Approved" | "Rejected"
export type LeaveType = "Sick Leave" | "Casual Leave" | "Annual Leave" | "Time In Lieu"

export type LeaveRequest = {
  id: string
  employeeId: string
  type: LeaveType
  fromDate: string
  toDate: string
  reason: string
  days: number
  status: LeaveStatus
  rejectionReason?: string
  createdAt: string
}

export type TaskType = "Billable" | "Non-Billable" | "Internal"
export type TimesheetStatus = "Draft" | "Submitted" | "Pending Review" | "Approved"

export type TimesheetRow = {
  id: string
  category: "Development" | "Design" | "Management" | "Leave" | "Other"
  project: string
  task: string
  taskType: TaskType
  hours: {
    Mon: number
    Tue: number
    Wed: number
    Thu: number
    Fri: number
  }
}

export type TimesheetWeek = {
  id: string
  employeeId: string
  weekLabel: string
  weekStart: string
  weekEnd: string
  submittedOn?: string
  status: TimesheetStatus
  rows: TimesheetRow[]
}

export type Holiday = {
  date: string
  name: string
}

export type NotificationItem = {
  id: string
  employeeId?: string
  title: string
  detail: string
  createdAt: string
  read: boolean
}

export type Team = {
  id: string
  name: string
  leadId: string
  memberIds: string[]
}

export type SalaryStructure = {
  employeeId: string
  month: string
  basic: number
  allowances: number
  deductions: number
  bonus: number
  performanceBonus: number
  net: number
  status: "Draft" | "Disbursed"
  disbursedOn?: string
}

export type Payslip = {
  id: string
  employeeId: string
  month: string
  generatedOn: string
  netAmount: number
  downloadUrl: string
}

export type ReimbursementStatus = "Pending Lead Review" | "Pending Finance Review" | "Approved" | "Rejected"
export type ReimbursementClaim = {
  id: string
  employeeId: string
  submittedOn: string
  category: "Travel" | "Meals" | "Client Expense" | "Equipment" | "Medical" | "Other"
  amount: number
  billName: string
  reason: string
  status: ReimbursementStatus
  leadDecisionOn?: string
  financeDecisionOn?: string
  rejectionReason?: string
}

export type ProcurementEntry = {
  id: string
  employeeId: string
  date: string
  item: string
  department: string
  amount: number
  status: "Pending" | "Reimbursed" | "Rejected"
}

export type PettyCashEntry = {
  id: string
  date: string
  type: "Credit" | "Debit"
  amount: number
  department?: string
  note: string
}

export type PolicyCategory = "Leave" | "Attendance" | "Code of Conduct" | "Security" | "Benefits" | "General"
export type PolicyDocument = {
  id: string
  title: string
  category: PolicyCategory
  version: string
  effectiveDate: string
  updatedBy: string
  summary: string
}

export type LeavePolicyRule = {
  type: LeaveType
  annualLimit: number
  carryForward: boolean
  minNoticeDays: number
}

export type QuarterlyProgressRecord = {
  id: string
  employeeId: string
  year: number
  quarter: "Q1" | "Q2" | "Q3" | "Q4"
  kpiScore: number
  collaborationScore: number
  deliveryScore: number
  overallScore: number
  reviewDate: string
  nextQuarterDate: string
  remarks: string
}

const employees: Employee[] = [
  { id: "emp-001", name: "Ayesha Khan", role: "Director", department: "Operations", isActive: true, teamId: "team-ops", employeeId: "DNX-1001", contact: "+92-300-1001001", emergencyContact: "Ali Khan +92-300-0001111" },
  { id: "emp-002", name: "Bilal Ahmed", role: "Lead", department: "Engineering", isActive: true, teamId: "team-eng", managerId: "emp-001", employeeId: "DNX-1002", contact: "+92-300-1001002", emergencyContact: "Sara Ahmed +92-300-0002222" },
  { id: "emp-003", name: "Hina Tariq", role: "Lead", department: "Design", isActive: true, teamId: "team-design", managerId: "emp-001", employeeId: "DNX-1003", contact: "+92-300-1001003", emergencyContact: "Umar Tariq +92-300-0003333" },
  { id: "emp-004", name: "Usman Raza", role: "Lead", department: "People", isActive: true, teamId: "team-people", managerId: "emp-001", employeeId: "DNX-1004", contact: "+92-300-1001004", emergencyContact: "Maha Raza +92-300-0004444" },
  { id: "emp-005", name: "Syed Aliyaan Ahmed", role: "Employee", department: "Engineering", isActive: true, teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1005", contact: "+92-300-1001005", emergencyContact: "Zain Fatima +92-300-0005555" },
  { id: "emp-006", name: "Ibrahim Saeed", role: "Employee", department: "Engineering", isActive: true, teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1006", contact: "+92-300-1001006", emergencyContact: "Nida Saeed +92-300-0006666" },
  { id: "emp-007", name: "Mariam Ali", role: "Employee", department: "Engineering", isActive: true, teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1007", contact: "+92-300-1001007", emergencyContact: "Asad Ali +92-300-0007777" },
  { id: "emp-008", name: "Hamza Noor", role: "Employee", department: "Design", isActive: true, teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1008", contact: "+92-300-1001008", emergencyContact: "Sana Noor +92-300-0008888" },
  { id: "emp-009", name: "Kiran Shah", role: "Employee", department: "Design", isActive: true, teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1009", contact: "+92-300-1001009", emergencyContact: "Farhan Shah +92-300-0009999" },
  { id: "emp-010", name: "Daniyal Anwar", role: "Employee", department: "Design", isActive: true, teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1010", contact: "+92-300-1001010", emergencyContact: "Hiba Anwar +92-300-0010101" },
  { id: "emp-011", name: "Sana Javed", role: "Employee", department: "People", isActive: true, teamId: "team-people", managerId: "emp-004", employeeId: "DNX-1011", contact: "+92-300-1001011", emergencyContact: "Waleed Javed +92-300-0011111" },
  { id: "emp-012", name: "Taha Qureshi", role: "Employee", department: "People", isActive: true, teamId: "team-people", managerId: "emp-004", employeeId: "DNX-1012", contact: "+92-300-1001012", emergencyContact: "Areeba Qureshi +92-300-0012121" },
  { id: "emp-013", name: "Ammar Siddiqui", role: "Finance Manager", department: "Finance", isActive: true, teamId: "team-finance", managerId: "emp-001", employeeId: "DNX-1013", contact: "+92-300-1001013", emergencyContact: "Maha Siddiqui +92-300-0013131" },
  { id: "emp-014", name: "Sadia Rahman", role: "HR Manager", department: "Human Resources", isActive: true, teamId: "team-hr", managerId: "emp-001", employeeId: "DNX-1014", contact: "+92-300-1001014", emergencyContact: "Fahad Rahman +92-300-0014141" },
]

const teams: Team[] = [
  { id: "team-eng", name: "Engineering", leadId: "emp-002", memberIds: ["emp-005", "emp-006", "emp-007"] },
  { id: "team-design", name: "Design", leadId: "emp-003", memberIds: ["emp-008", "emp-009", "emp-010"] },
  { id: "team-people", name: "People", leadId: "emp-004", memberIds: ["emp-011", "emp-012"] },
  { id: "team-finance", name: "Finance", leadId: "emp-013", memberIds: ["emp-013"] },
  { id: "team-hr", name: "Human Resources", leadId: "emp-014", memberIds: ["emp-014"] },
]

const holidays2026: Holiday[] = [
  { date: "2026-01-01", name: "New Year" },
  { date: "2026-02-05", name: "Kashmir Day" },
  { date: "2026-03-23", name: "Pakistan Day" },
  { date: "2026-03-31", name: "Eid ul Fitr" },
  { date: "2026-04-01", name: "Eid ul Fitr Holiday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-06-07", name: "Eid ul Adha" },
  { date: "2026-07-09", name: "Ashura" },
  { date: "2026-08-14", name: "Independence Day" },
  { date: "2026-12-25", name: "Quaid-e-Azam Day" },
]

const projectsByCategory: Record<TimesheetRow["category"], string[]> = {
  Development: ["Datanox Portal", "Power Apps Integration", "HR Analytics API"],
  Design: ["Attendance UI Revamp", "Mobile UX Sprint"],
  Management: ["Sprint Planning", "Stakeholder Sync"],
  Leave: ["Annual Leave", "Sick Leave"],
  Other: ["Training", "Internal Docs"],
}

const attendanceRecords: AttendanceRecord[] = []
const leaveRequests: LeaveRequest[] = []
const timesheets: TimesheetWeek[] = []
const timesheetMonthsCurrentYear = Array.from({ length: dayjs().month() + 1 }, (_, i) => dayjs().startOf("year").add(i, "month").format("YYYY-MM"))

const monthStart = dayjs("2026-02-01")

employees.forEach((employee, empIndex) => {
  for (let m = 0; m < 3; m += 1) {
    const start = monthStart.add(m, "month").startOf("month")
    const end = start.endOf("month")

    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      if (d.isSame(dayjs(), "day") || d.isAfter(dayjs(), "day")) {
        continue
      }
      if (d.day() === 0 || d.day() === 6) {
        continue
      }
      const holiday = holidays2026.find((h) => h.date === d.format("YYYY-MM-DD"))
      if (holiday) {
        continue
      }

      const chance = (d.date() + empIndex * 3) % 18
      let status: AttendanceStatus = "Present"
      if (chance === 0) {
        status = "Absent"
      } else if (chance === 1 || chance === 2) {
        status = "Late"
      } else if (chance === 3) {
        status = "Leave"
      }

      const isLate = status === "Late"
      const checkIn = status === "Absent" || status === "Leave" ? null : d.hour(isLate ? 9 : 8).minute(isLate ? 22 : 49).format("HH:mm")
      const checkOut = status === "Absent" || status === "Leave" ? null : d.hour(17).minute(38).format("HH:mm")
      const durationHours = checkIn && checkOut ? 8.7 - (isLate ? 0.6 : 0) : 0

      attendanceRecords.push({
        id: `${employee.id}-${d.format("YYYYMMDD")}`,
        employeeId: employee.id,
        date: d.format("YYYY-MM-DD"),
        checkIn,
        checkOut,
        durationHours,
        location: "Karachi, PK - Office",
        status,
      })
    }
  }

  const leaveTypes: LeaveType[] = ["Sick Leave", "Casual Leave", "Annual Leave", "Time In Lieu"]
  for (let i = 0; i < 3; i += 1) {
    const from = dayjs("2026-02-01").add((empIndex * 4 + i * 7) % 75, "day")
    const days = ((empIndex + i) % 3) + 1
    const to = from.add(days - 1, "day")
    const statusIndex = (empIndex + i) % 3
    const status: LeaveStatus = statusIndex === 0 ? "Pending" : statusIndex === 1 ? "Approved" : "Rejected"

    leaveRequests.push({
      id: `leave-${employee.id}-${i + 1}`,
      employeeId: employee.id,
      type: leaveTypes[(empIndex + i) % leaveTypes.length],
      fromDate: from.format("YYYY-MM-DD"),
      toDate: to.format("YYYY-MM-DD"),
      reason: "Personal commitment and planned leave.",
      days,
      status,
      rejectionReason: status === "Rejected" ? "Insufficient backup during sprint release." : undefined,
      createdAt: from.subtract(5, "day").format("YYYY-MM-DD"),
    })
  }

  const currentWeekStart = dayjs("2026-04-17").startOf("month")
  for (let w = 0; w < 4; w += 1) {
    const start = currentWeekStart.add(w * 7, "day")
    const end = start.add(4, "day")
    const base = (empIndex + w) % 3
    const rows: TimesheetRow[] = [
      {
        id: `ts-${employee.id}-${w}-1`,
        category: "Development",
        project: projectsByCategory.Development[(empIndex + w) % projectsByCategory.Development.length],
        task: "Feature implementation and reviews",
        taskType: "Billable",
        hours: { Mon: 7, Tue: 8, Wed: 8, Thu: 8, Fri: 7 },
      },
      {
        id: `ts-${employee.id}-${w}-2`,
        category: "Management",
        project: "Sprint Planning",
        task: "Standups and planning",
        taskType: "Internal",
        hours: { Mon: 1, Tue: 0, Wed: 0, Thu: 0, Fri: 1 },
      },
    ]

    timesheets.push({
      id: `week-${employee.id}-${w + 1}`,
      employeeId: employee.id,
      weekLabel: `Week ${w + 1}`,
      weekStart: start.format("YYYY-MM-DD"),
      weekEnd: end.format("YYYY-MM-DD"),
      submittedOn: base === 0 ? start.add(5, "day").format("YYYY-MM-DD") : undefined,
      status: base === 0 ? "Approved" : base === 1 ? "Submitted" : "Draft",
      rows,
    })
  }
})

const notifications: NotificationItem[] = [
  { id: "not-1", employeeId: "emp-005", title: "Timesheet reminder", detail: "Week 3 timesheet is pending submission.", createdAt: "2026-04-16T10:30:00", read: false },
  { id: "not-2", employeeId: "emp-005", title: "Leave approved", detail: "Your casual leave for Apr 22 is approved.", createdAt: "2026-04-14T08:10:00", read: false },
  { id: "not-3", title: "Policy update", detail: "Attendance policy v2.1 published.", createdAt: "2026-04-11T14:00:00", read: true },
  { id: "not-4", employeeId: "emp-005", title: "Salary credited", detail: "March 2026 salary credited successfully.", createdAt: "2026-04-01T09:00:00", read: false },
  { id: "not-5", employeeId: "emp-005", title: "Payslip generated", detail: "Your March 2026 payslip is now available.", createdAt: "2026-04-01T09:05:00", read: false },
]

const salaryStructures: SalaryStructure[] = employees
  .filter((employee) => employee.role !== "Director")
  .map((employee, index) => {
    const basic = 90000 + index * 7500
    const allowances = Math.round(basic * 0.3)
    const deductions = Math.round(basic * 0.08)
    const bonus = index % 3 === 0 ? 8000 : 0
    const performanceBonus = index % 4 === 0 ? 6000 : 0
    return {
      employeeId: employee.id,
      month: "2026-03",
      basic,
      allowances,
      deductions,
      bonus,
      performanceBonus,
      net: basic + allowances + bonus + performanceBonus - deductions,
      status: "Disbursed",
      disbursedOn: "2026-04-01",
    }
  })

const payslips: Payslip[] = salaryStructures.map((salary) => ({
  id: `payslip-${salary.employeeId}-${salary.month}`,
  employeeId: salary.employeeId,
  month: salary.month,
  generatedOn: "2026-04-01T09:00:00",
  netAmount: salary.net,
  downloadUrl: "#",
}))

const reimbursementClaims: ReimbursementClaim[] = [
  {
    id: "reimb-001",
    employeeId: "emp-005",
    submittedOn: "2026-04-12",
    category: "Travel",
    amount: 7500,
    billName: "uber-receipt-apr12.pdf",
    reason: "Client meeting transportation",
    status: "Pending Finance Review",
    leadDecisionOn: "2026-04-13",
  },
  {
    id: "reimb-002",
    employeeId: "emp-009",
    submittedOn: "2026-04-09",
    category: "Equipment",
    amount: 18200,
    billName: "tablet-accessories.pdf",
    reason: "Design review accessories",
    status: "Approved",
    leadDecisionOn: "2026-04-10",
    financeDecisionOn: "2026-04-11",
  },
  {
    id: "reimb-003",
    employeeId: "emp-012",
    submittedOn: "2026-04-08",
    category: "Medical",
    amount: 5400,
    billName: "medical-bill.png",
    reason: "Onsite emergency medication",
    status: "Rejected",
    leadDecisionOn: "2026-04-09",
    financeDecisionOn: "2026-04-10",
    rejectionReason: "Incomplete receipt details",
  },
]

const procurementEntries: ProcurementEntry[] = [
  { id: "proc-001", employeeId: "emp-006", date: "2026-04-14", item: "HDMI adapters", department: "Engineering", amount: 3200, status: "Reimbursed" },
  { id: "proc-002", employeeId: "emp-010", date: "2026-04-11", item: "Printing material", department: "Design", amount: 1850, status: "Pending" },
  { id: "proc-003", employeeId: "emp-011", date: "2026-04-05", item: "Welcome kits", department: "People", amount: 6900, status: "Reimbursed" },
]

const pettyCashEntries: PettyCashEntry[] = [
  { id: "pc-001", date: "2026-04-01", type: "Credit", amount: 100000, note: "Monthly petty cash top-up" },
  { id: "pc-002", date: "2026-04-04", type: "Debit", amount: 4500, department: "Design", note: "Urgent print material" },
  { id: "pc-003", date: "2026-04-07", type: "Debit", amount: 2300, department: "Engineering", note: "Consumables" },
  { id: "pc-004", date: "2026-04-15", type: "Credit", amount: 15000, note: "Mid-month refill" },
]

const policyDocuments: PolicyDocument[] = [
  {
    id: "pol-001",
    title: "Attendance Compliance Policy",
    category: "Attendance",
    version: "v2.1",
    effectiveDate: "2026-04-01",
    updatedBy: "emp-014",
    summary: "Defines check-in window, late policy, and remote attendance protocol.",
  },
  {
    id: "pol-002",
    title: "Annual Leave Policy",
    category: "Leave",
    version: "v1.7",
    effectiveDate: "2026-03-10",
    updatedBy: "emp-014",
    summary: "Defines annual leave limits, approval matrix, and carry-forward rules.",
  },
  {
    id: "pol-003",
    title: "Workplace Code of Conduct",
    category: "Code of Conduct",
    version: "v1.2",
    effectiveDate: "2026-01-15",
    updatedBy: "emp-014",
    summary: "Outlines expected professional behavior and grievance protocol.",
  },
]

const leavePolicyRules: LeavePolicyRule[] = [
  { type: "Sick Leave", annualLimit: 10, carryForward: false, minNoticeDays: 0 },
  { type: "Casual Leave", annualLimit: 7, carryForward: false, minNoticeDays: 1 },
  { type: "Annual Leave", annualLimit: 15, carryForward: true, minNoticeDays: 7 },
  { type: "Time In Lieu", annualLimit: 5, carryForward: false, minNoticeDays: 2 },
]

const quarterlyProgressRecords: QuarterlyProgressRecord[] = employees
  .filter((employee) => employee.role !== "Director")
  .flatMap((employee, index) => {
    const q1Overall = 72 + (index % 16)
    const q2Overall = Math.min(98, q1Overall + 2 + (index % 4))
    return [
      {
        id: `qpr-${employee.id}-2026-q1`,
        employeeId: employee.id,
        year: 2026,
        quarter: "Q1" as const,
        kpiScore: Math.max(60, q1Overall - 3),
        collaborationScore: Math.max(62, q1Overall - 1),
        deliveryScore: Math.max(58, q1Overall - 4),
        overallScore: q1Overall,
        reviewDate: "2026-04-10",
        nextQuarterDate: "2026-07-05",
        remarks: "Strong execution with room to improve documentation quality.",
      },
      {
        id: `qpr-${employee.id}-2026-q2`,
        employeeId: employee.id,
        year: 2026,
        quarter: "Q2" as const,
        kpiScore: Math.max(63, q2Overall - 2),
        collaborationScore: Math.max(65, q2Overall - 1),
        deliveryScore: Math.max(61, q2Overall - 3),
        overallScore: q2Overall,
        reviewDate: "2026-07-12",
        nextQuarterDate: "2026-10-05",
        remarks: "Noticeable improvement in ownership and cross-team communication.",
      },
    ]
  })

export const loginUsers = [
  { email: "director@datanox.com", password: "director123", employeeId: "emp-001", role: "Director" as Role },
  { email: "lead@datanox.com", password: "lead123", employeeId: "emp-002", role: "Lead" as Role },
  { email: "employee@datanox.com", password: "employee123", employeeId: "emp-005", role: "Employee" as Role },
  { email: "finance@datanox.com", password: "finance123", employeeId: "emp-013", role: "Finance Manager" as Role },
  { email: "hr@datanox.com", password: "hr123", employeeId: "emp-014", role: "HR Manager" as Role },
]

export const leaveBalanceTemplate = {
  "Sick Leave": { remaining: 8, total: 10 },
  "Casual Leave": { remaining: 5, total: 7 },
  "Annual Leave": { remaining: 12, total: 15 },
  "Time In Lieu": { remaining: 3, total: 5 },
}

export const mockData = {
  employees,
  teams,
  attendanceRecords,
  leaveRequests,
  timesheets,
  timesheetMonthsCurrentYear,
  holidays2026,
  notifications,
  projectsByCategory,
  salaryStructures,
  payslips,
  reimbursementClaims,
  procurementEntries,
  pettyCashEntries,
  policyDocuments,
  leavePolicyRules,
  quarterlyProgressRecords,
}



