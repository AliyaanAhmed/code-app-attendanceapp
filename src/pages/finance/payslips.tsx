import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { Download, FileBadge2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"
import { useAuthStore } from "@/store/authStore"
import { mockData } from "@/data/mockData"

export default function PayslipsPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const payslips = useFinanceStore((state) => state.payslips)
  const [month, setMonth] = useState<"All" | string>("All")

  if (!currentUser) return null

  const isFinance = currentUser.role === "Finance Manager" || currentUser.role === "Director"
  const scopedPayslips = isFinance ? payslips : payslips.filter((slip) => slip.employeeId === currentUser.id)
  const months = useMemo(() => Array.from(new Set(scopedPayslips.map((slip) => slip.month))).sort((a, b) => b.localeCompare(a)), [scopedPayslips])
  const rows = scopedPayslips.filter((slip) => (month === "All" ? true : slip.month === month))

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2"><FileBadge2 className="text-[#F56B1F]" /> Payslip Center</CardTitle>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Months</SelectItem>
              {months.map((item) => (
                <SelectItem key={item} value={item}>{dayjs(item).format("MMMM YYYY")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <AiGuidanceCard text={isFinance ? "Finance can validate generated payslips here after bulk salary disbursement." : "Your payslips are available for download for salary reconciliation and records."} />

      <Card>
        <CardHeader><CardTitle>Payslip Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isFinance && <TableHead>Employee</TableHead>}
                <TableHead>Month</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((slip) => (
                <TableRow key={slip.id}>
                  {isFinance && (
                    <TableCell>{mockData.employees.find((employee) => employee.id === slip.employeeId)?.name}</TableCell>
                  )}
                  <TableCell>{dayjs(slip.month).format("MMMM YYYY")}</TableCell>
                  <TableCell>{dayjs(slip.generatedOn).format("YYYY-MM-DD HH:mm")}</TableCell>
                  <TableCell>PKR {slip.netAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download size={14} /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
