import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

type AiGuidanceCardProps = {
  title?: string
  text: string
  action?: ReactNode
}

export function AiGuidanceCard({ title = "AI Guidance", text, action }: AiGuidanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#F56B1F]/25 bg-[linear-gradient(140deg,#fff,#fff6f0)] p-4">
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#F56B1F]/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ repeat: Infinity, duration: 3.2 }}
      />

      <div className="relative flex items-start gap-3">
        <motion.div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-sm border border-[#F56B1F]/20"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <div className="relative h-8 w-8 rounded-full bg-[#F56B1F]/10 grid place-items-center">
            <Sparkles size={16} className="text-[#F56B1F]" />
            <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-[#1A1A2E]" />
            <span className="absolute right-2 top-2 h-1 w-1 rounded-full bg-[#1A1A2E]" />
          </div>
        </motion.div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F56B1F]">{title}</p>
          <p className="mt-1 text-sm text-[#1A1A2E]">{text}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  )
}
