import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import type { Role } from "@/data/mockData"

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export function RoleGuard({ allowedRoles }: { allowedRoles: Role[] }) {
  const { role } = useAuthStore()
  if (!role) return <Navigate to="/" replace />
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />
}
