import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Landmark, CalendarClock } from "lucide-react"
import dayjs from "dayjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { StatusBadge } from "@/components/app/status-badge"
import { useAttendanceStore } from "@/store/attendanceStore"
import { useAuthStore } from "@/store/authStore"
import { mockData } from "@/data/mockData"
import { getMonthDays } from "@/utils/dateHelpers"

export default function CalendarPage() {
  const user = useAuthStore((state) => state.currentUser)
  const records = useAttendanceStore((state) => state.records)
  const [month, setMonth] = useState(dayjs())
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"))

  if (!user) return null

  const days = getMonthDays(month)

  const selectedInfo = useMemo(() => {
    const holiday = mockData.holidays2026.find((item) => item.date === selected)
    if (holiday) return { type: "Holiday", label: holiday.name }

    const attendance = records.find((item) => item.employeeId === user.id && item.date === selected)
    if (attendance) return { type: attendance.status, label: `${attendance.checkIn ?? "-"} - ${attendance.checkOut ?? "-"}` }

    return { type: "Weekend", label: "No check-in required" }
  }, [records, selected, user.id])

  const upcoming = mockData.holidays2026.filter((item) => dayjs(item.date).isAfter(dayjs().subtract(1, "day"))).slice(0, 4)

  const dotClass = (date: dayjs.Dayjs) => {
    const key = date.format("YYYY-MM-DD")
    if (mockData.holidays2026.some((item) => item.date === key)) return "bg-[#F56B1F]"
    const rec = records.find((item) => item.employeeId === user.id && item.date === key)
    if (!rec) return date.day() === 0 || date.day() === 6 ? "bg-zinc-300" : "bg-zinc-200"
    if (rec.status === "Present") return "bg-emerald-500"
    if (rec.status === "Absent") return "bg-red-500"
    if (rec.status === "Leave") return "bg-amber-400"
    return "bg-orange-500"
  }

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(150deg,#fff,#fff6f0)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl"><AnimatedIcon icon={CalendarClock} size={24} className="text-[#F56B1F]" /> {month.format("MMMM YYYY")}</CardTitle>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border p-2 hover:bg-zinc-50" onClick={() => setMonth((prev) => prev.subtract(1, "month"))}><ChevronLeft size={20} /></button>
              <button className="rounded-lg border p-2 hover:bg-zinc-50" onClick={() => setMonth((prev) => prev.add(1, "month"))}><ChevronRight size={20} /></button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs text-zinc-500 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((date) => {
                const key = date.format("YYYY-MM-DD")
                const inMonth = date.month() === month.month()
                return (
                  <motion.button
                    key={key}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelected(key)}
                    className={`rounded-lg border p-2 text-left min-h-20 ${inMonth ? "bg-white" : "bg-zinc-50 text-zinc-400"} ${selected === key ? "border-[#F56B1F] shadow-sm" : "border-zinc-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{date.date()}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${dotClass(date)}`} />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <AiGuidanceCard text="Orange dots are public holidays. Click any date to inspect attendance and improve your consistency trend." />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Date Details</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="font-medium">{dayjs(selected).format("ddd, MMM DD, YYYY")}</p>
            <StatusBadge value={selectedInfo.type === "Holiday" ? "Leave" : selectedInfo.type} />
            <p>{selectedInfo.label}</p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Landmark size={21} className="text-[#F56B1F]" /> Upcoming Holidays</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
            {upcoming.map((holiday) => (
              <div key={holiday.date} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <p className="font-medium">{holiday.name}</p>
                <p className="text-zinc-500">{dayjs(holiday.date).format("MMM DD, YYYY")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
