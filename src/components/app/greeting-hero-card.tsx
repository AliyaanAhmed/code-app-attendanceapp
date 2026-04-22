import { motion } from "framer-motion"
import { Sparkles, UserRound } from "lucide-react"
import assistantPng from "@/assets/datanox-assistant.png"
import assistantInlinePng from "@/assets/datanox-assistant.png?inline"
import { SafeImage } from "@/components/app/safe-image"

type Props = {
  name: string
}

export function GreetingHeroCard({ name }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff_10%,#fff3eb_45%,#fff_90%)] p-5 md:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F56B1F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F56B1F]/20 bg-white/80 px-3 py-1 text-xs text-[#1A1A2E]">
            <Sparkles size={13} className="text-[#F56B1F]" />
            Datanox Daily Brief
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-[#1A1A2E]">Good morning, {name}</h2>
          <p className="mt-1 text-sm text-zinc-600">Here&apos;s your attendance overview for this week with live performance signals.</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#F56B1F]/20 bg-white/80 px-3 py-3 backdrop-blur">
          <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-[#fff4ed] to-white">
            <motion.div animate={{ y: [0, -1, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="h-16 w-16">
              <SafeImage
                sources={[assistantInlinePng, assistantPng]}
                logPrefix="[Datanox] Greeting avatar"
                alt="Greeting assistant"
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
                fallback={
                  <div className="grid h-full w-full place-items-center">
                    <UserRound size={28} className="text-[#F56B1F]" />
                  </div>
                }
              />
            </motion.div>
          </div>
          <div className="text-xs text-zinc-600">
            <p className="font-medium text-[#1A1A2E]">Welcome back</p>
            <p>Let&apos;s make today productive.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
