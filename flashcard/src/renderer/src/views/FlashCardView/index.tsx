import { useContext, useMemo } from "react";

import { FlashCardComponent } from "@renderer/components/FlashCard";
import { LoadingView } from "@renderer/components/LoadingView";
import { AlertReached } from "./components/AlertReached";
import { ReviewCard } from "./components/ReviewCard";
import { FlashCardContext } from "@renderer/utils/contexts/FlashCardContext";

export function FlashCardView() {
    const { currentCard, cards, currentIndex, showReview, handleShowReview, handlePrevCard, handleReview, handleReplay, fetchCards } = useContext(FlashCardContext);

    const reached = useMemo(() => currentIndex >= cards.length, [currentIndex, cards.length]);

    if (!currentCard) {
        return <LoadingView />
    }

    if (reached) {
        return <AlertReached onFetchNewList={fetchCards} onReplay={handleReplay} />
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