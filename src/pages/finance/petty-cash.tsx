import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useFinanceStore } from "@/store/financeStore"

export default function PettyCashPage() {
  const entries = useFinanceStore((state) => state.pettyCash)
  const addEntry = useFinanceStore((state) => state.addPettyCashEntry)
  const [type, setType] = useState<"Credit" | "Debit">("Debit")
  const [amount, setAmount] = useState(0)
  const [department, setDepartment] = useState("")
  const [note, setNote] = useState("")

  const balance = useMemo(
    () =>
      entries.reduce((sum, entry) => sum + (entry.type === "Credit" ? entry.amount : -entry.amount), 0),
    [entries]
  )

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Wallet className="text-[#F56B1F]" /> Petty Cash Management</CardTitle></CardHeader>
      </Card>

      <AiGuidanceCard text={`Current petty cash balance is PKR ${balance.toLocaleString()}. Keep debit notes detailed for audit readiness.`} />

      <div className="grid xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Add Entry</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as "Credit" | "Debit")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-1">
              <Label>Department (Optional)</Label>
              <Input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Engineering" />
            </div>
            <div className="space-y-1">
              <Label>Note</Label>
              <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Office consumables" />
            </div>
            <Button
              className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"
              onClick={() => {
                if (!amount || !note.trim()) {
                  toast.error("Amount and note are required.")
                  return
                }
                addEntry({
                  date: new Date().toISOString().slice(0, 10),
                  type,
                  amount,
                  department: department || undefined,
                  note,
                })
                toast.success("Petty cash entry added")
                setAmount(0)
                setDepartment("")
                setNote("")
              }}
            >
              Save Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Usage History</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.department ?? "-"}</TableCell>
                    <TableCell>{entry.note}</TableCell>
                    <TableCell className={entry.type === "Credit" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                      {entry.type === "Credit" ? "+" : "-"} PKR {entry.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}

