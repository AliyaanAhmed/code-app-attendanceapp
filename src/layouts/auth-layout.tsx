import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff,_#f4f4f5_38%,_#e4e4e7)]">
      <Outlet />
    </div>
  )
}
