import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(2)}Cr`
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(2)}L`
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(2)}K`
  } else {
    return `₹${amount.toFixed(2)}`
  }
}
