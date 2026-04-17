import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { BrandLogo } from "@/components/app/brand-logo"

export function RouteLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,_#fff,_#ffe8d8_40%,_#fff)]">
      <motion.div
        className="absolute h-80 w-80 rounded-full bg-[#F56B1F]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
      />

      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-[#F56B1F]/25 bg-white/90 px-8 py-7 shadow-2xl backdrop-blur-xl">
        <div className="relative">
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-[#F56B1F]/30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 3.5 }}
          />
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-transparent border-t-[#F56B1F]"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
          />
          <BrandLogo imageClassName="h-12 w-12 rounded-xl" showText={false} />
        </div>

        <BrandLogo textClassName="text-xl tracking-tight" />

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Sparkles size={13} className="text-[#F56B1F]" />
          Preparing your attendance workspace
        </div>
      </div>
    </div>
  )
}
