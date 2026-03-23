import Image from "next/image"

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 40, className = "", showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo.png"
        alt="ShieldTech Logo"
        width={size * 3}
        height={size * 3}
        className="object-contain"
      />
    </div>
  )
}
