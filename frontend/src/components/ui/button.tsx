import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sahaya-green/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-sahaya-green text-white shadow-sm hover:bg-emerald-950 hover:shadow",
        destructive:
          "bg-red-700 text-white shadow-sm hover:bg-red-800",
        outline:
          "border border-stone-300 bg-white text-slate-800 shadow-sm hover:bg-stone-50 hover:border-sahaya-green/60",
        secondary:
          "bg-emerald-50 text-sahaya-green border border-emerald-200 shadow-sm hover:bg-emerald-100",
        ghost: "hover:bg-stone-100 hover:text-slate-900",
        link: "text-sahaya-green underline-offset-4 hover:underline",
        saffron:
          "bg-sahaya-saffron text-white shadow hover:bg-amber-600",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
