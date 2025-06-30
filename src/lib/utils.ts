import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

export function getUniqueValues<T>(array: T[], key: keyof T): string[] {
  const values = array.map((item) => String(item[key])).filter((value) => value && value.trim() !== "")
  return Array.from(new Set(values)).sort()
}

export function parseYear(year: string | number): number | null {
  if (!year) return null
  const parsed = typeof year === "string" ? Number.parseInt(year) : year
  return isNaN(parsed) ? null : parsed
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null
  try {
    return new Date(dateString)
  } catch {
    return null
  }
}
