import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const ShrinkingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", style, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const maxFontSize = 150 // Maximum font size in pixels
    const minFontSize = 20 // Minimum font size in pixels

    const [fontSize, setFontSize] = React.useState<number>(maxFontSize)

    React.useEffect(() => {
      if (inputRef.current) {
        const parentWidth = inputRef.current.offsetWidth
        const context = document.createElement("canvas").getContext("2d")
        if (context) {
          const fontFamily = window.getComputedStyle(inputRef.current).fontFamily
          const text = inputRef.current.value || inputRef.current.placeholder || "0"

          // Measure text width at font size 1px
          context.font = `1px ${fontFamily}`
          const textWidthAt1px = context.measureText(text).width

          // Calculate required font size to fit text within input width
          let requiredFontSize = parentWidth / textWidthAt1px

          // Clamp font size between min and max
          requiredFontSize = Math.min(requiredFontSize, maxFontSize)
          requiredFontSize = Math.max(requiredFontSize, minFontSize)

          setFontSize(requiredFontSize)
        }
      }
    }, [props.value])

    // Function to sanitize input to allow only numbers and dots
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Allow only digits and dots
      const sanitizedValue = value.replace(/[^0-9.]/g, "")
      // Prevent multiple dots
      const parts = sanitizedValue.split(".")
      const filteredValue =
        parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : sanitizedValue

      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: filteredValue },
        })
      }
    }

    return (
      <div
        className="relative w-full h-28 overflow-hidden"
      >
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          {...props}
          onChange={handleInputChange}
          ref={(el) => {
            inputRef.current = el
            if (typeof ref === "function") {
              ref(el)
            } else if (ref) {
              ref.current = el
            }
          }}
          className={cn(
            "absolute inset-0 w-full h-full bg-transparent",
            "appearance-none", // Removes number input arrows
            "overflow-hidden whitespace-nowrap", // Prevents scrolling
            "focus:outline-none",
            className
          )}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: "60px", // Align text vertically
            transition: "font-size 0.1s ease-out",
            ...style,
          }}
        />
      </div>
    )
  }
)

ShrinkingInput.displayName = "ShrinkingInput"

export { ShrinkingInput }