import { CONTROLLER } from "@renderer/utils/constants";

export function HelperView() {
    return (
        <div className="w-full h-full px-4 text-white">
            <h1 className="text-center text-2xl">Helper</h1>
            <h2 className="mt-2">Controller</h2>
            <ul className="mt-1 ml-2 pl-2 border-l border-slate-500">
                {Object.values(CONTROLLER).map((item) => (
                    <li key={item.key}>
                        <span>{item.cmd}: </span>
                        <span>{item.des}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}