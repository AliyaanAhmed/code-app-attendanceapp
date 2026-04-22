import { create } from "zustand"
import { mockData, type Employee, type LeavePolicyRule, type PolicyDocument, type QuarterlyProgressRecord } from "@/data/mockData"

type HrState = {
  policies: PolicyDocument[]
  leaveRules: LeavePolicyRule[]
  employees: Employee[]
  quarterlyProgress: QuarterlyProgressRecord[]
  addPolicy: (policy: Omit<PolicyDocument, "id">) => void
  updatePolicy: (id: string, updates: Partial<PolicyDocument>) => void
  setEmployeeActiveState: (id: string, active: boolean) => void
  updateLeaveRule: (type: LeavePolicyRule["type"], updates: Partial<LeavePolicyRule>) => void
  upsertQuarterlyProgress: (record: Omit<QuarterlyProgressRecord, "id">) => void
}

export const useHrStore = create<HrState>((set) => ({
  policies: mockData.policyDocuments,
  leaveRules: mockData.leavePolicyRules,
  employees: mockData.employees,
  quarterlyProgress: mockData.quarterlyProgressRecords,
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
  upsertQuarterlyProgress: (record) =>
    set((state) => {
      const existing = state.quarterlyProgress.find(
        (item) => item.employeeId === record.employeeId && item.year === record.year && item.quarter === record.quarter
      )
      if (existing) {
        return {
          quarterlyProgress: state.quarterlyProgress.map((item) => (item.id === existing.id ? { ...item, ...record } : item)),
        }
      }
      return {
        quarterlyProgress: [{ ...record, id: `qpr-${Date.now()}` }, ...state.quarterlyProgress],
      }
    }),
}))
