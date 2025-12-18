import { useNavigate } from "react-router-dom";

import { Button } from "./Button";
import { BackIcon } from "../icons";

export function BackAppBtn() {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(-1)}
            isAlwaysTopZ
            variant="icon"
            showOnHoverFlashCard
        >
            <BackIcon width={18} height={18} />
        </Button>
    )
}