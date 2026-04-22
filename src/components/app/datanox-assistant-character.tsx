import { motion } from "framer-motion"
import { UserRound } from "lucide-react"
import assistantPng from "@/assets/datanox-assistant.png"
import assistantInlinePng from "@/assets/datanox-assistant.png?inline"
import { SafeImage } from "@/components/app/safe-image"

type Props = {
  mode: "onsite" | "wfh"
  event?: "idle" | "checkin" | "checkout"
  className?: string
}

const eventAnimations: Record<NonNullable<Props["event"]>, { scale: number[]; rotate: number[]; y: number[] }> = {
  idle: { scale: [1, 1.02, 1], rotate: [0, 0, 0], y: [0, -3, 0] },
  checkin: { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0], y: [0, -8, 0] },
  checkout: { scale: [1, 0.96, 1], rotate: [0, 3, -3, 0], y: [0, -4, 0] },
}

export function DatanoxAssistantCharacter({ mode, event = "idle", className }: Props) {
  const accent = mode === "onsite" ? "#22C55E" : "#3B82F6"

  return (
    <div className={className}>
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 2.6 }}
        className="mx-auto h-44 w-44 rounded-full blur-3xl"
        style={{ backgroundColor: accent }}
      />

      <motion.div animate={eventAnimations[event]} transition={{ repeat: Infinity, duration: event === "idle" ? 2.3 : 0.9 }}>
        <SafeImage
          sources={[assistantInlinePng, assistantPng]}
          logPrefix="[Datanox] Assistant character"
          alt="Datanox Assistant"
          className="relative mx-auto -mt-40 h-60 w-auto object-contain drop-shadow-[0_18px_30px_rgba(10,10,10,0.2)]"
          loading="lazy"
          decoding="async"
          fallback={
            <div className="relative mx-auto -mt-36 grid h-48 w-48 place-items-center rounded-full border border-[#F56B1F]/30 bg-white shadow-lg">
              <UserRound size={56} className="text-[#F56B1F]" />
            </div>
          }
        />
      </motion.div>
    </div>
  )
}
