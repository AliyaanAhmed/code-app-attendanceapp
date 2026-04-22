import { useEffect, useState } from "react"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { router } from "@/router/index"
import { RouteLoader } from "@/components/app/route-loader"
import {
  Dnx_dnx_attendancesService,
  Dnx_employeesService,
  Dnx_leave_requestsService,
  Dnx_timesheet_weeksService,
  Dnx_dnx_projectsService,
  Dnx_notificationsService,
} from "@/generated"

const logDataverseStartup = async () => {
  const probes = [
    { table: "dnx_employee", run: () => Dnx_employeesService.getAll({ top: 1 }) },
    { table: "dnx_dnx_attendance", run: () => Dnx_dnx_attendancesService.getAll({ top: 1 }) },
    { table: "dnx_leave_request", run: () => Dnx_leave_requestsService.getAll({ top: 1 }) },
    { table: "dnx_timesheet_week", run: () => Dnx_timesheet_weeksService.getAll({ top: 1 }) },
    { table: "dnx_dnx_project", run: () => Dnx_dnx_projectsService.getAll({ top: 1 }) },
    { table: "dnx_notification", run: () => Dnx_notificationsService.getAll({ top: 1 }) },
  ] as const

  console.log("[Datanox] Dataverse startup diagnostics: START", new Date().toISOString())

  for (const probe of probes) {
    console.log(`[Datanox] Checking table: ${probe.table}`)
    try {
      const response = await probe.run()
      if (!response.success) {
        console.error(`[Datanox] ${probe.table}: FAILED`, response.error)
        continue
      }
      const rows = Array.isArray(response.data) ? response.data.length : 0
      console.log(`[Datanox] ${probe.table}: OK, rows=${rows}`)
    } catch (error) {
      console.error(`[Datanox] ${probe.table}: REJECTED`, error)
    }
  }

  console.log("[Datanox] Dataverse startup diagnostics: END")
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setBooting(false), 3000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    void logDataverseStartup()
  }, [])

  if (booting) {
    return <RouteLoader />
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ style: { border: "1px solid #E4E4E7", borderRadius: "10px" } }} />
    </>
  )
}
