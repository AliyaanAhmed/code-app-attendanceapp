import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

type Props = {
  title: string
  value: number
  icon: ReactNode
}

export function KpiCard({ title, value, icon }: Props) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm text-zinc-600">{title}</CardTitle>
          <motion.span
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
            className="grid h-11 w-11 place-items-center rounded-xl bg-[#F56B1F]/10 text-[#F56B1F]"
          >
            {icon}
          </motion.span>
        </CardHeader>
        <CardContent>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold text-[#1A1A2E]">
            {value}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
