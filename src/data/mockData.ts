import dayjs from "dayjs"

export type Role = "Director" | "Lead" | "Employee"

export type Employee = {
  id: string
  name: string
  role: Role
  department: string
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

const employees: Employee[] = [
  { id: "emp-001", name: "Ayesha Khan", role: "Director", department: "Operations", teamId: "team-ops", employeeId: "DNX-1001", contact: "+92-300-1001001", emergencyContact: "Ali Khan +92-300-0001111" },
  { id: "emp-002", name: "Bilal Ahmed", role: "Lead", department: "Engineering", teamId: "team-eng", managerId: "emp-001", employeeId: "DNX-1002", contact: "+92-300-1001002", emergencyContact: "Sara Ahmed +92-300-0002222" },
  { id: "emp-003", name: "Hina Tariq", role: "Lead", department: "Design", teamId: "team-design", managerId: "emp-001", employeeId: "DNX-1003", contact: "+92-300-1001003", emergencyContact: "Umar Tariq +92-300-0003333" },
  { id: "emp-004", name: "Usman Raza", role: "Lead", department: "People", teamId: "team-people", managerId: "emp-001", employeeId: "DNX-1004", contact: "+92-300-1001004", emergencyContact: "Maha Raza +92-300-0004444" },
  { id: "emp-005", name: "Syed Aliyaan Ahmed", role: "Employee", department: "Engineering", teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1005", contact: "+92-300-1001005", emergencyContact: "Zain Fatima +92-300-0005555" },
  { id: "emp-006", name: "Ibrahim Saeed", role: "Employee", department: "Engineering", teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1006", contact: "+92-300-1001006", emergencyContact: "Nida Saeed +92-300-0006666" },
  { id: "emp-007", name: "Mariam Ali", role: "Employee", department: "Engineering", teamId: "team-eng", managerId: "emp-002", employeeId: "DNX-1007", contact: "+92-300-1001007", emergencyContact: "Asad Ali +92-300-0007777" },
  { id: "emp-008", name: "Hamza Noor", role: "Employee", department: "Design", teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1008", contact: "+92-300-1001008", emergencyContact: "Sana Noor +92-300-0008888" },
  { id: "emp-009", name: "Kiran Shah", role: "Employee", department: "Design", teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1009", contact: "+92-300-1001009", emergencyContact: "Farhan Shah +92-300-0009999" },
  { id: "emp-010", name: "Daniyal Anwar", role: "Employee", department: "Design", teamId: "team-design", managerId: "emp-003", employeeId: "DNX-1010", contact: "+92-300-1001010", emergencyContact: "Hiba Anwar +92-300-0010101" },
  { id: "emp-011", name: "Sana Javed", role: "Employee", department: "People", teamId: "team-people", managerId: "emp-004", employeeId: "DNX-1011", contact: "+92-300-1001011", emergencyContact: "Waleed Javed +92-300-0011111" },
  { id: "emp-012", name: "Taha Qureshi", role: "Employee", department: "People", teamId: "team-people", managerId: "emp-004", employeeId: "DNX-1012", contact: "+92-300-1001012", emergencyContact: "Areeba Qureshi +92-300-0012121" },
]

const teams: Team[] = [
  { id: "team-eng", name: "Engineering", leadId: "emp-002", memberIds: ["emp-005", "emp-006", "emp-007"] },
  { id: "team-design", name: "Design", leadId: "emp-003", memberIds: ["emp-008", "emp-009", "emp-010"] },
  { id: "team-people", name: "People", leadId: "emp-004", memberIds: ["emp-011", "emp-012"] },
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

const monthStart = dayjs("2026-02-01")

employees.forEach((employee, empIndex) => {
  for (let m = 0; m < 3; m += 1) {
    const start = monthStart.add(m, "month").startOf("month")
    const end = start.endOf("month")

    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
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
  { id: "not-1", title: "Timesheet reminder", detail: "Week 3 timesheet is pending submission.", createdAt: "2026-04-16T10:30:00", read: false },
  { id: "not-2", title: "Leave approved", detail: "Your casual leave for Apr 22 is approved.", createdAt: "2026-04-14T08:10:00", read: false },
  { id: "not-3", title: "Policy update", detail: "Attendance policy v2.1 published.", createdAt: "2026-04-11T14:00:00", read: true },
]

export const loginUsers = [
  { email: "director@datanox.com", password: "director123", employeeId: "emp-001", role: "Director" as Role },
  { email: "lead@datanox.com", password: "lead123", employeeId: "emp-002", role: "Lead" as Role },
  { email: "employee@datanox.com", password: "employee123", employeeId: "emp-005", role: "Employee" as Role },
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
  holidays2026,
  notifications,
  projectsByCategory,
}



