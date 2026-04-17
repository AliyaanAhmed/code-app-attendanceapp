import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Props = {
  value: string
}

const statusClassMap: Record<string, string> = {
  Present: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "On Time": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Leave: "bg-amber-100 text-amber-700 border-amber-200",
  "Pending Review": "bg-amber-100 text-amber-700 border-amber-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Late: "bg-orange-100 text-orange-700 border-orange-200",
  Submitted: "bg-blue-100 text-blue-700 border-blue-200",
  Draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Absent: "bg-red-100 text-red-700 border-red-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
}

export function StatusBadge({ value }: Props) {
  return (
    <Badge className={cn("font-medium border", statusClassMap[value] ?? "bg-zinc-100 text-zinc-700 border-zinc-200")}>
      {value}
    </Badge>
  )
}
