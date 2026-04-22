import { useMemo } from "react"
import { Link } from "react-router-dom"
import { BellRing, ClipboardList, FileText, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/app/page-transition"
import { KpiCard } from "@/components/app/kpi-card"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { mockData } from "@/data/mockData"
import { useHrStore } from "@/store/hrStore"
import { useLeaveStore } from "@/store/leaveStore"

export default function HrDashboardPage() {
  const policies = useHrStore((state) => state.policies)
  const employees = useHrStore((state) => state.employees)
  const leaveRequests = useLeaveStore((state) => state.requests)

  const activeEmployees = employees.filter((employee) => employee.isActive !== false).length
  const pendingLeave = leaveRequests.filter((request) => request.status === "Pending").length
  const latestPolicies = useMemo(() => [...policies].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate)).slice(0, 3), [policies])

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Users className="text-[#F56B1F]" /> HR Operations Dashboard</CardTitle>
          <CardDescription>Policy governance, employee lifecycle, and organization-wide people insights.</CardDescription>
        </CardHeader>
      </Card>

      <AiGuidanceCard text={`You currently have ${pendingLeave} pending leave cases and ${latestPolicies.length} recent policy updates to communicate.`} />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Active Employees" value={activeEmployees} icon={<Users size={22} />} />
        <KpiCard title="Pending Leave Cases" value={pendingLeave} icon={<ClipboardList size={22} />} />
        <KpiCard title="Policy Documents" value={policies.length} icon={<FileText size={22} />} />
        <KpiCard title="Announcements" value={mockData.notifications.length} icon={<BellRing size={22} />} />
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Latest Policy Updates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {latestPolicies.map((policy) => (
              <div key={policy.id} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="font-medium">{policy.title}</p>
                <p className="text-xs text-zinc-500">{policy.category} | {policy.version} | Effective {policy.effectiveDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Leave Trends (Snapshot)</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {["Sick Leave", "Casual Leave", "Annual Leave", "Time In Lieu"].map((type) => (
              <div key={type} className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2">
                <span>{type}</span>
                <span className="font-medium">{leaveRequests.filter((request) => request.type === type).length} requests</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>HR Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-2">
          <Button asChild className="bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/hr/policies">Manage Policies</Link></Button>
          <Button asChild variant="outline"><Link to="/hr/employees">Employee Lifecycle</Link></Button>
          <Button asChild variant="outline"><Link to="/hr/leave-rules">Review Leave Rules</Link></Button>
          <Button asChild variant="outline"><Link to="/hr/quarterly-progress">Quarterly Progress</Link></Button>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
