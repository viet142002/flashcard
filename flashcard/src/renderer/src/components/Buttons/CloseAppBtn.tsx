import { Button } from "./Button";

export const CloseAppBtn = () => {

    return (
        <Button
            showOnHoverFlashCard
            isAlwaysTopZ
            variant="icon"
            onClick={() => {
                window.flashcard.hide();
            }}
        >
            ✕
        </Button>
    )
}