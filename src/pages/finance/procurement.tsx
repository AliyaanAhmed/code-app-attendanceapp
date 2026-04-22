import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"
import { mockData } from "@/data/mockData"

export default function ProcurementPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const procurements = useFinanceStore((state) => state.procurements)
  const submitProcurement = useFinanceStore((state) => state.submitProcurement)
  const updateProcurementStatus = useFinanceStore((state) => state.updateProcurementStatus)
  const addNotification = useAppStore((state) => state.addNotification)
  const [item, setItem] = useState("")
  const [amount, setAmount] = useState(0)
  const [department, setDepartment] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Reimbursed" | "Rejected">("All")

  if (!currentUser) return null

  const isFinance = currentUser.role === "Finance Manager" || currentUser.role === "Director"
  const rows = useMemo(() => {
    const scoped = isFinance ? procurements : procurements.filter((entry) => entry.employeeId === currentUser.id)
    return scoped.filter((entry) => (statusFilter === "All" ? true : entry.status === statusFilter))
  }, [currentUser.id, isFinance, procurements, statusFilter])

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="text-[#F56B1F]" /> Procurement & Company Expense
          </CardTitle>
        </CardHeader>
      </Card>

      <AiGuidanceCard text="Log all company-paid purchases with exact department tagging so reimbursements and audits stay accurate." />

      {!isFinance && (
        <Card>
          <CardHeader><CardTitle>Submit Procurement Entry</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-3">
            <Input value={item} onChange={(event) => setItem(event.target.value)} placeholder="Item / expense title" />
            <Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value || 0))} placeholder="Amount" />
            <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" />
            <Button
              className="bg-[#F56B1F] hover:bg-[#df5d15]"
              onClick={() => {
                if (!item.trim() || !amount || !department.trim()) {
                  toast.error("Item, amount and department are required.")
                  return
                }
                submitProcurement({
                  employeeId: currentUser.id,
                  date: new Date().toISOString().slice(0, 10),
                  item,
                  amount,
                  department,
                })
                addNotification({
                  title: "Procurement submitted",
                  detail: `${item} expense has been submitted for finance review.`,
                })
                toast.success("Procurement submitted")
                setItem("")
                setAmount(0)
                setDepartment("")
              }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Procurement History</CardTitle>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reimbursed">Reimbursed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{mockData.employees.find((employee) => employee.id === entry.employeeId)?.name ?? entry.employeeId}</TableCell>
                  <TableCell>{entry.item}</TableCell>
                  <TableCell>{entry.department}</TableCell>
                  <TableCell>PKR {entry.amount.toLocaleString()}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell className="space-x-2">
                    {isFinance && entry.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateProcurementStatus(entry.id, "Reimbursed")
                            addNotification({
                              title: "Procurement reimbursed",
                              detail: `${entry.item} has been reimbursed by Finance.`,
                            })
                            toast.success("Marked as reimbursed")
                          }}
                        >
                          Reimburse
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateProcurementStatus(entry.id, "Rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
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
