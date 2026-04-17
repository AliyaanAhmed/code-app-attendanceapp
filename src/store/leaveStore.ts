import { create } from "zustand"
import { leaveBalanceTemplate, mockData, type LeaveRequest, type LeaveStatus, type LeaveType } from "@/data/mockData"

type LeaveState = {
  requests: LeaveRequest[]
  leaveBalance: typeof leaveBalanceTemplate
  createRequest: (payload: Omit<LeaveRequest, "id" | "status" | "createdAt">) => Promise<void>
  updateRequestStatus: (id: string, status: LeaveStatus, rejectionReason?: string) => void
  getEmployeeRequests: (employeeId: string) => LeaveRequest[]
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  requests: mockData.leaveRequests,
  leaveBalance: leaveBalanceTemplate,
  createRequest: async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const request: LeaveRequest = {
      ...payload,
      id: `leave-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ requests: [request, ...state.requests] }))
  },
  updateRequestStatus: (id, status, rejectionReason) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, status, rejectionReason: status === "Rejected" ? rejectionReason : undefined } : request
      ),
    }))
  },
  getEmployeeRequests: (employeeId) => get().requests.filter((request) => request.employeeId === employeeId),
}))

export const leaveTypeToKey = (type: LeaveType) => type
