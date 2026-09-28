import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** S$1,100 — whole dollars, tabular via the .num class at the call site. */
export const sgd = (n: number) => `S$${Math.abs(n).toLocaleString("en-SG")}`;
