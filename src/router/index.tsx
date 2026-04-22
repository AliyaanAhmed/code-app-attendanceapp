import { Suspense, lazy, type ReactNode } from "react"
import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/layouts/auth-layout"
import { AppLayout } from "@/layouts/app-layout"
import { ProtectedRoute, RoleGuard } from "@/router/guards"
import { RouteLoader } from "@/components/app/route-loader"

const LoginPage = lazy(() => import("@/pages/auth/login"))
const DashboardPage = lazy(() => import("@/pages/dashboard/dashboard"))
const AttendanceCheckInPage = lazy(() => import("@/pages/attendance/checkin"))
const AttendanceListPage = lazy(() => import("@/pages/attendance/list"))
const LeaveRequestPage = lazy(() => import("@/pages/leave/request"))
const TimesheetPage = lazy(() => import("@/pages/timesheet/timesheet"))
const CalendarPage = lazy(() => import("@/pages/calendar/calendar"))
const TeamPage = lazy(() => import("@/pages/team/team"))
const ApprovalsPage = lazy(() => import("@/pages/approvals/approvals"))
const ProfilePage = lazy(() => import("@/pages/profile/profile"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))

const withLoader = (node: ReactNode) => <Suspense fallback={<RouteLoader />}>{node}</Suspense>

const BASENAME = new URL(".", location.href).pathname
if (location.pathname.endsWith("/index.html")) {
  history.replaceState(null, "", BASENAME + location.search + location.hash)
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: withLoader(<NotFoundPage />),
      children: [{ index: true, element: withLoader(<LoginPage />) }],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "/dashboard", element: withLoader(<DashboardPage />) },
            { path: "/attendance/checkin", element: withLoader(<AttendanceCheckInPage />) },
            { path: "/attendance/list", element: withLoader(<AttendanceListPage />) },
            { path: "/leave/request", element: withLoader(<LeaveRequestPage />) },
            { path: "/timesheet", element: withLoader(<TimesheetPage />) },
            { path: "/calendar", element: withLoader(<CalendarPage />) },
            { path: "/profile", element: withLoader(<ProfilePage />) },
            {
              element: <RoleGuard allowedRoles={["Director", "Lead"]} />,
              children: [
                { path: "/team", element: withLoader(<TeamPage />) },
                { path: "/approvals", element: withLoader(<ApprovalsPage />) },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: BASENAME }
)
