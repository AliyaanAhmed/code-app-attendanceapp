import { motion } from "framer-motion"
import { Crown, Users2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useAuthStore } from "@/store/authStore"
import { useAttendanceStore } from "@/store/attendanceStore"
import { mockData } from "@/data/mockData"
import dayjs from "dayjs"
import { initials } from "@/utils/formatters"

export default function TeamPage() {
  const user = useAuthStore((state) => state.currentUser)
  const records = useAttendanceStore((state) => state.records)

  if (!user) return null

  const visibleTeams = user.role === "Director"
    ? mockData.teams
    : mockData.teams.filter((team) => team.leadId === user.id)

  const today = dayjs().format("YYYY-MM-DD")

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(130deg,#fff,#fff4ed)]">
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={Users2} size={24} className="text-[#F56B1F]" /> Organization Hierarchy</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border border-[#F56B1F]/30 bg-[#F56B1F]/5 p-4 inline-flex items-center gap-2">
              <Crown size={20} className="text-[#F56B1F]" />
              <div>
                <p className="text-xs text-zinc-500">Director</p>
                <p className="font-semibold">{mockData.employees.find((item) => item.role === "Director")?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <AiGuidanceCard text="Leads can monitor only direct teams, while directors get the full org-wide attendance pulse." />
      </div>

      {visibleTeams.map((team) => {
        const lead = mockData.employees.find((emp) => emp.id === team.leadId)
        const members = mockData.employees.filter((emp) => team.memberIds.includes(emp.id))

        return (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name} Team</CardTitle>
              <p className="text-sm text-zinc-500">Lead: {lead?.name}</p>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
              {members.map((member, i) => {
                const rec = records.find((item) => item.employeeId === member.id && item.date === today)
                const attendancePct = Math.round((records.filter((r) => r.employeeId === member.id && (r.status === "Present" || r.status === "Late")).length / records.filter((r) => r.employeeId === member.id).length) * 100)
                const leaves = mockData.leaveRequests.filter((item) => item.employeeId === member.id && item.status === "Approved").length
                const pending = mockData.timesheets.filter((item) => item.employeeId === member.id && item.status === "Submitted").length

                return (
                  <motion.div key={member.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }}>
                    <Card className="h-full border-zinc-200 hover:shadow-lg transition">
                      <CardContent className="pt-5 space-y-2">
                        <div className="h-12 w-12 rounded-full bg-[#F56B1F]/15 text-[#F56B1F] grid place-items-center font-semibold text-base">{initials(member.name)}</div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-zinc-500">{member.role}</p>
                        <StatusBadge value={rec?.status ?? "Absent"} />
                        <div className="text-xs text-zinc-500 space-y-1">
                          <p>Attendance: {attendancePct}%</p>
                          <p>Leaves Taken: {leaves}</p>
                          <p>Pending Timesheets: {pending}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </PageTransition>
  )
}
