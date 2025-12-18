import { useNavigate } from "react-router-dom";
import { QuestionIcon } from "../icons";
import { ROUTES } from "@renderer/utils/constants";
import { Button } from "./Button";

export function HelperBtn() {
    const navigation = useNavigate();

    return (
        <Button
            onClick={() => navigation(ROUTES.HELPER)}
            isAlwaysTopZ
            variant="icon"
            showOnHoverFlashCard
        >
            <QuestionIcon />
        </Button>
    )
}