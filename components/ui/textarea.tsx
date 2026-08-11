import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full px-3 py-2 md:text-sm text-base rounded-xl",
        "bg-transparent dark:bg-input/30 selection:bg-primary selection:text-primary-foreground",
        "border border-input shadow-xs",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 outline-none",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "placeholder:text-muted-foreground",
        "transition-[color,box-shadow]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
