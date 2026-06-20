import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-blue-600 px-3 py-2 text-white hover:bg-blue-700",
        variant === "ghost" &&
          "px-2 py-1 text-gray-400 hover:text-red-500",
        className,
      )}
      {...props}
    />
  );
}
