import { create } from "zustand"
import { mockData, type Payslip, type PettyCashEntry, type ProcurementEntry, type ReimbursementClaim, type SalaryStructure } from "@/data/mockData"

type FinanceState = {
  salaries: SalaryStructure[]
  payslips: Payslip[]
  reimbursements: ReimbursementClaim[]
  procurements: ProcurementEntry[]
  pettyCash: PettyCashEntry[]
  updateSalaryStructure: (employeeId: string, month: string, payload: Partial<Pick<SalaryStructure, "basic" | "allowances" | "deductions" | "bonus" | "performanceBonus">>) => void
  disburseMonthSalary: (month: string) => void
  submitReimbursement: (payload: Omit<ReimbursementClaim, "id" | "status" | "submittedOn">) => void
  updateReimbursementStatus: (id: string, status: ReimbursementClaim["status"], reason?: string) => void
  submitProcurement: (payload: Omit<ProcurementEntry, "id" | "status">) => void
  updateProcurementStatus: (id: string, status: ProcurementEntry["status"]) => void
  addPettyCashEntry: (payload: Omit<PettyCashEntry, "id">) => void
}

export const useFinanceStore = create<FinanceState>((set) => ({
  salaries: mockData.salaryStructures,
  payslips: mockData.payslips,
  reimbursements: mockData.reimbursementClaims,
  procurements: mockData.procurementEntries,
  pettyCash: mockData.pettyCashEntries,
  updateSalaryStructure: (employeeId, month, payload) =>
    set((state) => ({
      salaries: state.salaries.map((salary) => {
        if (salary.employeeId !== employeeId || salary.month !== month) return salary
        const updated = { ...salary, ...payload }
        return {
          ...updated,
          net: updated.basic + updated.allowances + updated.bonus + updated.performanceBonus - updated.deductions,
        }
      }),
    })),
  disburseMonthSalary: (month) =>
    set((state) => {
      const today = new Date().toISOString().slice(0, 10)
      const salaries = state.salaries.map((salary) => (salary.month === month ? { ...salary, status: "Disbursed" as const, disbursedOn: today } : salary))
      const newPayslips = salaries
        .filter((salary) => salary.month === month)
        .map((salary) => ({
          id: `payslip-${salary.employeeId}-${salary.month}`,
          employeeId: salary.employeeId,
          month: salary.month,
          generatedOn: new Date().toISOString(),
          netAmount: salary.net,
          downloadUrl: "#",
        }))

      const payslipsMap = new Map([...state.payslips, ...newPayslips].map((slip) => [slip.id, slip]))
      return { salaries, payslips: Array.from(payslipsMap.values()) }
    }),
  submitReimbursement: (payload) =>
    set((state) => ({
      reimbursements: [
        {
          ...payload,
          id: `reimb-${Date.now()}`,
          submittedOn: new Date().toISOString().slice(0, 10),
          status: "Pending Lead Review",
        },
        ...state.reimbursements,
      ],
    })),
  updateReimbursementStatus: (id, status, reason) =>
    set((state) => ({
      reimbursements: state.reimbursements.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              status,
              rejectionReason: status === "Rejected" ? reason : undefined,
              financeDecisionOn: ["Approved", "Rejected"].includes(status) ? new Date().toISOString().slice(0, 10) : claim.financeDecisionOn,
            }
          : claim
      ),
    })),
  submitProcurement: (payload) =>
    set((state) => ({
      procurements: [
        {
          ...payload,
          id: `proc-${Date.now()}`,
          status: "Pending",
        },
        ...state.procurements,
      ],
    })),
  updateProcurementStatus: (id, status) =>
    set((state) => ({
      procurements: state.procurements.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
    })),
  addPettyCashEntry: (payload) =>
    set((state) => ({
      pettyCash: [{ ...payload, id: `pc-${Date.now()}` }, ...state.pettyCash],
    })),
}))
