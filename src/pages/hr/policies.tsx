import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useHrStore } from "@/store/hrStore"
import type { PolicyCategory } from "@/data/mockData"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"

const categories: PolicyCategory[] = ["Leave", "Attendance", "Code of Conduct", "Security", "Benefits", "General"]

export default function HrPoliciesPage() {
  const role = useAuthStore((state) => state.role)
  const policies = useHrStore((state) => state.policies)
  const addPolicy = useHrStore((state) => state.addPolicy)
  const addNotification = useAppStore((state) => state.addNotification)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<PolicyCategory>("General")
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")

  const canManage = role === "HR Manager" || role === "Director"
  const filtered = useMemo(
    () => policies.filter((policy) => policy.title.toLowerCase().includes(search.toLowerCase()) || policy.category.toLowerCase().includes(search.toLowerCase())),
    [policies, search]
  )

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader><CardTitle className="text-xl flex items-center gap-2"><FileText className="text-[#F56B1F]" /> Policy Management</CardTitle></CardHeader>
      </Card>

      <AiGuidanceCard text="Any new or updated policy should be clearly versioned and announced to all employees on the dashboard." />

      <div className={canManage ? "grid xl:grid-cols-3 gap-4" : "grid gap-4"}>
        <Card className={canManage ? "xl:col-span-2" : ""}>
          <CardHeader>
            <CardTitle>All Policies</CardTitle>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or category..." />
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((policy) => (
              <div key={policy.id} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{policy.title}</p>
                    <p className="text-xs text-zinc-500">{policy.category} | {policy.version} | Effective {policy.effectiveDate}</p>
                  </div>
                  <span className="text-xs rounded-full bg-[#F56B1F]/10 px-2 py-0.5 text-[#F56B1F]">{policy.category}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{policy.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {canManage && (
          <Card>
            <CardHeader><CardTitle>Add Policy</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as PolicyCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Summary</Label>
                <Input value={summary} onChange={(event) => setSummary(event.target.value)} />
              </div>
              <Button
                className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"
                onClick={() => {
                  if (!title.trim() || !summary.trim()) {
                    toast.error("Title and summary are required.")
                    return
                  }
                  addPolicy({
                    title,
                    category,
                    summary,
                    version: "v1.0",
                    effectiveDate: new Date().toISOString().slice(0, 10),
                    updatedBy: "system",
                  })
                  addNotification({
                    title: "Policy update",
                    detail: `${title} (${category}) has been published. Please review and acknowledge.`,
                  })
                  toast.success("Policy published and notifications queued.")
                  setTitle("")
                  setSummary("")
                }}
              >
                Publish Policy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
