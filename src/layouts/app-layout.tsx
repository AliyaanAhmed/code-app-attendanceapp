import { Outlet, useNavigation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/app/sidebar"
import { HeaderBar } from "@/components/app/header-bar"
import { RouteLoader } from "@/components/app/route-loader"
import { ChatBot } from "@/components/app/chat-bot"

export function AppLayout() {
  const navigation = useNavigation()

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      {navigation.state !== "idle" && <RouteLoader />}
      <ChatBot />
    </div>
  )
}
