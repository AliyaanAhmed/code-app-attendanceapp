import { useEffect, useState } from "react"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { router } from "@/router/index"
import { RouteLoader } from "@/components/app/route-loader"

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setBooting(false), 3000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <>
      {booting && <RouteLoader />}
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ style: { border: "1px solid #E4E4E7", borderRadius: "10px" } }} />
    </>
  )
}
