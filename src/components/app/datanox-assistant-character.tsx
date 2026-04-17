import { motion } from "framer-motion"
import assistantPng from "@/assets/datanox-assistant.png"

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

      <motion.img
        src={assistantPng}
        alt="Datanox Assistant"
        className="relative mx-auto -mt-40 h-60 w-auto object-contain drop-shadow-[0_18px_30px_rgba(10,10,10,0.2)]"
        animate={eventAnimations[event]}
        transition={{ repeat: Infinity, duration: event === "idle" ? 2.3 : 0.9 }}
      />
    </div>
  )
}
