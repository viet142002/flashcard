import { LoadingCircle } from "../icons";

export function LoadingView() {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="w-36 h-36">
                <LoadingCircle />
            </div>
        </div>
    )
}