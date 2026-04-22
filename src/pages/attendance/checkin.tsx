import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { BadgeCheck, Building2, CheckCircle2, Clock3, Home, Loader2, MapPin, Navigation, TimerReset, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { DatanoxAssistantCharacter } from "@/components/app/datanox-assistant-character"
import { useAuthStore } from "@/store/authStore"
import { useAttendanceStore } from "@/store/attendanceStore"
import dayjs from "dayjs"

type WorkMode = "onsite" | "wfh"
type CheckActionState = "idle" | "loading" | "success" | "error"
type CharacterEvent = "idle" | "checkin" | "checkout"

const OFFICE = { lat: 24.8619, lon: 67.0728, label: "Karachi, PK - Datanox Office" }

const toRad = (n: number) => (n * Math.PI) / 180
const distanceKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
  const R = 6371
  const dLat = toRad(bLat - aLat)
  const dLon = toRad(bLon - aLon)
  const aa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa)))
}

const mapEmbed = (lat: number, lon: number) => {
  const spread = 0.03
  const left = lon - spread
  const right = lon + spread
  const top = lat + spread
  const bottom = lat - spread
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`
}

export default function AttendanceCheckInPage() {
  const user = useAuthStore((state) => state.currentUser)
  const records = useAttendanceStore((state) => state.records)
  const checkInAt = useAttendanceStore((state) => state.checkInAt)
  const checkOutAt = useAttendanceStore((state) => state.checkOutAt)

  const [now, setNow] = useState(dayjs())
  const [workMode, setWorkMode] = useState<WorkMode>("wfh")
  const [characterEvent, setCharacterEvent] = useState<CharacterEvent>("idle")
  const [actionState, setActionState] = useState<CheckActionState>("idle")
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [locationMessage, setLocationMessage] = useState("Allow location access to validate on-site/WFH attendance.")

  useEffect(() => {
    const id = window.setInterval(() => setNow(dayjs()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const detectLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setLocationMessage("Geolocation not supported in this browser.")
      setWorkMode("wfh")
      return { mode: "wfh" as WorkMode, label: "Karachi, PK - Work From Home", coords: null as { lat: number; lon: number } | null }
    }

    return new Promise<{ mode: WorkMode; label: string; coords: { lat: number; lon: number } | null }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setCoords({ lat, lon })

          const km = distanceKm(lat, lon, OFFICE.lat, OFFICE.lon)
          const mode: WorkMode = km <= 1.5 ? "onsite" : "wfh"
          const label = mode === "onsite" ? `${OFFICE.label} - On Site` : "Karachi, PK - Work From Home"
          setWorkMode(mode)
          setLocationMessage(mode === "onsite" ? `On-site validated (${km.toFixed(2)} km from office).` : `WFH validated (${km.toFixed(2)} km from office).`)
          resolve({ mode, label, coords: { lat, lon } })
        },
        () => {
          setWorkMode("wfh")
          setLocationMessage("Location permission denied. Fallback to WFH mode.")
          resolve({ mode: "wfh", label: "Karachi, PK - Work From Home", coords: null })
        },
        { enableHighAccuracy: true, timeout: 7000 }
      )
    })
  }, [])

  useEffect(() => {
    void detectLocation().catch(() => undefined)
  }, [detectLocation])

  if (!user) return null

  const today = dayjs().format("YYYY-MM-DD")
  const record = records.find((item) => item.employeeId === user.id && item.date === today)
  const checkedIn = Boolean(record?.checkIn)
  const checkedOut = Boolean(record?.checkOut)

  const elapsed = useMemo(() => {
    if (!record?.checkIn || record?.checkOut) return record?.durationHours ?? 0
    return dayjs().diff(dayjs(`${dayjs().format("YYYY-MM-DD")} ${record.checkIn}`), "minute") / 60
  }, [record])

  const progress = Math.min((elapsed / 8) * 100, 100)

  const onCheckIn = async () => {
    setActionState("loading")
    const info = await detectLocation()
    try {
      setCharacterEvent("idle")
      setCharacterEvent("checkin")
      await checkInAt(user.id, info.label)
      setActionState("success")
      toast.success(`Checked in successfully (${info.mode === "onsite" ? "On-Site" : "WFH"})`)
      window.setTimeout(() => {
        setActionState("idle")
        setCharacterEvent("idle")
      }, 1500)
    } catch {
      setActionState("error")
      setCharacterEvent("idle")
      toast.error("Unable to check in right now. Please retry.")
    }
  }

  const onCheckOut = async () => {
    setActionState("loading")
    try {
      setCharacterEvent("checkout")
      await checkOutAt(user.id)
      setActionState("success")
      toast.success("Checked out successfully")
      window.setTimeout(() => {
        setActionState("idle")
        setCharacterEvent("idle")
      }, 1200)
    } catch {
      setActionState("error")
      setCharacterEvent("idle")
      toast.error("Unable to check out right now. Please retry.")
    }
  }

  const locationLabel = record?.location ?? (workMode === "onsite" ? `${OFFICE.label} - On Site` : "Karachi, PK - Work From Home")

  return (
    <PageTransition>
      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-[#F56B1F]/20 bg-[linear-gradient(145deg,#fff,#fff4ed)]">
          <CardHeader className="text-center pb-1">
            <CardTitle className="flex items-center justify-center gap-2 text-[#1A1A2E]"><Clock3 size={24} className="text-[#F56B1F]" /> Smart Check-In Console</CardTitle>
            <p className="text-zinc-600 text-sm">{now.format("dddd, MMM DD, YYYY")}</p>
          </CardHeader>

          <CardContent className="space-y-5 text-center">
            <motion.p key={now.format("hh:mm:ss")} initial={{ opacity: 0.5, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl font-semibold tracking-wide text-[#1A1A2E]">
              {now.format("hh:mm:ss A")}
            </motion.p>

            <DatanoxAssistantCharacter mode={workMode} event={characterEvent} className="mx-auto" />

            <div className="mx-auto flex w-fit rounded-full border border-zinc-200 bg-white p-1">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${workMode === "onsite" ? "bg-emerald-100 text-emerald-700" : "text-zinc-600"}`}>
                <Building2 size={18} /> On Site
              </div>
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${workMode === "wfh" ? "bg-blue-100 text-blue-700" : "text-zinc-600"}`}>
                <Home size={18} /> Work From Home
              </div>
            </div>

            <div className="flex justify-center">
              {!checkedIn && (
                <motion.div className="relative" animate={{ scale: actionState === "loading" ? 1 : [1, 1.04, 1] }} transition={{ repeat: actionState === "loading" ? 0 : Infinity, duration: 1.8 }}>
                  <motion.div className="pointer-events-none absolute -inset-3 rounded-full border-2 border-[#F56B1F]/35" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.8 }} />
                  <Button size="lg" disabled={actionState === "loading"} className="h-24 w-24 rounded-full bg-[#F56B1F] hover:bg-[#df5d15] text-white text-base" onClick={onCheckIn}>
                    {actionState === "loading" ? <Loader2 size={22} className="animate-spin" /> : actionState === "error" ? <XCircle size={22} /> : actionState === "success" ? <CheckCircle2 size={22} /> : "In"}
                  </Button>
                </motion.div>
              )}

              {checkedIn && !checkedOut && (
                <motion.div initial={{ scale: 0.9, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}>
                  <Button size="lg" disabled={actionState === "loading"} className="h-24 w-24 rounded-full bg-red-500 hover:bg-red-600 text-white text-base" onClick={onCheckOut}>
                    {actionState === "loading" ? <Loader2 size={22} className="animate-spin" /> : actionState === "error" ? <XCircle size={22} /> : actionState === "success" ? <CheckCircle2 size={22} /> : "Out"}
                  </Button>
                </motion.div>
              )}

              {checkedOut && <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-emerald-100 px-6 py-4 text-emerald-700 font-medium">Shift Completed</motion.div>}
            </div>

            {actionState === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-full max-w-md rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {checkedIn && !checkedOut ? "You are successfully checked in." : "You are successfully checked out."}
              </motion.div>
            )}

            <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-md bg-zinc-50 p-3 text-left">
                  <p className="text-zinc-500 flex items-center gap-2"><MapPin size={16} /> Mode</p>
                  <p className="font-medium">{workMode === "onsite" ? "On Site" : "WFH"}</p>
                </div>
                <div className="rounded-md bg-zinc-50 p-3 text-left">
                  <p className="text-zinc-500 flex items-center gap-2"><Navigation size={16} /> Location</p>
                  <p className="font-medium line-clamp-2">{locationLabel}</p>
                </div>
                <div className="rounded-md bg-zinc-50 p-3 text-left">
                  <p className="text-zinc-500 flex items-center gap-2"><TimerReset size={16} /> Elapsed</p>
                  <p className="font-medium">{elapsed.toFixed(2)}h</p>
                </div>
              </div>

              <div className="mt-4 h-3 w-full rounded-full bg-zinc-200 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#F56B1F] to-[#fb8f55]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
              <p className="mt-2 text-xs text-zinc-500">Workday progress: {Math.round(progress)}% of 8-hour target</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BadgeCheck size={20} className="text-[#F56B1F]" /> Today&apos;s Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2"><span>Check In</span><span className="font-medium">{record?.checkIn ?? "-"}</span></div>
              <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2"><span>Check Out</span><span className="font-medium">{record?.checkOut ?? "-"}</span></div>
              <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2"><span>Status</span><StatusBadge value={record?.status === "Late" ? "Late" : "On Time"} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Navigation size={20} className="text-[#F56B1F]" /> Location Map</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-zinc-600">{locationMessage}</p>
              {coords ? (
                <iframe title="Current location map" src={mapEmbed(coords.lat, coords.lon)} className="h-52 w-full rounded-lg border" loading="lazy" />
              ) : (
                <div className="h-52 grid place-items-center rounded-lg border bg-zinc-50 text-zinc-500">Waiting for location permission...</div>
              )}
            </CardContent>
          </Card>

          <AiGuidanceCard text="Your check-in location is validated against office coordinates before attendance is persisted." />
        </div>
      </div>
    </PageTransition>
  )
}
