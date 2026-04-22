import { create } from "zustand"
import dayjs from "dayjs"
import { mockData, type TimesheetRow, type TimesheetStatus, type TimesheetWeek } from "@/data/mockData"

type TimesheetState = {
  weeks: TimesheetWeek[]
  addRow: (weekId: string) => void
  addSampleRow: (weekId: string) => void
  ensureMonthWeeks: (employeeId: string, month: string) => void
  updateRow: (weekId: string, rowId: string, payload: Partial<TimesheetRow>) => void
  deleteRow: (weekId: string, rowId: string) => void
  saveDraft: (weekId: string) => void
  submitWeek: (weekId: string) => Promise<void>
  updateWeekStatus: (weekId: string, status: TimesheetStatus) => void
  getEmployeeWeeks: (employeeId: string) => TimesheetWeek[]
  getEmployeeWeeksByMonth: (employeeId: string, month: string) => TimesheetWeek[]
}

const blankHours = () => ({ Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 })

const generateWeeksForMonth = (employeeId: string, month: string) => {
  const start = dayjs(`${month}-01`).startOf("month")
  const end = start.endOf("month")
  const weeks: TimesheetWeek[] = []

  let cursor = start
  let weekNo = 1

  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    const weekStart = cursor
    const weekEnd = cursor.add(4, "day").isAfter(end) ? end : cursor.add(4, "day")

    weeks.push({
      id: `week-${employeeId}-${month}-${weekNo}`,
      employeeId,
      weekLabel: `Week ${weekNo}`,
      weekStart: weekStart.format("YYYY-MM-DD"),
      weekEnd: weekEnd.format("YYYY-MM-DD"),
      status: "Draft",
      rows: [
        {
          id: `row-${employeeId}-${month}-${weekNo}-1`,
          category: "Development",
          project: "Datanox Portal",
          task: "",
          taskType: "Billable",
          hours: blankHours(),
        },
      ],
    })

    weekNo += 1
    cursor = cursor.add(7, "day")
  }

  return weeks
}

const seedCurrentYearMonthCoverage = (weeks: TimesheetWeek[]) => {
  const seeded = [...weeks]

  for (const employee of mockData.employees) {
    for (const month of mockData.timesheetMonthsCurrentYear) {
      const exists = seeded.some((week) => week.employeeId === employee.id && dayjs(week.weekStart).format("YYYY-MM") === month)
      if (!exists) {
        seeded.push(...generateWeeksForMonth(employee.id, month))
      }
    }
  }

  return seeded
}

export const useTimesheetStore = create<TimesheetState>((set, get) => ({
  weeks: seedCurrentYearMonthCoverage(mockData.timesheets),
  addRow: (weekId) => {
    const newRow: TimesheetRow = {
      id: `row-${Date.now()}`,
      category: "Development",
      project: "Datanox Portal",
      task: "",
      taskType: "Billable",
      hours: blankHours(),
    }

    set((state) => ({
      weeks: state.weeks.map((week) => (week.id === weekId && week.status === "Draft" ? { ...week, rows: [...week.rows, newRow] } : week)),
    }))
  },
  addSampleRow: (weekId) => {
    const sampleRow: TimesheetRow = {
      id: `sample-${Date.now()}`,
      category: "Development",
      project: "Power Apps Integration",
      task: "Worked on attendance dashboard widgets and chart interactions",
      taskType: "Billable",
      hours: { Mon: 2, Tue: 3, Wed: 2, Thu: 4, Fri: 3 },
    }

    set((state) => ({
      weeks: state.weeks.map((week) => (week.id === weekId && week.status === "Draft" ? { ...week, rows: [...week.rows, sampleRow] } : week)),
    }))
  },
  ensureMonthWeeks: (employeeId, month) => {
    const exists = get().weeks.some((week) => week.employeeId === employeeId && dayjs(week.weekStart).format("YYYY-MM") === month)
    if (exists) return
    const created = generateWeeksForMonth(employeeId, month)
    set((state) => ({ weeks: [...state.weeks, ...created] }))
  },
  updateRow: (weekId, rowId, payload) => {
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id !== weekId || week.status !== "Draft"
          ? week
          : { ...week, rows: week.rows.map((row) => (row.id === rowId ? { ...row, ...payload } : row)) }
      ),
    }))
  },
  deleteRow: (weekId, rowId) => {
    set((state) => ({
      weeks: state.weeks.map((week) => (week.id !== weekId || week.status !== "Draft" ? week : { ...week, rows: week.rows.filter((row) => row.id !== rowId) })),
    }))
  },
  saveDraft: (weekId) => {
    set((state) => ({ weeks: state.weeks.map((week) => (week.id === weekId ? { ...week, status: "Draft" } : week)) }))
  },
  submitWeek: async (weekId) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    set((state) => ({
      weeks: state.weeks.map((week) => (week.id === weekId ? { ...week, status: "Submitted", submittedOn: dayjs().format("YYYY-MM-DD") } : week)),
    }))
  },
  updateWeekStatus: (weekId, status) => {
    set((state) => ({ weeks: state.weeks.map((week) => (week.id === weekId ? { ...week, status } : week)) }))
  },
  getEmployeeWeeks: (employeeId) => get().weeks.filter((week) => week.employeeId === employeeId),
  getEmployeeWeeksByMonth: (employeeId, month) => get().weeks.filter((week) => week.employeeId === employeeId && dayjs(week.weekStart).format("YYYY-MM") === month),
}))
