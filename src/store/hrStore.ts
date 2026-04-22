import { create } from "zustand"
import { mockData, type Employee, type LeavePolicyRule, type PolicyDocument } from "@/data/mockData"

type HrState = {
  policies: PolicyDocument[]
  leaveRules: LeavePolicyRule[]
  employees: Employee[]
  addPolicy: (policy: Omit<PolicyDocument, "id">) => void
  updatePolicy: (id: string, updates: Partial<PolicyDocument>) => void
  setEmployeeActiveState: (id: string, active: boolean) => void
  updateLeaveRule: (type: LeavePolicyRule["type"], updates: Partial<LeavePolicyRule>) => void
}

export const useHrStore = create<HrState>((set) => ({
  policies: mockData.policyDocuments,
  leaveRules: mockData.leavePolicyRules,
  employees: mockData.employees,
  addPolicy: (policy) =>
    set((state) => ({
      policies: [{ ...policy, id: `pol-${Date.now()}` }, ...state.policies],
    })),
  updatePolicy: (id, updates) =>
    set((state) => ({
      policies: state.policies.map((policy) => (policy.id === id ? { ...policy, ...updates } : policy)),
    })),
  setEmployeeActiveState: (id, active) =>
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              isActive: active,
            }
          : employee
      ),
    })),
  updateLeaveRule: (type, updates) =>
    set((state) => ({
      leaveRules: state.leaveRules.map((rule) => (rule.type === type ? { ...rule, ...updates } : rule)),
    })),
}))
