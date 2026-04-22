import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Banknote, CircleDollarSign, Clock3, ReceiptText, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/app/page-transition"
import { KpiCard } from "@/components/app/kpi-card"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"
import dayjs from "dayjs"

export default function FinanceDashboardPage() {
  const salaries = useFinanceStore((state) => state.salaries)
  const payslips = useFinanceStore((state) => state.payslips)
  const reimbursements = useFinanceStore((state) => state.reimbursements)
  const procurements = useFinanceStore((state) => state.procurements)
  const pettyCash = useFinanceStore((state) => state.pettyCash)

  const month = dayjs().subtract(1, "month").format("YYYY-MM")
  const monthlySalaries = salaries.filter((salary) => salary.month === month)
  const monthlyDisbursed = monthlySalaries.reduce((sum, salary) => sum + salary.net, 0)
  const pendingReimbursements = reimbursements.filter((claim) => claim.status === "Pending Finance Review").length
  const generatedPayslips = payslips.filter((slip) => slip.month === month).length
  const totalProcurement = procurements.reduce((sum, item) => sum + item.amount, 0)
  const pettyCashBalance = useMemo(
    () =>
      pettyCash.reduce((sum, entry) => sum + (entry.type === "Credit" ? entry.amount : -entry.amount), 0),
    [pettyCash]
  )

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Banknote className="text-[#F56B1F]" /> Finance Command Center</CardTitle>
          <CardDescription>Payroll, reimbursements, petty cash and procurement insights for operational control.</CardDescription>
        </CardHeader>
      </Card>

      <AiGuidanceCard text={`Monthly payroll for ${dayjs(month).format("MMMM YYYY")} is ${monthlyDisbursed.toLocaleString()} PKR with ${pendingReimbursements} reimbursements pending and ${generatedPayslips} payslips generated.`} />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Salary Disbursed (PKR)" value={monthlyDisbursed} icon={<CircleDollarSign size={22} />} />
        <KpiCard title="Pending Reimbursements" value={pendingReimbursements} icon={<Clock3 size={22} />} />
        <KpiCard title="Payslips Generated" value={generatedPayslips} icon={<ReceiptText size={22} />} />
        <KpiCard title="Petty Cash Balance (PKR)" value={pettyCashBalance} icon={<TrendingUp size={22} />} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Payroll Snapshot</CardTitle>
            <CardDescription>Last disbursed cycle with structure details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlySalaries.slice(0, 6).map((salary) => (
              <div key={salary.employeeId} className="grid grid-cols-5 gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs md:text-sm">
                <p className="font-medium">Employee: {salary.employeeId}</p>
                <p>Basic: {salary.basic.toLocaleString()}</p>
                <p>Allowances: {salary.allowances.toLocaleString()}</p>
                <p>Deductions: {salary.deductions.toLocaleString()}</p>
                <p className="font-semibold text-emerald-600">Net: {salary.net.toLocaleString()}</p>
              </div>
            ))}
            <p className="text-xs text-zinc-500">Procurement expense tracked this cycle: PKR {totalProcurement.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/finance/payroll">Manage Payroll</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/finance/payslips">Open Payslips</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/finance/procurement">Review Procurement</Link></Button>
            <Button asChild className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"><Link to="/finance/reimbursements">Review Reimbursements</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/finance/petty-cash">Manage Petty Cash</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link to="/hr/policies">View HR Policies</Link></Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
