import { cn } from "@/lib/utils"
import styles from "./skeleton.module.css"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Skeleton }
