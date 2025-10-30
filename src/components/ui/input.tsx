import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-input bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background/70",
          "hover:border-primary/30 hover:bg-background/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
