import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { CheckCircle2, Receipt, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { StatusBadge } from "@/components/app/status-badge"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"
import { mockData } from "@/data/mockData"

export default function ReimbursementsPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const reimbursements = useFinanceStore((state) => state.reimbursements)
  const submitReimbursement = useFinanceStore((state) => state.submitReimbursement)
  const updateStatus = useFinanceStore((state) => state.updateReimbursementStatus)
  const addNotification = useAppStore((state) => state.addNotification)
  const [filter, setFilter] = useState("All")
  const [category, setCategory] = useState<"Travel" | "Meals" | "Client Expense" | "Equipment" | "Medical" | "Other">("Travel")
  const [amount, setAmount] = useState(0)
  const [billName, setBillName] = useState("")
  const [reason, setReason] = useState("")

  if (!currentUser) return null

  const isFinance = currentUser.role === "Finance Manager" || currentUser.role === "Director"
  const isLead = currentUser.role === "Lead"

  const employeeScoped = useMemo(() => {
    if (isFinance) return reimbursements
    if (isLead) {
      const teamMembers = mockData.employees.filter((employee) => employee.managerId === currentUser.id).map((employee) => employee.id)
      return reimbursements.filter((claim) => teamMembers.includes(claim.employeeId))
    }
    return reimbursements.filter((claim) => claim.employeeId === currentUser.id)
  }, [currentUser.id, isFinance, isLead, reimbursements])

  const rows = employeeScoped.filter((item) => (filter === "All" ? true : item.status === filter))

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl"><Receipt className="text-[#F56B1F]" /> Reimbursement Center</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending Lead Review">Pending Lead Review</SelectItem>
              <SelectItem value="Pending Finance Review">Pending Finance Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <AiGuidanceCard text={isFinance ? "Finance queue is prioritized by pending lead-approved claims. Process these first to avoid payroll delays." : "Submit complete receipts and clear reason notes for faster approvals."} />

      {!isFinance && (
        <Card>
          <CardHeader><CardTitle>Submit Reimbursement Claim</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-5 gap-3">
            <Select value={category} onValueChange={(value) => setCategory(value as typeof category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Travel", "Meals", "Client Expense", "Equipment", "Medical", "Other"].map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input className="h-10 rounded-md border border-zinc-200 px-3 text-sm" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value || 0))} placeholder="Amount" />
            <input className="h-10 rounded-md border border-zinc-200 px-3 text-sm" value={billName} onChange={(event) => setBillName(event.target.value)} placeholder="Bill/receipt file name" />
            <input className="h-10 rounded-md border border-zinc-200 px-3 text-sm" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for claim" />
            <Button
              className="bg-[#F56B1F] hover:bg-[#df5d15]"
              onClick={() => {
                if (!amount || !billName.trim() || !reason.trim()) {
                  toast.error("Amount, bill name, and reason are required.")
                  return
                }
                submitReimbursement({
                  employeeId: currentUser.id,
                  category,
                  amount,
                  billName,
                  reason,
                })
                addNotification({
                  title: "Reimbursement submitted",
                  detail: `Your ${category} claim has been submitted for approval.`,
                })
                toast.success("Reimbursement claim submitted.")
                setAmount(0)
                setBillName("")
                setReason("")
              }}
            >
              Submit Claim
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Claims</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bill</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((claim) => (
                <TableRow key={claim.id} className="hover:bg-zinc-50">
                  <TableCell>{mockData.employees.find((employee) => employee.id === claim.employeeId)?.name}</TableCell>
                  <TableCell>{claim.category}</TableCell>
                  <TableCell>PKR {claim.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-zinc-600">{claim.billName}</TableCell>
                  <TableCell>{claim.reason}</TableCell>
                  <TableCell><StatusBadge value={claim.status.includes("Pending") ? "Pending" : claim.status} /></TableCell>
                  <TableCell className="space-x-2">
                    {isLead && claim.status === "Pending Lead Review" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          updateStatus(claim.id, "Pending Finance Review")
                          addNotification({
                            title: "Reimbursement moved to Finance",
                            detail: "Lead approved claim and forwarded it for finance review.",
                          })
                          toast.success("Sent to finance")
                        }}
                      >
                        Forward
                      </Button>
                    )}
                    {isFinance && claim.status === "Pending Finance Review" && (
                      <>
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            updateStatus(claim.id, "Approved")
                            addNotification({
                              title: "Reimbursement approved",
                              detail: "Your reimbursement claim has been approved by Finance.",
                            })
                            toast.success("Claim approved")
                          }}
                        >
                          <CheckCircle2 size={14} />Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => {
                            const reason = window.prompt("Rejection reason")
                            if (!reason) return
                            updateStatus(claim.id, "Rejected", reason)
                            addNotification({
                              title: "Reimbursement rejected",
                              detail: `Your claim was rejected. Reason: ${reason}`,
                            })
                            toast.success("Claim rejected")
                          }}
                        >
                          <XCircle size={14} />Reject
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
