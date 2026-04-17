import type { ElementType } from "react"
import { NavLink } from "react-router-dom"
import {
  Calendar,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  LogOut,
  ShieldCheck,
  Users2,
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"
import { cn } from "@/lib/utils"
import { initials } from "@/utils/formatters"
import { BrandLogo } from "@/components/app/brand-logo"

type NavItem = {
  to: string
  label: string
  icon: ElementType
  roles: Array<"Director" | "Lead" | "Employee">
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Director", "Lead", "Employee"] },
  { to: "/attendance/checkin", label: "Check In", icon: CheckSquare, roles: ["Director", "Lead", "Employee"] },
  { to: "/attendance/list", label: "Attendance", icon: ListChecks, roles: ["Director", "Lead", "Employee"] },
  { to: "/leave/request", label: "Leave", icon: ClipboardList, roles: ["Director", "Lead", "Employee"] },
  { to: "/timesheet", label: "Timesheet", icon: ClipboardList, roles: ["Director", "Lead", "Employee"] },
  { to: "/calendar", label: "Calendar", icon: Calendar, roles: ["Director", "Lead", "Employee"] },
  { to: "/team", label: "Team", icon: Users2, roles: ["Director", "Lead"] },
  { to: "/approvals", label: "Approvals", icon: ShieldCheck, roles: ["Director", "Lead"] },
  { to: "/profile", label: "Profile", icon: UserCircle2, roles: ["Director", "Lead", "Employee"] },
]

export function Sidebar() {
  const { role, currentUser, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  if (!role || !currentUser) return null

  return (
    <aside className={cn("relative border-r border-zinc-200 bg-white transition-all duration-300", sidebarCollapsed ? "w-[86px]" : "w-[265px]")}>
      <div className="h-16 border-b border-zinc-200 px-4 flex items-center justify-between">
        <BrandLogo showText={!sidebarCollapsed} imageClassName="rounded-lg" />
        <button onClick={toggleSidebar} className="text-zinc-500 hover:text-zinc-900">
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-3 rounded-lg border border-[#F56B1F]/20 bg-[#F56B1F]/5 p-3"
        >
          <div className="flex items-center gap-2 text-xs text-[#1A1A2E]">
            <Sparkles size={14} className="text-[#F56B1F]" />
            Productivity mode enabled
          </div>
        </motion.div>
      )}

      <nav className="p-3 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive ? "bg-[#F56B1F]/10 text-[#F56B1F]" : "text-zinc-600 hover:bg-zinc-100",
                    sidebarCollapsed && "justify-center"
                  )
                }
              >
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                {!sidebarCollapsed && item.label}
              </NavLink>
            )
          })}
      </nav>

      <div className="mt-auto p-3 border-t border-zinc-200 absolute bottom-0 left-0 right-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#F56B1F]/15 text-[#F56B1F] grid place-items-center text-sm font-semibold">
            {initials(currentUser.name)}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-zinc-500">{role}</p>
              </div>
              <button onClick={logout} className="ml-auto text-zinc-500 hover:text-red-600"><LogOut size={16} /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
