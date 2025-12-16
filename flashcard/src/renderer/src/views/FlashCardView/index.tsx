import { Flashcard } from "@renderer/components/FlashCard";
import { flashCardManger } from "@renderer/utils/FlashCardManager";
import { useEffect } from "react";

export function FlashCardView() {
    useEffect(() => {
        (async () => {
            const cards = await flashCardManger.getTodayStudySession(50);
            console.log('=========== cards', cards);
            
        })()
    }, [])

    return (
        <>
            <Flashcard />
        </>
    )
}