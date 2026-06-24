import { cn } from "@/lib/utils"

/** Pulsing placeholder block used while panels await their first data. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted/60", className)} {...props} />
}

export { Skeleton }
