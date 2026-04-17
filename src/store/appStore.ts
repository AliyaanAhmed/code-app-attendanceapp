import { create } from "zustand"
import { mockData, type NotificationItem } from "@/data/mockData"

type AppState = {
  sidebarCollapsed: boolean
  notifications: NotificationItem[]
  chatbotOpen: boolean
  toggleSidebar: () => void
  toggleChatbot: () => void
  markAllRead: () => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  notifications: mockData.notifications,
  chatbotOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleChatbot: () => set((state) => ({ chatbotOpen: !state.chatbotOpen })),
  markAllRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),
}))
