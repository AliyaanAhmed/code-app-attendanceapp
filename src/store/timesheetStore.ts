import { create } from "zustand"
import dayjs from "dayjs"
import { mockData, type TimesheetRow, type TimesheetStatus, type TimesheetWeek } from "@/data/mockData"

type TimesheetState = {
  weeks: TimesheetWeek[]
  addRow: (weekId: string) => void
  addSampleRow: (weekId: string) => void
  updateRow: (weekId: string, rowId: string, payload: Partial<TimesheetRow>) => void
  deleteRow: (weekId: string, rowId: string) => void
  saveDraft: (weekId: string) => void
  submitWeek: (weekId: string) => Promise<void>
  updateWeekStatus: (weekId: string, status: TimesheetStatus) => void
  getEmployeeWeeks: (employeeId: string) => TimesheetWeek[]
}

const blankHours = () => ({ Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 })

export const useTimesheetStore = create<TimesheetState>((set, get) => ({
  weeks: mockData.timesheets,
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
      weeks: state.weeks.map((week) =>
        week.id === weekId && week.status === "Draft"
          ? { ...week, rows: [...week.rows, newRow] }
          : week
      ),
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
      weeks: state.weeks.map((week) =>
        week.id === weekId && week.status === "Draft"
          ? { ...week, rows: [...week.rows, sampleRow] }
          : week
      ),
    }))
  },
  updateRow: (weekId, rowId, payload) => {
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id !== weekId || week.status !== "Draft"
          ? week
          : {
              ...week,
              rows: week.rows.map((row) => (row.id === rowId ? { ...row, ...payload } : row)),
            }
      ),
    }))
  },
  deleteRow: (weekId, rowId) => {
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id !== weekId || week.status !== "Draft"
          ? week
          : { ...week, rows: week.rows.filter((row) => row.id !== rowId) }
      ),
    }))
  },
  saveDraft: (weekId) => {
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id === weekId ? { ...week, status: "Draft" } : week
      ),
    }))
  },
  submitWeek: async (weekId) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id === weekId
          ? { ...week, status: "Submitted", submittedOn: dayjs().format("YYYY-MM-DD") }
          : week
      ),
    }))
  },
  updateWeekStatus: (weekId, status) => {
    set((state) => ({
      weeks: state.weeks.map((week) =>
        week.id === weekId ? { ...week, status } : week
      ),
    }))
  },
  getEmployeeWeeks: (employeeId) => get().weeks.filter((week) => week.employeeId === employeeId),
}))
