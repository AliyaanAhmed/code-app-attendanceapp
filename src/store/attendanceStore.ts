import { create } from "zustand"
import dayjs from "dayjs"
import { mockData, type AttendanceRecord, type AttendanceStatus } from "@/data/mockData"

type AttendanceState = {
  records: AttendanceRecord[]
  liveCheckIn: string | null
  liveCheckOut: string | null
  checkInAt: (employeeId: string, locationLabel?: string) => Promise<AttendanceRecord>
  checkOutAt: (employeeId: string) => Promise<AttendanceRecord | undefined>
  getEmployeeRecords: (employeeId: string) => AttendanceRecord[]
  getTodayRecord: (employeeId: string) => AttendanceRecord | undefined
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: mockData.attendanceRecords,
  liveCheckIn: null,
  liveCheckOut: null,
  checkInAt: async (employeeId: string, locationLabel = "Karachi, PK - Office") => {
    await new Promise((resolve) => setTimeout(resolve, 650))
    const now = dayjs()
    const date = now.format("YYYY-MM-DD")
    const time = now.format("HH:mm")
    const current = get().records.find((r) => r.employeeId === employeeId && r.date === date)
    const status: AttendanceStatus = now.hour() >= 9 && now.minute() > 0 ? "Late" : "Present"

    let resultRecord: AttendanceRecord

    if (current) {
      resultRecord = { ...current, checkIn: time, status, location: locationLabel }
      const updated = get().records.map((r) => (r.id === current.id ? resultRecord : r))
      set({ records: updated, liveCheckIn: time, liveCheckOut: null })
      return resultRecord
    }

    resultRecord = {
      id: `${employeeId}-${now.format("YYYYMMDD")}`,
      employeeId,
      date,
      checkIn: time,
      checkOut: null,
      durationHours: 0,
      location: locationLabel,
      status,
    }

    set((state) => ({ records: [resultRecord, ...state.records], liveCheckIn: time, liveCheckOut: null }))
    return resultRecord
  },
  checkOutAt: async (employeeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 550))
    const now = dayjs()
    const date = now.format("YYYY-MM-DD")
    const time = now.format("HH:mm")

    let updatedRecord: AttendanceRecord | undefined

    const updated = get().records.map((record) => {
      if (record.employeeId !== employeeId || record.date !== date) {
        return record
      }
      const diff = record.checkIn ? dayjs(`${date} ${time}`).diff(dayjs(`${date} ${record.checkIn}`), "minute") / 60 : 0
      updatedRecord = { ...record, checkOut: time, durationHours: Math.max(diff, 0) }
      return updatedRecord
    })

    set({ records: updated, liveCheckOut: time })
    return updatedRecord
  },
  getEmployeeRecords: (employeeId: string) => get().records.filter((record) => record.employeeId === employeeId),
  getTodayRecord: (employeeId: string) => {
    const today = dayjs().format("YYYY-MM-DD")
    return get().records.find((record) => record.employeeId === employeeId && record.date === today)
  },
}))
