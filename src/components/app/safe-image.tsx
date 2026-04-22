import { useMemo, useState, type ImgHTMLAttributes, type ReactNode } from "react"

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  sources: string[]
  fallback?: ReactNode
  logPrefix?: string
}

export function SafeImage({ sources, fallback = null, logPrefix = "[Datanox] Image", onError, ...props }: SafeImageProps) {
  const candidates = useMemo(() => sources.filter(Boolean), [sources])
  const [index, setIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(candidates.length === 0)

  if (allFailed) {
    return <>{fallback}</>
  }

  const src = candidates[Math.min(index, Math.max(candidates.length - 1, 0))]

  return (
    <img
      {...props}
      src={src}
      onError={(event) => {
        const failedUrl = event.currentTarget.currentSrc || src
        console.error(`${logPrefix} failed:`, failedUrl)

        if (index < candidates.length - 1) {
          console.warn(`${logPrefix} trying fallback source ${index + 2}/${candidates.length}`)
          setIndex((prev) => prev + 1)
        } else {
          console.error(`${logPrefix} all sources failed`)
          setAllFailed(true)
        }

        onError?.(event)
      }}
    />
  )
}

