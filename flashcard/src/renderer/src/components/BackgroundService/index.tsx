import { flashCardManger } from "@renderer/utils/FlashCardManager";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const BackgroundService = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!flashCardManger.checkInit() && location.pathname !== '/') {
            navigate('/');
        }
    }, [location.pathname, navigate]);
    return null;
}