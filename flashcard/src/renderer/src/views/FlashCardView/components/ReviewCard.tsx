import { Button } from "@renderer/components/Buttons/Button";
import { Tooltip } from "@renderer/components/Tooltip"
import { Quality } from "@renderer/utils/types"
import { MouseEvent, useEffect } from "react";

const quality = {
    [Quality.BLACKOUT]: 'Hoàn toàn không nhớ',
    [Quality.INCORRECT]: 'Sai, nhưng khi xem đáp án thì quen',
    [Quality.RECALL_HARD]: 'Sai, nhưng gần đúng',
    [Quality.RECALL_GOOD]: 'Đúng, nhưng khó nhớ',
    [Quality.RECALL_EASY]: 'Đúng, hơi phân vân',
    [Quality.PERFECT]: 'Đúng, dễ dàng',
}

interface ReviewCardProps {
    onReview: (quality: Quality) => void
}

export function ReviewCard({ onReview }: ReviewCardProps) {

    const handlePress = (e: MouseEvent) => {
        const current = e.target as HTMLButtonElement;
        const quality = current['dataset']['value'] as unknown as Quality;
        onReview(quality);
    }

    useEffect(() => {
        const keys = Object.keys(quality);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (keys.includes(e.key)) {
                onReview(e.key as unknown as Quality);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onReview])

    return (
        <div className="fixed inset-0 flex justify-center items-center flex-col z-50 rounded-xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-[10px] bg-black/60" />
            <h2 className="text-center text-white z-10 mb-6">Đánh giá</h2>
            <ul className="flex gap-2">
                {Object.entries(quality).map(([key, value]) => (
                    <li key={key} className="mb-2">
                        <Tooltip content={value}>
                            <Button
                                variant="icon"
                                hasBorder
                                isCircle
                                data-value={key}
                                onClick={handlePress}
                            >
                                {key}
                            </Button>
                        </Tooltip>
                    </li>
                ))}
            </ul>
        </div>
    )
}