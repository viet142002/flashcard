import { useLocation } from "react-router-dom";
import { BackAppBtn } from "../Buttons/BackAppBtn";
import { CloseAppBtn } from "../Buttons/CloseAppBtn";
import { FlashCardBtn } from "../Buttons/FlashCardBtn";
import { HelperBtn } from "../Buttons/HelperBtn";
import { SettingBtn } from "../Buttons/SettingBtn";
import { ROUTES } from "@renderer/utils/constants";

export function Header() {
    const { pathname } = useLocation();

    const showBackRoutes = [`/${ROUTES.SETTINGS}`, `/${ROUTES.HELPER}`];

    return (
        <div className="drag-zone flex items-center justify-between">
            <div className="flex gap-1">
                {showBackRoutes.includes(pathname) && <BackAppBtn />}
                <FlashCardBtn />
                <SettingBtn />
                <HelperBtn />
            </div>
            <CloseAppBtn />
        </div>
    )
}