import { LoadingView } from "@renderer/components/LoadingView";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KEYS, ROUTES } from "@renderer/utils/constants";
import dataJson from '../../../../../resources/vocab.json'
import { flashCardManger } from "@renderer/utils/FlashCardManager";

export default function FlashScreen() {
    const navigation = useNavigate();

    useEffect(() => {
        const initVocab = async () => {
            await flashCardManger.init()
            const isInitData = localStorage.getItem(KEYS.INIT_DATA);
            if (isInitData) {
                navigation(ROUTES.FLASHCARD)
                return;
            }
            for (let index = 0; index < dataJson.length; index++) {
                const vocab = dataJson[index];
                await flashCardManger.createCard({
                    word: vocab.word,
                    mean: vocab.mean,
                    audio: vocab.audio || undefined,
                    ipa: vocab.ipa,
                    example: vocab.example
                })
            }

            localStorage.setItem(KEYS.INIT_DATA, '1')
            navigation(ROUTES.FLASHCARD)
        }
        initVocab()
    }, [navigation])

    return (
        <LoadingView />
    )
}