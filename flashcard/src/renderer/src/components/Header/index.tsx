import { CloseAppBtn } from "../Buttons/CloseAppBtn";
import { HelperBtn } from "../Buttons/HelperBtn";

export function Header() {
    return (
        <div className="drag-zone flex items-center justify-between">
            <HelperBtn />
            <CloseAppBtn />
        </div>
    )
}