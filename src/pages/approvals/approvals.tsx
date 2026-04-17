import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useLeaveStore } from "@/store/leaveStore"
import { useTimesheetStore } from "@/store/timesheetStore"
import { useAuthStore } from "@/store/authStore"
import { mockData } from "@/data/mockData"

export default function ApprovalsPage() {
  const user = useAuthStore((state) => state.currentUser)
  const { requests, updateRequestStatus } = useLeaveStore()
  const { weeks, updateWeekStatus } = useTimesheetStore()
  const [statusFilter, setStatusFilter] = useState("All")

  if (!user) return null

  const teamMemberIds = useMemo(() => {
    if (user.role === "Director") {
      return mockData.employees.filter((emp) => emp.role !== "Director").map((emp) => emp.id)
    }
    return mockData.employees.filter((emp) => emp.managerId === user.id).map((emp) => emp.id)
  }, [user.id, user.role])

  const leaveRows = requests.filter((item) => teamMemberIds.includes(item.employeeId)).filter((item) => statusFilter === "All" ? true : item.status === statusFilter)
  const timesheetRows = weeks.filter((item) => teamMemberIds.includes(item.employeeId)).filter((item) => statusFilter === "All" ? true : item.status === statusFilter)

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={ShieldCheck} size={24} className="text-[#F56B1F]" /> Approvals Workspace</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>

        <AiGuidanceCard text={`You have ${leaveRows.filter((r) => r.status === "Pending").length} leave and ${timesheetRows.filter((r) => r.status === "Submitted").length} timesheet decisions pending.`} />
      </div>

      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="timesheet">Timesheets</TabsTrigger>
        </TabsList>

        <TabsContent value="leave">
          <Card>
            <CardHeader><CardTitle>Leave Approvals</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Reason</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRows.map((item, i) => (
                    <motion.tr key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="border-b hover:bg-zinc-50">
                      <TableCell>{mockData.employees.find((emp) => emp.id === item.employeeId)?.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.fromDate} to {item.toDate}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.days}</TableCell>
                      <TableCell><StatusBadge value={item.status} /></TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" className="gap-1" disabled={item.status !== "Pending"} onClick={() => { updateRequestStatus(item.id, "Approved"); toast.success("Leave approved") }}><CheckCircle2 size={16} />Approve</Button>
                        <Button size="sm" variant="outline" className="gap-1" disabled={item.status !== "Pending"} onClick={() => {
                          const reason = window.prompt("Reason for rejection")
                          if (!reason) return
                          updateRequestStatus(item.id, "Rejected", reason)
                          toast.success("Leave rejected")
                        }}><XCircle size={16} />Reject</Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheet">
          <Card>
            <CardHeader><CardTitle>Timesheet Approvals</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead><TableHead>Week</TableHead><TableHead>Hours Logged</TableHead><TableHead>Submitted On</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheetRows.map((item, i) => {
                    const hours = item.rows.reduce((sum, row) => sum + Object.values(row.hours).reduce((a, b) => a + b, 0), 0)
                    return (
                      <motion.tr key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="border-b hover:bg-zinc-50">
                        <TableCell>{mockData.employees.find((emp) => emp.id === item.employeeId)?.name}</TableCell>
                        <TableCell>{item.weekLabel}</TableCell>
                        <TableCell>{hours}</TableCell>
                        <TableCell>{item.submittedOn ?? "-"}</TableCell>
                        <TableCell><StatusBadge value={item.status} /></TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" className="gap-1" disabled={item.status !== "Submitted"} onClick={() => { updateWeekStatus(item.id, "Approved"); toast.success("Timesheet approved") }}><CheckCircle2 size={16} />Approve</Button>
                          <Button size="sm" variant="outline" className="gap-1" disabled={item.status !== "Submitted"} onClick={() => { updateWeekStatus(item.id, "Draft"); toast.success("Returned for changes") }}><XCircle size={16} />Return</Button>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  )
}
