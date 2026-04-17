import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Download, Search, Users, XCircle, AlarmClockOff, Plane } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useAttendanceStore } from "@/store/attendanceStore"
import { useAuthStore } from "@/store/authStore"
import dayjs from "dayjs"
import { downloadCsv, toCsv } from "@/utils/formatters"

const PAGE_SIZE = 10

export default function AttendanceListPage() {
  const user = useAuthStore((state) => state.currentUser)
  const records = useAttendanceStore((state) => state.records)
  const [status, setStatus] = useState("All")
  const [search, setSearch] = useState("")
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"))
  const [page, setPage] = useState(1)

  if (!user) return null

  const filtered = useMemo(() => {
    return records
      .filter((record) => record.employeeId === user.id)
      .filter((record) => dayjs(record.date).format("YYYY-MM") === month)
      .filter((record) => (status === "All" ? true : record.status === status))
      .filter((record) => record.date.includes(search))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [month, records, search, status, user.id])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const summary = {
    present: filtered.filter((record) => record.status === "Present").length,
    absent: filtered.filter((record) => record.status === "Absent").length,
    late: filtered.filter((record) => record.status === "Late").length,
    leave: filtered.filter((record) => record.status === "Leave").length,
  }

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(140deg,#fff,#fff5ef)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={Users} size={24} className="text-[#F56B1F]" /> Attendance Command Center</CardTitle>
            <p className="text-sm text-zinc-600">{dayjs(`${month}-01`).format("MMMM YYYY")}: you were present {summary.present} out of {filtered.length} working days.</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3 text-sm">
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">Present <p className="text-2xl font-semibold text-emerald-700">{summary.present}</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-red-200 bg-red-50 p-3">Absent <p className="text-2xl font-semibold text-red-700">{summary.absent}</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-orange-200 bg-orange-50 p-3">Late <p className="text-2xl font-semibold text-orange-700">{summary.late}</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-amber-200 bg-amber-50 p-3">Leave <p className="text-2xl font-semibold text-amber-700">{summary.leave}</p></motion.div>
          </CardContent>
        </Card>

        <AiGuidanceCard text={`Showing ${filtered.length} records for ${dayjs(`${month}-01`).format("MMMM YYYY")}. Your punctuality is trending ${summary.late <= 2 ? "excellent" : "improving"}.`} />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-3">
            <Input type="month" value={month} onChange={(e) => { setMonth(e.target.value); setPage(1) }} className="focus-visible:ring-[#F56B1F]" />
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Leave">Leave</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative md:col-span-2">
              <Search size={20} className="absolute left-3 top-2.5 text-zinc-400" />
              <Input placeholder="Search by date (YYYY-MM-DD)" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-10" />
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Day</TableHead><TableHead>Check-In</TableHead><TableHead>Check-Out</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b hover:bg-zinc-50"
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{dayjs(row.date).format("ddd")}</TableCell>
                    <TableCell>{row.checkIn ?? "-"}</TableCell>
                    <TableCell>{row.checkOut ?? "-"}</TableCell>
                    <TableCell>{row.durationHours.toFixed(1)}h</TableCell>
                    <TableCell><StatusBadge value={row.status} /></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="gap-1">View</Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                const csv = toCsv(
                  ["Date", "Day", "Check-In", "Check-Out", "Duration", "Status"],
                  filtered.map((row) => [row.date, dayjs(row.date).format("ddd"), row.checkIn ?? "-", row.checkOut ?? "-", row.durationHours.toFixed(1), row.status])
                )
                downloadCsv(`attendance-${month}.csv`, csv)
                toast.success("CSV exported")
              }}
            >
              <Download size={18} /> Export CSV
            </Button>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="flex items-center gap-1"><Users size={16} /> {summary.present}</span>
              <span className="flex items-center gap-1"><AlarmClockOff size={16} /> {summary.late}</span>
              <span className="flex items-center gap-1"><XCircle size={16} /> {summary.absent}</span>
              <span className="flex items-center gap-1"><Plane size={16} /> {summary.leave}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <span className="text-sm">Page {page} / {totalPages}</span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
