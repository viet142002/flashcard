import { throttle } from "@renderer/utils/common"
import { DetailedHTMLProps, HTMLAttributes, MouseEvent, useCallback, useEffect, useRef } from "react"

const directions = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e']

export function ResizeHandle() {

    const isResizing = useRef(false)
    const currentHandle = useRef('')
    const startBounds = useRef({ x: 0, y: 0, width: 0, height: 0 })
    const startPos = useRef({ x: 0, y: 0 })

    const handleMouseDown = useCallback(async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        isResizing.current = true
        currentHandle.current = e.target['dataset']['direction']

        startPos.current = { x: e.screenX, y: e.screenY };

        if (window.flashcard) {
            startBounds.current = await window.flashcard.getBounds()
        }
    }, [])

    const handleMouseUp = useCallback(() => {
        isResizing.current = false
        currentHandle.current = ''
    }, [])

    useEffect(() => {
        const handleMouseMove = throttle((e: MouseEvent) => {
            if (!isResizing.current || !startBounds.current || !window.flashcard) return;

            const dx = e.screenX - startPos.current.x
            const dy = e.screenY - startPos.current.y

            const newSize = { width: startBounds.current.width, height: startBounds.current.height };
            const newEndPos = { x: startBounds.current.x, y: startBounds.current.y };

            const { width: prevW, height: prevH, x: prevX, y: prevY } = startBounds.current;
            // Tính toán kích thước mới dựa trên hướng resize
            switch (currentHandle.current) {
                case 'se': // Bottom-right
                    newSize.width = prevW + dx;
                    newSize.height = prevH + dy;
                    break
                case 'e': // Right
                    newSize.width = prevW + dx
                    break
                case 's': // Bottom
                    newSize.height = prevH + dy;
                    break
                case 'sw': // Bottom-left
                    newSize.width = prevW - dx;
                    newSize.height = prevH + dy;
                    newEndPos.x = prevX - dx;
                    break
                case 'w': // Left
                    newSize.width = prevW - dx;
                    newEndPos.x = prevX + dx;
                    break
                case 'nw': // Top-left
                    newSize.width = prevW - dx;
                    newSize.height = prevH - dy;
                    newEndPos.x = prevX + dx;
                    newEndPos.y = prevY + dy;
                    break
                case 'n': // Top
                    newSize.height = prevH - dy;
                    newEndPos.y = prevY + dy;
                    break
                case 'ne': // Top-right
                    newSize.width = prevW + dx;
                    newSize.height = prevH - dy;
                    newEndPos.y = prevY + dy;
                    break
                default:
                    break
            }
            window.flashcard.resizeWindow({ ...newSize, ...newEndPos })
        }, 100)

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseUp]);

    return (
        <>
            {directions.map((dir) => (
                <ResizeDirection
                    key={dir}
                    dir={dir}
                    onMouseDown={handleMouseDown}
                />
            ))}
        </>
    )
}

const ResizeDirection = ({ dir, ...props }: { dir: string } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    return (
        <div
            className={`resize-handle resize-${dir} cursor-${dir}-resize`}
            data-direction={dir}
            {...props}
        />
    )
}