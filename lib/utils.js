import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves conflicting Tailwind
 * classes (e.g. "p-2" vs "p-4") so the last one wins.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
