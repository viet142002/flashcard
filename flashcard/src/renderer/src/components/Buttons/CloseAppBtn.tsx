import { Button } from "./Button";

export const CloseAppBtn = () => {

    return (
        <Button
            showOnHoverFlashCard
            isAlwaysTopZ
            onClick={() => {
                window.flashcard.hide();
            }}
        >
            ✕
        </Button>
    )
}