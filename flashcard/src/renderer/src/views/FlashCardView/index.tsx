import { useCallback, useEffect, useMemo, useState } from "react";

import { FlashCardComponent } from "@renderer/components/FlashCard";
import { LoadingView } from "@renderer/components/LoadingView";
import { flashCardManger } from "@renderer/utils/FlashCardManager";
import { FlashCard, Quality } from "@renderer/utils/types";
import { AlertReached } from "./components/AlertReached";
import { ReviewCard } from "./components/ReviewCard";

export function FlashCardView() {
    const [currentCard, setCurrentCard] = useState<FlashCard>();
    const [cards, setCards] = useState<FlashCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showReview, setShowReview] = useState(false);

    const fetchCards = useCallback(async () => {
        const cards = await flashCardManger.getTodayStudySession(50);        
        setCurrentIndex(0);
        setCards(cards);
    }, []);

    const handleNextCard = useCallback(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, []);

    const handleShowReview = useCallback(() => {
        setShowReview(true);
    }, []);

    const handlePrevCard = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex <= 0) return 0;
            return prevIndex - 1;
        });
    }, []);

    const handleReview = useCallback(async (quality: Quality) => {
        await flashCardManger.reviewCard(currentCard!.id, quality);
        setShowReview(false);
        handleNextCard();
    }, [currentCard, handleNextCard]);

    const reached = useMemo(() => currentIndex >= cards.length - 1, [cards, currentIndex]);

    const handleRepay = useCallback(async () => {
        setCurrentIndex(0);
    }, []);

    useEffect(() => {
        if (!flashCardManger.checkInit()) return
        (async () => {
            await fetchCards();
        })()
    }, [fetchCards])

    useEffect(() => {
        setCurrentCard(cards[currentIndex])
    }, [cards, currentIndex])

    if (reached) {
        return <AlertReached onFetchNewList={fetchCards} onReplay={handleRepay} />
    }

    if (!currentCard) {
        return <LoadingView />
    }

    return (
        <>
            {showReview && <ReviewCard onReview={handleReview} />}
            <FlashCardComponent
                card={currentCard}
                onReview={handleReview}
                onNext={handleShowReview}
                onPrev={handlePrevCard}
                currentIndex={currentIndex}
                maxCards={cards.length}
            />
        </>
    )
}