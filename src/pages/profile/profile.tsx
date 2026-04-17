import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import { BellRing, IdCard, KeyRound, PhoneCall, Save, UserRound } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { AnimatedIcon } from "@/components/app/animated-icon"
import { useAuthStore } from "@/store/authStore"
import { useAttendanceStore } from "@/store/attendanceStore"
import { useLeaveStore } from "@/store/leaveStore"
import { initials } from "@/utils/formatters"

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuthStore()
  const records = useAttendanceStore((state) => state.records)
  const leaves = useLeaveStore((state) => state.requests)

  const [name, setName] = useState(currentUser?.name ?? "")
  const [contact, setContact] = useState(currentUser?.contact ?? "")
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact ?? "")

  const stats = useMemo(() => {
    if (!currentUser) return { presentPct: 0, leavesUsed: 0, avgCheckIn: "-" }
    const monthRecords = records.filter((record) => record.employeeId === currentUser.id && dayjs(record.date).isSame(dayjs(), "month"))
    const presentCount = monthRecords.filter((record) => record.status === "Present" || record.status === "Late").length
    const avg = monthRecords.filter((record) => record.checkIn).map((record) => Number(record.checkIn?.split(":")[0]))
    const avgCheck = avg.length ? `${Math.round(avg.reduce((a, b) => a + b, 0) / avg.length)}:00` : "-"

    return {
      presentPct: monthRecords.length ? Math.round((presentCount / monthRecords.length) * 100) : 0,
      leavesUsed: leaves.filter((item) => item.employeeId === currentUser.id && item.status === "Approved").length,
      avgCheckIn: avgCheck,
    }
  }, [currentUser, leaves, records])

  if (!currentUser) return null

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 border-[#F56B1F]/20 bg-[linear-gradient(130deg,#fff,#fff5ef)]">
          <CardHeader><CardTitle className="text-xl flex items-center gap-2"><AnimatedIcon icon={UserRound} size={24} className="text-[#F56B1F]" /> Employee Profile</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3 text-sm">
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border bg-white p-3">Present %<p className="text-2xl font-semibold">{stats.presentPct}%</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border bg-white p-3">Leave Used<p className="text-2xl font-semibold">{stats.leavesUsed}</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border bg-white p-3">Avg Check-in<p className="text-2xl font-semibold">{stats.avgCheckIn}</p></motion.div>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border bg-white p-3">Role<p className="text-2xl font-semibold">{currentUser.role}</p></motion.div>
          </CardContent>
        </Card>
        <AiGuidanceCard text="Keep emergency contacts up to date and maintain a stable check-in pattern to improve punctuality metrics." />
      </div>

      <Card>
        <CardContent className="pt-6 grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4 space-y-2 bg-zinc-50">
            <div className="h-16 w-16 rounded-full bg-[#F56B1F]/15 text-[#F56B1F] font-semibold grid place-items-center text-2xl">{initials(currentUser.name)}</div>
            <p className="font-semibold text-lg">{currentUser.name}</p>
            <p className="text-sm text-zinc-500">{currentUser.role} - {currentUser.department}</p>
            <p className="text-sm flex items-center gap-2"><IdCard size={16} /> {currentUser.employeeId}</p>
            <p className="text-sm flex items-center gap-2"><PhoneCall size={16} /> {currentUser.contact}</p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Contact</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Emergency Contact</Label><Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} /></div>
            </div>

            <Button className="bg-[#F56B1F] hover:bg-[#df5d15] gap-2" onClick={() => { updateProfile({ name, contact, emergencyContact }); toast.success("Profile updated") }}>
              <Save size={18} /> Save Profile
            </Button>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><KeyRound size={16} /> Password Change (dummy)</Label>
              <div className="grid md:grid-cols-3 gap-2">
                <Input type="password" placeholder="Current" />
                <Input type="password" placeholder="New" />
                <Input type="password" placeholder="Confirm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><BellRing size={16} /> Notification Preferences</Label>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm">Email notifications</span>
                <Checkbox />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm">Approval alerts</span>
                <Checkbox />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
