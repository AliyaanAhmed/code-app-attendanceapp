import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

type AnimatedIconProps = {
  icon: LucideIcon
  className?: string
  size?: number
}

export function AnimatedIcon({ icon: Icon, className, size = 20 }: AnimatedIconProps) {
  return (
    <motion.span
      className={className}
      animate={{ y: [0, -2, 0], rotate: [0, -4, 4, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      <Icon size={size} />
    </motion.span>
  )
}
