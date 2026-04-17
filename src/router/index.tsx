import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/layouts/auth-layout"
import { AppLayout } from "@/layouts/app-layout"
import { ProtectedRoute, RoleGuard } from "@/router/guards"
import LoginPage from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard/dashboard"
import AttendanceCheckInPage from "@/pages/attendance/checkin"
import AttendanceListPage from "@/pages/attendance/list"
import LeaveRequestPage from "@/pages/leave/request"
import TimesheetPage from "@/pages/timesheet/timesheet"
import CalendarPage from "@/pages/calendar/calendar"
import TeamPage from "@/pages/team/team"
import ApprovalsPage from "@/pages/approvals/approvals"
import ProfilePage from "@/pages/profile/profile"
import NotFoundPage from "@/pages/not-found"

const BASENAME = new URL(".", location.href).pathname
if (location.pathname.endsWith("/index.html")) {
  history.replaceState(null, "", BASENAME + location.search + location.hash)
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFoundPage />,
      children: [{ index: true, element: <LoginPage /> }],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "/dashboard", element: <DashboardPage /> },
            { path: "/attendance/checkin", element: <AttendanceCheckInPage /> },
            { path: "/attendance/list", element: <AttendanceListPage /> },
            { path: "/leave/request", element: <LeaveRequestPage /> },
            { path: "/timesheet", element: <TimesheetPage /> },
            { path: "/calendar", element: <CalendarPage /> },
            { path: "/profile", element: <ProfilePage /> },
            {
              element: <RoleGuard allowedRoles={["Director", "Lead"]} />,
              children: [
                { path: "/team", element: <TeamPage /> },
                { path: "/approvals", element: <ApprovalsPage /> },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: BASENAME }
)
