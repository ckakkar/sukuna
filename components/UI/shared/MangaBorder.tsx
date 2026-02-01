import { useMemo } from "react"
import { cn } from "@/lib/utils/cn"

interface MangaBorderProps {
    className?: string
    color?: string
    strokeWidth?: number
    roughness?: number
}

export function MangaBorder({
    className,
    color = "black",
    strokeWidth = 2,
    roughness = 1
}: MangaBorderProps) {
    // Generate random seed for unique border path
    const path = useMemo(() => {
        // We'll create a rough rectangle path
        const w = 100
        const h = 100
        const points = []

        // Top edge
        for (let i = 0; i <= 20; i++) {
            points.push(`${(i / 20) * w},${0 + (Math.random() - 0.5) * roughness}`)
        }
        // Right edge
        for (let i = 0; i <= 20; i++) {
            points.push(`${w + (Math.random() - 0.5) * roughness},${(i / 20) * h}`)
        }
        // Bottom edge
        for (let i = 0; i <= 20; i++) {
            points.push(`${((20 - i) / 20) * w},${h + (Math.random() - 0.5) * roughness}`)
        }
        // Left edge
        for (let i = 0; i <= 20; i++) {
            points.push(`${0 + (Math.random() - 0.5) * roughness},${((20 - i) / 20) * h}`)
        }

        return `M ${points.join(" L ")} Z`
    }, [roughness])

    return (
        <div className={cn("absolute inset-0 pointer-events-none z-0", className)}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
            >
                {/* Shadow layer for depth */}
                <path
                    d={path}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={strokeWidth + 2}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    transform="translate(1, 1)"
                />
                {/* Main ink stroke */}
                <path
                    d={path}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-sm"
                />
            </svg>
        </div>
    )
}
