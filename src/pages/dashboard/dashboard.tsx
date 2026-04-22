import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Banknote,
  CalendarClock,
  CircleAlert,
  Clock3,
  FileText,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
  Landmark,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Timer,
  PlaneTakeoff,
  NotebookText,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/app/page-transition"
import { KpiCard } from "@/components/app/kpi-card"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { GreetingHeroCard } from "@/components/app/greeting-hero-card"
import { useAttendanceStore } from "@/store/attendanceStore"
import { useLeaveStore } from "@/store/leaveStore"
import { useTimesheetStore } from "@/store/timesheetStore"
import { useAuthStore } from "@/store/authStore"
import { useFinanceStore } from "@/store/financeStore"
import { useHrStore } from "@/store/hrStore"
import { mockData } from "@/data/mockData"
import dayjs from "dayjs"

const leaveColors = ["#F56B1F", "#EAB308", "#22C55E", "#71717A"]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.currentUser)
  const attendanceStore = useAttendanceStore()
  const leaves = useLeaveStore((state) => state.requests)
  const weeks = useTimesheetStore((state) => state.weeks)
  const salaries = useFinanceStore((state) => state.salaries)
  const reimbursements = useFinanceStore((state) => state.reimbursements)
  const policies = useHrStore((state) => state.policies)
  const hrEmployees = useHrStore((state) => state.employees)

  const today = dayjs().format("YYYY-MM-DD")

  const kpis = useMemo(() => {
    const todayRecords = attendanceStore.records.filter((record) => record.date === today)
    return {
      present: todayRecords.filter((record) => record.status === "Present").length,
      leave: todayRecords.filter((record) => record.status === "Leave").length,
      late: todayRecords.filter((record) => record.status === "Late").length,
      pendingApprovals: leaves.filter((item) => item.status === "Pending").length + weeks.filter((week) => week.status === "Submitted").length,
    }
  }, [attendanceStore.records, leaves, weeks, today])

  if (!user) return null

  const employeeRecords = attendanceStore.records.filter((record) => record.employeeId === user.id).sort((a, b) => a.date.localeCompare(b.date))

  const thisWeek = useMemo(() => {
    const start = dayjs().startOf("week")
    return employeeRecords.filter((record) => dayjs(record.date).isAfter(start.subtract(1, "day")))
  }, [employeeRecords])

  const weeklyAttendance = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
    const dayDate = dayjs().startOf("week").add(index + 1, "day")
    const record = employeeRecords.find((item) => item.date === dayDate.format("YYYY-MM-DD"))
    return { day, hours: record?.durationHours ?? 0, status: record?.status ?? "Absent" }
  })

  const leaveDistribution = useMemo(() => {
    const userLeaves = leaves.filter((item) => item.employeeId === user.id)
    const counts = {
      Sick: userLeaves.filter((item) => item.type === "Sick Leave").length,
      Casual: userLeaves.filter((item) => item.type === "Casual Leave").length,
      Annual: userLeaves.filter((item) => item.type === "Annual Leave").length,
      TIL: userLeaves.filter((item) => item.type === "Time In Lieu").length,
    }

    return Object.entries(counts).map(([name, value], idx) => ({ name, value, color: leaveColors[idx] }))
  }, [leaves, user.id])

  const monthlyTrend = useMemo(() => {
    const months = [dayjs().subtract(2, "month"), dayjs().subtract(1, "month"), dayjs()]
    return months.map((month) => {
      const monthRecords = employeeRecords.filter((item) => dayjs(item.date).isSame(month, "month"))
      const present = monthRecords.filter((item) => item.status === "Present" || item.status === "Late").length
      const punctual = monthRecords.filter((item) => item.status === "Present").length
      const attendancePct = monthRecords.length ? Math.round((present / monthRecords.length) * 100) : 0
      const punctualityPct = monthRecords.length ? Math.round((punctual / monthRecords.length) * 100) : 0
      return { month: month.format("MMM"), attendance: attendancePct, punctuality: punctualityPct }
    })
  }, [employeeRecords])

  const statusBreakdown = useMemo(() => {
    const monthRecords = employeeRecords.filter((item) => dayjs(item.date).isSame(dayjs(), "month"))
    return [
      { name: "Present", value: monthRecords.filter((item) => item.status === "Present").length },
      { name: "Late", value: monthRecords.filter((item) => item.status === "Late").length },
      { name: "Leave", value: monthRecords.filter((item) => item.status === "Leave").length },
      { name: "Absent", value: monthRecords.filter((item) => item.status === "Absent").length },
    ]
  }, [employeeRecords])

  const todayStatus = attendanceStore.getTodayRecord(user.id)
  const pendingTimesheet = weeks.find((week) => week.employeeId === user.id && week.status === "Draft")
  const currentPayroll = salaries.filter((salary) => salary.month === dayjs().subtract(1, "month").format("YYYY-MM"))
  const payrollTotal = currentPayroll.reduce((sum, salary) => sum + salary.net, 0)
  const pendingFinanceApprovals = reimbursements.filter((claim) => claim.status === "Pending Finance Review").length
  const activeEmployees = hrEmployees.filter((employee) => employee.isActive !== false).length

  return (
    <PageTransition>
      <GreetingHeroCard name={user.name} />

      <AiGuidanceCard text="You are tracking strong consistency this week with healthy attendance patterns." />

      {(user.role === "Finance Manager" || user.role === "HR Manager" || user.role === "Director") && (
        <div className="grid xl:grid-cols-3 gap-4">
          {(user.role === "Finance Manager" || user.role === "Director") && (
            <Card className="border-[#F56B1F]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Banknote className="text-[#F56B1F]" size={20} /> Finance Pulse</CardTitle>
                <CardDescription>Monthly disbursement and reimbursement queue.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="flex justify-between"><span>Payroll (last month)</span><span className="font-semibold">PKR {payrollTotal.toLocaleString()}</span></p>
                <p className="flex justify-between"><span>Pending reimbursement reviews</span><span className="font-semibold">{pendingFinanceApprovals}</span></p>
                <Button asChild size="sm" className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/finance">Open Finance Dashboard</Link></Button>
              </CardContent>
            </Card>
          )}

          {(user.role === "HR Manager" || user.role === "Director") && (
            <Card className="border-[#F56B1F]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="text-[#F56B1F]" size={20} /> HR Updates</CardTitle>
                <CardDescription>Policies, people operations and leave trends.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="flex justify-between"><span>Active employees</span><span className="font-semibold">{activeEmployees}</span></p>
                <p className="flex justify-between"><span>Latest policy version</span><span className="font-semibold">{policies[0]?.version ?? "-"}</span></p>
                <Button asChild size="sm" className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/hr">Open HR Dashboard</Link></Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-[#F56B1F]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CircleAlert className="text-[#F56B1F]" size={20} /> Company Alerts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="rounded-md bg-zinc-50 px-3 py-2">Salary and policy notifications are now role-prioritized.</p>
              <p className="rounded-md bg-zinc-50 px-3 py-2">Pending approvals are highlighted across departments.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Present Today" value={kpis.present} icon={<UserCheck size={24} />} />
        <KpiCard title="On Leave" value={kpis.leave} icon={<CalendarClock size={24} />} />
        <KpiCard title="Late Arrivals" value={kpis.late} icon={<Clock3 size={24} />} />
        <KpiCard title="Pending Approvals" value={kpis.pendingApprovals} icon={<CircleAlert size={24} />} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -4 }} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 size={24} className="text-[#F56B1F]" /> Weekly Attendance Hours</CardTitle>
              <CardDescription>Hover bars to inspect daily work hours and attendance state.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#fff3eb" }} />
                  <Legend />
                  <Bar dataKey="hours" name="Hours" radius={[8, 8, 0, 0]}>
                    {weeklyAttendance.map((entry) => <Cell key={entry.day} fill={entry.status === "Late" ? "#EAB308" : entry.status === "Absent" ? "#EF4444" : "#F56B1F"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieChartIcon size={24} className="text-[#F56B1F]" /> Leave Distribution</CardTitle>
              <CardDescription>Breakdown of your leave requests.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leaveDistribution} dataKey="value" innerRadius={55} outerRadius={90}>
                    {leaveDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -4 }} className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineChartIcon size={24} className="text-[#F56B1F]" /> Monthly Attendance vs Punctuality</CardTitle>
              <CardDescription>Trendline for reliability over the past three months.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#F56B1F" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="punctuality" stroke="#22C55E" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp size={24} className="text-[#F56B1F]" /> Status Pulse</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statusBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="value" fill="#F56B1F" stroke="#F56B1F" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Timer size={24} className="text-[#F56B1F]" /> Today&apos;s Status</CardTitle>
              <CardDescription>Check-in and productivity summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center justify-between"><span>Check-in</span><span className="font-medium">{todayStatus?.checkIn ?? "-"}</span></p>
              <p className="flex items-center justify-between"><span>Hours worked</span><span className="font-medium">{todayStatus?.durationHours.toFixed(1) ?? "0.0"}h</span></p>
              <StatusBadge value={todayStatus?.status ?? "Absent"} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Landmark size={24} className="text-[#F56B1F]" /> Upcoming Holidays</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {mockData.holidays2026.filter((holiday) => dayjs(holiday.date).isAfter(dayjs().subtract(1, "day"))).slice(0, 3).map((holiday) => (
                <div key={holiday.date} className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2">
                  <span>{holiday.name}</span>
                  <span className="text-zinc-500">{dayjs(holiday.date).format("MMM DD")}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ArrowUpRight size={24} className="text-[#F56B1F]" /> Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="group w-full justify-between bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/attendance/checkin">Check In <Clock3 size={22} className="transition group-hover:translate-x-0.5" /></Link></Button>
              <Button asChild className="group w-full justify-between" variant="outline"><Link to="/leave/request">Request Leave <PlaneTakeoff size={22} className="transition group-hover:translate-x-0.5" /></Link></Button>
              <Button asChild className="group w-full justify-between" variant="outline"><Link to="/timesheet">View Timesheet <NotebookText size={22} className="transition group-hover:translate-x-0.5" /></Link></Button>
              {pendingTimesheet && <p className="text-xs text-amber-600">Pending timesheet alert: {pendingTimesheet.weekLabel} is unsubmitted.</p>}
              <p className="text-xs text-zinc-500">This week: {thisWeek.filter((item) => item.status === "Present" || item.status === "Late").length} active days logged.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}
