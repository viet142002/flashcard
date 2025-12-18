import { memo, MouseEvent, useCallback, useEffect } from "react";
import { Button } from "../Buttons/Button";
import { NextIcon, PreviousIcon, RefreshIcon } from "../icons";
import { Quality } from "@renderer/utils/types";

interface ControllerProps {
    onFlip: () => void
    onNext: () => void
    onPrev: () => void
    onReview: (quality: Quality) => void
    isListening?: boolean
}

const typeAction = {
    flip: 'flip',
    next: 'next',
    prev: 'prev',
    review: 'review'
}

function ControllerMemo({ onFlip, onNext, onPrev, onReview, isListening = false }: ControllerProps) {

    const sizeIcon = 15;

    const handleClick = useCallback((e: MouseEvent | KeyboardEvent, type: string, quality?: Quality) => {
        e.stopPropagation();
        switch (type) {
            case typeAction.flip:
                onFlip();
                break;
            case typeAction.next:
                onNext();
                break;
            case typeAction.prev:
                onPrev();
                break;
            case typeAction.review:
                if (!quality) return
                onReview(quality);
                break;
            default:
                break;
        }
    }, [onFlip, onNext, onPrev, onReview])

    useEffect(() => {
        if (!isListening) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                    handleClick(e, typeAction.next);
                    break;
                case 'ArrowLeft':
                    handleClick(e, typeAction.prev);
                    break;
                case 'Space':
                    handleClick(e, typeAction.flip);
                    break;
                default:
                    break;
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown); 
    }, [handleClick, isListening])

    return (
        <div className="flex justify-center gap-4">
            <Button
                isCircle
                hasBorder
                isAlwaysTopZ
                className="bg-slate-400/20"
                onClick={(e) => handleClick(e, typeAction.prev)}
            >
                <PreviousIcon width={sizeIcon} height={sizeIcon} />
            </Button>
            <Button
                isCircle
                hasBorder
                isAlwaysTopZ
                className="bg-slate-400/20"
                onClick={(e) => handleClick(e, typeAction.flip)}
            >
                <RefreshIcon width={sizeIcon} height={sizeIcon} />
            </Button>
            <Button
                isCircle
                hasBorder
                isAlwaysTopZ
                className="bg-slate-400/20 pl-0.75"
                onClick={(e) => handleClick(e, typeAction.next)}
            >
                <NextIcon width={sizeIcon} height={sizeIcon} />
            </Button>
        </div>
    )
};

export const Controller = memo(ControllerMemo)