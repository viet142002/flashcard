import { FlashCard } from "@renderer/utils/types"
import { memo, useCallback, useEffect, useState } from "react"
import { Controller } from "../Controller"
import { Tag } from "../Tag"


interface FlashCardProps {
    onReview: (quality: number) => void
    onNext: () => void
    onPrev: () => void
    card: FlashCard,
    currentIndex: number,
    maxCards: number
}

function FlashcardMemo({ card, onReview, onNext, onPrev, currentIndex, maxCards }: FlashCardProps) {
    const [flipped, setFlipped] = useState(false)

    const handleFlip = useCallback(() => {
        setFlipped(prev => !prev)
    }, [])

    useEffect(() => {
        setFlipped(false)
    }, [card])

    return (
        <div
            className="w-full h-full flex items-center justify-center text-center cursor-pointer select-none"
            onClick={handleFlip}
        >
            <div
                className={`absolute inset-0 transition-all duration-500 ease-out`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Front side */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <IndicateCurrent max={maxCards} current={currentIndex} />
                    <div className="text-slate-900 dark:text-white text-center">
                        <div className="text-3xl mb-2">{card.word}</div>
                        {card.ipa && (
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                {card.ipa}
                            </div>
                        )}
                    </div>
                    <div className="absolute group-hover/flashcard:opacity-100 opacity-0 group-hover/flashcard:bottom-3 -bottom-6 duration-300 text-xs text-slate-400 dark:text-slate-500">
                        <Controller
                            onFlip={handleFlip}
                            onNext={onNext}
                            onPrev={onPrev}
                            onReview={onReview}
                            isListening
                        />
                    </div>
                </div>

                {/* Back side */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/50 rounded-xl p-6"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <IndicateCurrent max={maxCards} current={currentIndex} />
                    <div className="text-center space-y-3">
                        <div className="text-blue-900 dark:text-blue-200 text-xl">
                            {card.mean}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 italic border-t border-blue-200/50 dark:border-blue-700/50 pt-3">
                            &quot;{card.example}&quot;
                        </div>
                    </div>
                    <div className="absolute text-xs text-blue-400 dark:text-blue-500 duration-300 group-hover/flashcard:opacity-100 opacity-0 group-hover/flashcard:bottom-3 -bottom-6">
                        <Controller
                            onFlip={handleFlip}
                            onNext={onNext}
                            onPrev={onPrev}
                            onReview={onReview}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FlashCardComponent = memo(FlashcardMemo)

const IndicateCurrent = ({ max, current }: { max: number, current: number }) => {
    return (
        <Tag className="absolute top-4 left-4 border-slate-500/30 bg-slate-600/30 border py-1 text-slate-300 text-xs">
            {current + 1}/{max}
        </Tag>
    )
}