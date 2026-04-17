import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginUsers, mockData, type Employee, type Role } from "@/data/mockData"

type AuthState = {
  isAuthenticated: boolean
  currentUser: Employee | null
  role: Role | null
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  logout: () => void
  updateProfile: (payload: Partial<Pick<Employee, "name" | "contact" | "emergencyContact">>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      role: null,
      login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 900))
        const found = loginUsers.find((user) => user.email === email && user.password === password)
        if (!found) {
          return { ok: false, message: "Invalid credentials." }
        }
        const employee = mockData.employees.find((emp) => emp.id === found.employeeId)
        if (!employee) {
          return { ok: false, message: "Employee record not found." }
        }
        set({ isAuthenticated: true, currentUser: employee, role: found.role })
        return { ok: true, message: "Login successful." }
      },
      logout: () => set({ isAuthenticated: false, currentUser: null, role: null }),
      updateProfile: (payload) => {
        const user = get().currentUser
        if (!user) return
        const updated = { ...user, ...payload }
        set({ currentUser: updated })
      },
    }),
    {
      name: "datanox-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        role: state.role,
      }),
    }
  )
)
