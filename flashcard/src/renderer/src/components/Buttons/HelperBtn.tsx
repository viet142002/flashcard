import { useLocation, useNavigate } from "react-router-dom";
import { BackIcon, QuestionIcon } from "../icons";
import { ROUTES } from "@renderer/utils/constants";
import { useEffect, useState } from "react";
import { Button } from "./Button";

export function HelperBtn() {
    const navigation = useNavigate();
    const location = useLocation();

    const [isHelperView, setIsHelperView] = useState(false);

    const onClick = () => {
        if (isHelperView) {
            navigation(-1);
        } else {
            navigation(ROUTES.HELPER)
        }
    }

    useEffect(() => {
        if (location.pathname === '/' + ROUTES.HELPER) {
            setIsHelperView(true);
        } else {
            setIsHelperView(false);
        }
    }, [location]);

    return (
        <Button
            onClick={onClick}
            isAlwaysTopZ
            showOnHoverFlashCard
        >
            {isHelperView ? (
                <BackIcon width={18} height={18} />
            ) : (
                <QuestionIcon />
            )}
        </Button>
    )
}