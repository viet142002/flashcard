import { useNavigate } from "react-router-dom";

import { Button } from "./Button";
import { TwoCards } from "../icons";
import { ROUTES } from "@renderer/utils/constants";

export function FlashCardBtn() {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(ROUTES.FLASHCARD)}
            isAlwaysTopZ
            variant="icon"
            showOnHoverFlashCard
        >
            <TwoCards width={18} height={18} />
        </Button>
    )
}