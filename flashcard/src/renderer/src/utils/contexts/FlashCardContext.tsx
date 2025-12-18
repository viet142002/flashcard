import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { FlashCard, Quality } from "../types";
import { flashCardManger } from "../FlashCardManager";

interface FlashCardContextType {
    currentCard: FlashCard | undefined;
    cards: FlashCard[];
    currentIndex: number;
    showReview: boolean;
    handleNextCard: () => void;
    handleShowReview: () => void;
    handlePrevCard: () => void;
    handleReview: (quality: Quality) => Promise<void>;
    handleReplay: () => void;
    fetchCards: () => Promise<void>;
}

const initialState: FlashCardContextType = {
    currentCard: undefined,
    cards: [],
    currentIndex: 0,
    showReview: false,
    handleNextCard: () => { },
    handleShowReview: () => { },
    handlePrevCard: () => { },
    handleReview: async () => { },
    handleReplay: () => { },
    fetchCards: async () => { }
}

export const FlashCardContext = createContext<FlashCardContextType>(initialState);

export default function FlashCardProvider({ children }: { children: ReactNode }) {
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

    const handleReplay = useCallback(async () => {
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

    return (
        <FlashCardContext.Provider value={{
            currentCard,
            cards,
            currentIndex,
            showReview,
            handleNextCard,
            handleShowReview,
            handlePrevCard,
            handleReview,
            handleReplay,
            fetchCards
        }}>
            {children}
        </FlashCardContext.Provider>
    )
}