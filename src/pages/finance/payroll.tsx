import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"
import { mockData } from "@/data/mockData"
import { useAppStore } from "@/store/appStore"

export default function PayrollPage() {
  const salaries = useFinanceStore((state) => state.salaries)
  const updateSalary = useFinanceStore((state) => state.updateSalaryStructure)
  const disburseMonthSalary = useFinanceStore((state) => state.disburseMonthSalary)
  const addNotification = useAppStore((state) => state.addNotification)
  const [month, setMonth] = useState(dayjs().subtract(1, "month").format("YYYY-MM"))
  const [employeeId, setEmployeeId] = useState<string>("")
  const [basic, setBasic] = useState(0)
  const [allowances, setAllowances] = useState(0)
  const [deductions, setDeductions] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [performanceBonus, setPerformanceBonus] = useState(0)

  const availableMonths = useMemo(() => {
    const months = new Set(salaries.map((salary) => salary.month))
    return Array.from(months).sort((a, b) => b.localeCompare(a))
  }, [salaries])

  const monthRows = useMemo(() => salaries.filter((salary) => salary.month === month), [month, salaries])
  const monthTotal = monthRows.reduce((sum, row) => sum + row.net, 0)
  const pendingCount = monthRows.filter((row) => row.status !== "Disbursed").length

  const loadSalary = (id: string) => {
    setEmployeeId(id)
    const row = monthRows.find((salary) => salary.employeeId === id)
    if (!row) return
    setBasic(row.basic)
    setAllowances(row.allowances)
    setDeductions(row.deductions)
    setBonus(row.bonus)
    setPerformanceBonus(row.performanceBonus)
  }

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2"><Coins className="text-[#F56B1F]" /> Payroll Management</CardTitle>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {availableMonths.map((item) => (
                <SelectItem key={item} value={item}>{dayjs(item).format("MMMM YYYY")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <AiGuidanceCard text={`Payroll month ${dayjs(month).format("MMMM YYYY")} has ${pendingCount} pending disbursement records. Total net payout: PKR ${monthTotal.toLocaleString()}.`} />

      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Monthly Salary Structure</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthRows.map((row) => (
                  <TableRow key={`${row.employeeId}-${row.month}`} className="cursor-pointer hover:bg-zinc-50" onClick={() => loadSalary(row.employeeId)}>
                    <TableCell>{mockData.employees.find((employee) => employee.id === row.employeeId)?.name}</TableCell>
                    <TableCell>{row.basic.toLocaleString()}</TableCell>
                    <TableCell>{row.allowances.toLocaleString()}</TableCell>
                    <TableCell>{row.deductions.toLocaleString()}</TableCell>
                    <TableCell>{row.bonus.toLocaleString()}</TableCell>
                    <TableCell>{row.performanceBonus.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{row.net.toLocaleString()}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Update Structure</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Select value={employeeId} onValueChange={loadSalary}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {monthRows.map((row) => (
                  <SelectItem key={row.employeeId} value={row.employeeId}>
                    {mockData.employees.find((employee) => employee.id === row.employeeId)?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" value={basic} onChange={(event) => setBasic(Number(event.target.value || 0))} placeholder="Basic" />
            <Input type="number" value={allowances} onChange={(event) => setAllowances(Number(event.target.value || 0))} placeholder="Allowances" />
            <Input type="number" value={deductions} onChange={(event) => setDeductions(Number(event.target.value || 0))} placeholder="Deductions" />
            <Input type="number" value={bonus} onChange={(event) => setBonus(Number(event.target.value || 0))} placeholder="Bonus" />
            <Input type="number" value={performanceBonus} onChange={(event) => setPerformanceBonus(Number(event.target.value || 0))} placeholder="Performance bonus" />
            <Button
              className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"
              onClick={() => {
                if (!employeeId) {
                  toast.error("Select an employee first.")
                  return
                }
                updateSalary(employeeId, month, { basic, allowances, deductions, bonus, performanceBonus })
                toast.success("Salary structure updated.")
              }}
            >
              Save Structure
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                disburseMonthSalary(month)
                addNotification({
                  title: "Salary credited",
                  detail: `${dayjs(month).format("MMMM YYYY")} salary has been disbursed and payslips generated.`,
                })
                toast.success("Bulk salary disbursed and payslips generated.")
              }}
            >
              Bulk Disburse Month
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
