import { useState } from "react"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { ChartColumnIncreasing } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useHrStore } from "@/store/hrStore"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"
import { mockData } from "@/data/mockData"

export default function QuarterlyProgressPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const records = useHrStore((state) => state.quarterlyProgress)
  const upsertQuarterlyProgress = useHrStore((state) => state.upsertQuarterlyProgress)
  const addNotification = useAppStore((state) => state.addNotification)

  const [employeeId, setEmployeeId] = useState("")
  const [year, setYear] = useState(dayjs().year())
  const [quarter, setQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1")
  const [kpiScore, setKpiScore] = useState(80)
  const [collaborationScore, setCollaborationScore] = useState(80)
  const [deliveryScore, setDeliveryScore] = useState(80)
  const [reviewDate, setReviewDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [nextQuarterDate, setNextQuarterDate] = useState(dayjs().add(3, "month").format("YYYY-MM-DD"))
  const [remarks, setRemarks] = useState("")

  if (!currentUser) return null

  const canManage = currentUser.role === "HR Manager" || currentUser.role === "Director"
  const scoped = canManage ? records : records.filter((record) => record.employeeId === currentUser.id)
  const years = Array.from(new Set(scoped.map((record) => record.year))).sort((a, b) => b - a)
  const defaultYear = years.length ? years[0] : dayjs().year()
  const [selectedYear, setSelectedYear] = useState(defaultYear)
  const filtered = scoped.filter((record) => record.year === selectedYear)
  const upcomingReview = filtered
    .map((record) => dayjs(record.nextQuarterDate))
    .filter((date) => date.isAfter(dayjs().subtract(1, "day")))
    .sort((a, b) => a.valueOf() - b.valueOf())[0]

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2"><ChartColumnIncreasing className="text-[#F56B1F]" /> Quarterly Progress</CardTitle>
          <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(years.length ? years : [dayjs().year()]).map((value) => (
                <SelectItem key={value} value={String(value)}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <AiGuidanceCard
        text={
          upcomingReview
            ? `Next quarterly review meeting is on ${upcomingReview.format("DD MMM YYYY")}. Keep your KPI evidence and achievements ready.`
            : "No upcoming quarter meeting is scheduled yet. HR can publish the next quarter timeline."
        }
      />

      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Quarter Scores ({selectedYear})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {canManage && <TableHead>Employee</TableHead>}
                  <TableHead>Quarter</TableHead>
                  <TableHead>KPI</TableHead>
                  <TableHead>Collaboration</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Next Quarter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    {canManage && <TableCell>{mockData.employees.find((employee) => employee.id === record.employeeId)?.name}</TableCell>}
                    <TableCell>{record.quarter}</TableCell>
                    <TableCell>{record.kpiScore}</TableCell>
                    <TableCell>{record.collaborationScore}</TableCell>
                    <TableCell>{record.deliveryScore}</TableCell>
                    <TableCell className="font-semibold">{record.overallScore}</TableCell>
                    <TableCell>{record.reviewDate}</TableCell>
                    <TableCell>{record.nextQuarterDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {canManage && (
          <Card>
            <CardHeader><CardTitle>Publish Quarter Score</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {mockData.employees.filter((employee) => employee.role !== "Director").map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" value={year} onChange={(event) => setYear(Number(event.target.value || dayjs().year()))} placeholder="Year" />
                <Select value={quarter} onValueChange={(value) => setQuarter(value as typeof quarter)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Q1", "Q2", "Q3", "Q4"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Input type="number" value={kpiScore} onChange={(event) => setKpiScore(Number(event.target.value || 0))} placeholder="KPI score" />
              <Input type="number" value={collaborationScore} onChange={(event) => setCollaborationScore(Number(event.target.value || 0))} placeholder="Collaboration score" />
              <Input type="number" value={deliveryScore} onChange={(event) => setDeliveryScore(Number(event.target.value || 0))} placeholder="Delivery score" />
              <div className="space-y-1">
                <Label>Review Date</Label>
                <Input type="date" value={reviewDate} onChange={(event) => setReviewDate(event.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Next Quarter Date</Label>
                <Input type="date" value={nextQuarterDate} onChange={(event) => setNextQuarterDate(event.target.value)} />
              </div>
              <Input value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks" />
              <Button
                className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"
                onClick={() => {
                  if (!employeeId) {
                    toast.error("Please select an employee.")
                    return
                  }
                  const overall = Math.round((kpiScore + collaborationScore + deliveryScore) / 3)
                  upsertQuarterlyProgress({
                    employeeId,
                    year,
                    quarter,
                    kpiScore,
                    collaborationScore,
                    deliveryScore,
                    overallScore: overall,
                    reviewDate,
                    nextQuarterDate,
                    remarks,
                  })
                  addNotification({
                    employeeId,
                    title: "Quarterly progress updated",
                    detail: `${quarter} ${year} review was published. Overall score: ${overall}.`,
                  })
                  toast.success("Quarter score published")
                }}
              >
                Save Quarter Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
