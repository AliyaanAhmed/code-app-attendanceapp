import { useMemo, useState } from "react"
import dayjs from "dayjs"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CalendarDays, FilePlus2, Send, ShieldCheck, Stethoscope, Umbrella } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useLeaveStore } from "@/store/leaveStore"
import { useAuthStore } from "@/store/authStore"
import { businessDaysBetween } from "@/utils/dateHelpers"

const leaveIcons: Record<string, typeof Stethoscope> = {
  "Sick Leave": Stethoscope,
  "Casual Leave": Umbrella,
  "Annual Leave": CalendarDays,
  "Time In Lieu": ShieldCheck,
}

export default function LeaveRequestPage() {
  const user = useAuthStore((state) => state.currentUser)
  const { leaveBalance, createRequest, getEmployeeRequests } = useLeaveStore()

  const [type, setType] = useState("Annual Leave")
  const [fromDate, setFromDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [toDate, setToDate] = useState(dayjs().add(2, "day").format("YYYY-MM-DD"))
  const [reason, setReason] = useState("")
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const days = useMemo(() => businessDaysBetween(fromDate, toDate), [fromDate, toDate])
  const history = getEmployeeRequests(user.id)
  const selectedBalance = leaveBalance[(type === "Time In Lieu" ? "Time In Lieu" : type) as keyof typeof leaveBalance]

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={CalendarDays} size={24} className="text-[#F56B1F]" /> Leave Experience Center</CardTitle>
            <p className="text-sm text-zinc-600">Plan time off with a smoother request flow and instant balance visibility.</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(leaveBalance).map(([key, value], idx) => {
              const Icon = leaveIcons[key]
              return (
                <motion.div key={key} whileHover={{ y: -4 }} className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">{key}</p>
                    <AnimatedIcon icon={Icon} size={20} className={idx === 0 ? "text-red-500" : idx === 1 ? "text-amber-500" : idx === 2 ? "text-emerald-500" : "text-[#F56B1F]"} />
                  </div>
                  <p className="mt-1 text-xl font-semibold text-[#1A1A2E]">{value.remaining}/{value.total}</p>
                  <Progress value={(value.remaining / value.total) * 100} className="mt-2 h-2 [&>div]:bg-[#F56B1F]" />
                </motion.div>
              )
            })}
          </CardContent>
        </Card>

        <AiGuidanceCard text={`You are requesting ${days} day(s). You have ${selectedBalance.remaining} ${type.toLowerCase()} days available.`} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><FilePlus2 size={21} className="text-[#F56B1F]" /> New Leave Request</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Time In Lieu">Time In Lieu (TIL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attach Document</Label>
                <Input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
                {fileName && <p className="text-xs text-zinc-500">Attached: {fileName}</p>}
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="rounded-xl border border-[#F56B1F]/20 bg-[#fff8f4] p-3 text-sm">
              <p>You are requesting <strong>{days}</strong> business day(s) of leave.</p>
              <p className="text-zinc-600">Remaining balance after request: <strong>{Math.max(0, selectedBalance.remaining - days)}</strong></p>
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Write reason for leave" rows={4} />
            </div>

            <Button
              className="bg-[#F56B1F] hover:bg-[#df5d15] gap-2"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                await createRequest({
                  employeeId: user.id,
                  type: type === "Time In Lieu" ? "Time In Lieu" : (type as "Sick Leave" | "Casual Leave" | "Annual Leave" | "Time In Lieu"),
                  fromDate,
                  toDate,
                  reason,
                  days,
                })
                setLoading(false)
                toast.success("Leave request submitted")
                setReason("")
              }}
            >
              <Send size={18} /> {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Request Preview</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-zinc-500">Type</p><p className="font-medium">{type}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-zinc-500">Duration</p><p className="font-medium">{fromDate} to {toDate}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-zinc-500">Days</p><p className="font-medium">{days} day(s)</p>
            </div>
            <AiGuidanceCard title="Smart Tip" text="Use casual leave for short breaks and preserve annual leave for long planned vacations." />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Leave History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.fromDate} - {item.toDate}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.days} day(s)</TableCell>
                  <TableCell><StatusBadge value={item.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
