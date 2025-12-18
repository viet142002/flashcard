import { useNavigate } from "react-router-dom";
import { SettingIcon } from "../icons";
import { Button } from "./Button";
import { ROUTES } from "@renderer/utils/constants";

export function SettingBtn() {
    const navigate = useNavigate();

    return (
        <Button
            isCircle
            variant="icon"
            isAlwaysTopZ
            showOnHoverFlashCard
            onClick={() => navigate(ROUTES.SETTINGS)}
        >
            <SettingIcon />
        </Button>
    )
}