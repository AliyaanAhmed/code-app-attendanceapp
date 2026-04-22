import dayjs from "dayjs"
import { Bell, Calendar1, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useAppStore } from "@/store/appStore"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/attendance/checkin": "Attendance Check-In",
  "/attendance/list": "Attendance List",
  "/leave/request": "Leave Request",
  "/timesheet": "Timesheet",
  "/calendar": "Calendar & Holidays",
  "/team": "Team Hierarchy",
  "/approvals": "Approvals",
  "/finance": "Finance Dashboard",
  "/finance/payroll": "Payroll Management",
  "/finance/payslips": "Payslip Center",
  "/finance/reimbursements": "Reimbursements",
  "/finance/procurement": "Procurement",
  "/finance/petty-cash": "Petty Cash",
  "/hr": "HR Dashboard",
  "/hr/policies": "Policy Center",
  "/hr/employees": "Employee Lifecycle",
  "/hr/leave-rules": "Leave Rules",
  "/profile": "Profile",
}

export function HeaderBar() {
  const location = useLocation()
  const { notifications, markAllRead } = useAppStore()
  const unread = notifications.filter((item) => !item.read).length
  const title = useMemo(() => titles[location.pathname] ?? "Datanox", [location.pathname])

  return (
    <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-[#1A1A2E] flex items-center gap-2">
        <Sparkles size={19} className="text-[#F56B1F]" /> {title}
      </h1>
      <div className="flex items-center gap-4">
        <p className="text-sm text-zinc-500 flex items-center gap-2"><Calendar1 size={16} /> {dayjs().format("ddd, MMM DD, YYYY")}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={markAllRead}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        >
          <Bell size={20} />
          {unread > 0 && <span className="absolute -top-1 -right-1 rounded-full bg-[#F56B1F] text-white text-[10px] px-1.5 py-0.5">{unread}</span>}
        </motion.button>
      </div>
    </header>
  )
}
