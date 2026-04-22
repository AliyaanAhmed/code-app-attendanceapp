import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import { AlertTriangle, CalendarClock, FlaskConical, PlusCircle, Save, Send, Trash2, Timer, Wrench } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useTimesheetStore } from "@/store/timesheetStore"
import { useAuthStore } from "@/store/authStore"
import { mockData } from "@/data/mockData"
import { cn } from "@/lib/utils"

const dayKeys: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri"> = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const categories = ["Development", "Design", "Management", "Leave", "Other"] as const

export default function TimesheetPage() {
  const user = useAuthStore((state) => state.currentUser)
  const { getEmployeeWeeks, getEmployeeWeeksByMonth, ensureMonthWeeks, addRow, addSampleRow, updateRow, deleteRow, saveDraft, submitWeek } = useTimesheetStore()

  const monthOptions = mockData.timesheetMonthsCurrentYear

  const [month, setMonth] = useState(dayjs().format("YYYY-MM"))

  useEffect(() => {
    if (!user) return
    ensureMonthWeeks(user.id, month)
  }, [ensureMonthWeeks, month, user])

  if (!user) return null

  const allWeeks = getEmployeeWeeks(user.id)
  const weeks = getEmployeeWeeksByMonth(user.id, month)

  const [selectedWeek, setSelectedWeek] = useState("")

  useEffect(() => {
    setSelectedWeek((prev) => {
      if (prev && weeks.some((w) => w.id === prev)) {
        return prev
      }
      return weeks.find((w) => w.status === "Draft")?.id ?? weeks[0]?.id ?? ""
    })
  }, [weeks, month])

  const active = weeks.find((week) => week.id === selectedWeek) ?? weeks[0]
  if (!active) return null
  const tabsValue = weeks.some((w) => w.id === selectedWeek) ? selectedWeek : active.id

  const isReadOnly = active.status !== "Draft"

  const weeklyTotal = useMemo(() => active.rows.reduce((total, row) => total + dayKeys.reduce((sum, key) => sum + Number(row.hours[key] ?? 0), 0), 0), [active.rows])

  const missingMonths = useMemo(() => {
    return monthOptions.filter((m) => {
      const monthWeeks = allWeeks.filter((week) => dayjs(week.weekStart).format("YYYY-MM") === m)
      if (monthWeeks.length === 0) return true
      return monthWeeks.some((w) => w.status === "Draft")
    })
  }, [allWeeks, monthOptions])

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(130deg,#fff,#fff4ed)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={Wrench} size={24} className="text-[#F56B1F]" /> Timesheet Studio</CardTitle>
            <p className="text-sm text-zinc-600">Only current-year months are accessible. Future months are locked by policy.</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {dayjs(`${m}-01`).format("MMMM YYYY")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-zinc-600"><Timer size={16} /> Weekly Total: <strong>{weeklyTotal}/40 hrs</strong></div>
            <Progress value={(weeklyTotal / 40) * 100} className="w-56 h-2 [&>div]:bg-[#F56B1F]" />
          </CardContent>
        </Card>

        <AiGuidanceCard text={`Timesheet submission is critical for salary disbursement. Missing months: ${missingMonths.length ? missingMonths.map((m) => dayjs(`${m}-01`).format("MMM")).join(", ") : "None"}.`} />
      </div>

      {missingMonths.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle size={18} className="mt-0.5" />
          <div>
            <p className="font-semibold">Pending Timesheets May Delay Salary Processing</p>
            <p>Complete all pending months promptly to avoid disbursement delays.</p>
          </div>
        </div>
      )}

      <Tabs value={tabsValue} onValueChange={setSelectedWeek}>
        <TabsList className="h-auto w-full grid grid-cols-1 gap-2 rounded-xl border border-zinc-200 bg-white p-2 md:grid-cols-2 xl:grid-cols-5">
          {weeks.map((week) => {
            const activeWeek = tabsValue === week.id
            return (
              <TabsTrigger
                key={week.id}
                value={week.id}
                className={cn(
                  "h-auto rounded-lg border p-3",
                  activeWeek ? "!border-[#F56B1F] !bg-[#f56b1fd9] !text-white" : "border-zinc-200 bg-white text-zinc-700"
                )}
              >
                <div className="w-full text-left">
                  <p className="text-sm font-semibold">{week.weekLabel}</p>
                  <p className={`mt-0.5 text-[11px] ${activeWeek ? "text-white/90" : "text-zinc-500"}`}>{dayjs(week.weekStart).format("MMM DD")} - {dayjs(week.weekEnd).format("MMM DD")}</p>
                  <div className="mt-2"><StatusBadge value={week.status} /></div>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {weeks.map((week) => {
          const current = week.id === active.id ? active : week
          return (
            <TabsContent key={week.id} value={week.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock size={18} className="text-[#F56B1F]" />
                    {dayjs(current.weekStart).format("MMM DD")} - {dayjs(current.weekEnd).format("MMM DD, YYYY")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 overflow-auto">
                  {!isReadOnly ? (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="gap-2" onClick={() => addRow(current.id)}><PlusCircle size={18} /> Add Blank Row</Button>
                      <Button variant="outline" className="gap-2" onClick={() => { addSampleRow(current.id); toast.success("Sample row added") }}><FlaskConical size={18} /> Add Sample Record</Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">This week is read-only. Returned or draft weeks are editable.</div>
                  )}

                  <table className="w-full min-w-[980px] text-sm border border-zinc-200 rounded-lg overflow-hidden">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Project/Leave</th>
                        <th className="p-2 text-left">Task</th>
                        <th className="p-2 text-left">Task Type</th>
                        {dayKeys.map((day) => <th className="p-2" key={day}>{day}</th>)}
                        <th className="p-2">Total</th>
                        <th className="p-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {current.rows.map((row, idx) => {
                        const total = dayKeys.reduce((sum, key) => sum + Number(row.hours[key] ?? 0), 0)
                        const projects = mockData.projectsByCategory[row.category]
                        return (
                          <motion.tr key={row.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="border-t border-zinc-200 hover:bg-zinc-50/80">
                            <td className="p-2 min-w-[170px]"><Select value={row.category} onValueChange={(value) => !isReadOnly && updateRow(current.id, row.id, { category: value as typeof row.category })} disabled={isReadOnly}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></td>
                            <td className="p-2 min-w-[180px]"><Select value={row.project} onValueChange={(value) => !isReadOnly && updateRow(current.id, row.id, { project: value })} disabled={isReadOnly}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{projects.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></td>
                            <td className="p-2 min-w-[190px]"><Input value={row.task} readOnly={isReadOnly} onChange={(e) => updateRow(current.id, row.id, { task: e.target.value })} /></td>
                            <td className="p-2 min-w-[160px]"><Select value={row.taskType} onValueChange={(value) => !isReadOnly && updateRow(current.id, row.id, { taskType: value as typeof row.taskType })} disabled={isReadOnly}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Billable">Billable</SelectItem><SelectItem value="Non-Billable">Non-Billable</SelectItem><SelectItem value="Internal">Internal</SelectItem></SelectContent></Select></td>
                            {dayKeys.map((day) => (
                              <td key={day} className="p-2 w-20"><Input type="number" min={0} max={24} readOnly={isReadOnly} value={row.hours[day]} onChange={(e) => { const value = Number(e.target.value); const hours = { ...row.hours, [day]: Math.max(0, Math.min(24, value)) }; updateRow(current.id, row.id, { hours }) }} /></td>
                            ))}
                            <td className="p-2 text-center font-medium">{total}</td>
                            <td className="p-2 text-center"><Button size="icon" variant="ghost" disabled={isReadOnly} onClick={() => deleteRow(current.id, row.id)}><Trash2 size={18} /></Button></td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2" disabled={isReadOnly} onClick={() => { saveDraft(current.id); toast.success("Draft saved") }}><Save size={18} /> Save Draft</Button>
                    <Button className="bg-[#F56B1F] hover:bg-[#df5d15] gap-2" disabled={isReadOnly} onClick={async () => { if (!window.confirm("Submit this week to lead?")) return; await submitWeek(current.id); toast.success("Timesheet submitted") }}><Send size={18} /> Submit to Lead</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </PageTransition>
  )
}
