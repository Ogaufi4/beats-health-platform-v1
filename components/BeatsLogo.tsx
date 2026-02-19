import Image from "next/image"

interface BeatsLogoProps {
  /**
   * Height of the logo in pixels. Width scales proportionally (the logo
   * image is roughly 1:0.55 width-to-height, so we set height and let
   * Next.js compute the width).
   */
  size?: number
  /**
   * When true the logo is rendered white (useful on dark backgrounds).
   * Achieved via a CSS invert filter — works well because the logo uses
   * a solid blue on white background.
   */
  variant?: "color" | "white"
  className?: string
}

export default function BeatsLogo({
  size = 40,
  variant = "color",
  className = "",
}: BeatsLogoProps) {
  // Approximate aspect ratio of the provided logo image (icon + wordmark stacked)
  const width = Math.round(size * 1.9)
  const height = size

  return (
    <Image
      src="/logo.png"
      alt="Beats Health Botswana"
      width={width}
      height={height}
      priority
      className={className}
      style={{
        objectFit: "contain",
        filter: variant === "white" ? "brightness(0) invert(1)" : "none",
      }}
    />
  )
}
