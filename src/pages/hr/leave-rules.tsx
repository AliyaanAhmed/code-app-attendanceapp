import { useState } from "react"
import toast from "react-hot-toast"
import { ListChecks } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageTransition } from "@/components/app/page-transition"
import { AiGuidanceCard } from "@/components/app/ai-guidance-card"
import { useHrStore } from "@/store/hrStore"

export default function HrLeaveRulesPage() {
  const rules = useHrStore((state) => state.leaveRules)
  const updateRule = useHrStore((state) => state.updateLeaveRule)
  const [draft, setDraft] = useState(
    rules.map((rule) => ({
      ...rule,
    }))
  )

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><ListChecks className="text-[#F56B1F]" /> Leave Policy Rules</CardTitle>
        </CardHeader>
      </Card>

      <AiGuidanceCard text="These limits and notice rules are enforced in leave approval flows, so update carefully before each policy cycle." />

      <div className="grid md:grid-cols-2 gap-4">
        {draft.map((rule, index) => (
          <Card key={rule.type}>
            <CardHeader><CardTitle>{rule.type}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Annual Limit</Label>
                <Input
                  type="number"
                  value={rule.annualLimit}
                  onChange={(event) =>
                    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, annualLimit: Number(event.target.value || 0) } : item)))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Minimum Notice Days</Label>
                <Input
                  type="number"
                  value={rule.minNoticeDays}
                  onChange={(event) =>
                    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, minNoticeDays: Number(event.target.value || 0) } : item)))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-zinc-200 p-3">
                <span className="text-sm">Allow Carry Forward</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#F56B1F]"
                  checked={rule.carryForward}
                  onChange={(event) =>
                    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, carryForward: event.target.checked } : item)))
                  }
                />
              </div>
              <Button
                className="w-full bg-[#F56B1F] hover:bg-[#df5d15]"
                onClick={() => {
                  updateRule(rule.type, {
                    annualLimit: rule.annualLimit,
                    minNoticeDays: rule.minNoticeDays,
                    carryForward: rule.carryForward,
                  })
                  toast.success(`${rule.type} rule updated`)
                }}
              >
                Save Rule
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  )
}
