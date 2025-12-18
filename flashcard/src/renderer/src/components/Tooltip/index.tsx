import { ReactNode } from "react"

interface TooltipProps {
    content: string
    children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {

    return (
        <div
            className="relative group/tooltip"
        >
            <div
                className="absolute bg-sky-900 text-white min-w-40 bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 duration-400 text-center rounded-2xl px-1 z-50"
            >
                {content}
            </div>
            {children}
        </div>
    )
}