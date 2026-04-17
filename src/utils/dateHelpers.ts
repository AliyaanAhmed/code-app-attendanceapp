import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(weekday)
dayjs.extend(isBetween)

export const formatDate = (value: string, format = "MMM DD, YYYY") => dayjs(value).format(format)
export const formatTime = (value?: string | null) => (value ? dayjs(`2026-01-01 ${value}`).format("hh:mm A") : "-")

export const getMonthDays = (date: dayjs.Dayjs) => {
  const start = date.startOf("month").startOf("week")
  const end = date.endOf("month").endOf("week")
  const days: dayjs.Dayjs[] = []

  for (let current = start; current.isBefore(end) || current.isSame(end, "day"); current = current.add(1, "day")) {
    days.push(current)
  }
  return days
}

export const businessDaysBetween = (from: string, to: string) => {
  let total = 0
  for (let d = dayjs(from); d.isBefore(to) || d.isSame(to, "day"); d = d.add(1, "day")) {
    if (d.day() !== 0 && d.day() !== 6) {
      total += 1
    }
  }
  return total
}

export default dayjs
