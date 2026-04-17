import { useState } from "react"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  showText?: boolean
  textClassName?: string
}

const logoCandidates = [
  "https://datanox.io/wp-content/uploads/2026/01/Logo-3.svg",
  "/datanox-logo.png",
  "/datanox-logo.svg",
  "/logo.png",
]

export function BrandLogo({ className, imageClassName, showText = true, textClassName }: BrandLogoProps) {
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = logoCandidates[idx]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!failed ? (
        <img
          src={src}
          alt="Datanox logo"
          className={cn("h-8 w-auto max-w-[120px] object-contain", imageClassName)}
          onError={() => {
            if (idx < logoCandidates.length - 1) {
              setIdx((i) => i + 1)
              return
            }
            setFailed(true)
          }}
        />
      ) : (
        <div className={cn("grid h-8 w-8 place-items-center rounded-md bg-[#F56B1F] text-sm font-bold text-white", imageClassName)}>D</div>
      )}

      {showText && <span className={cn("font-semibold text-[#1A1A2E]", textClassName)}>Datanox</span>}
    </div>
  )
}
