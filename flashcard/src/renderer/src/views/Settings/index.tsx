import { ChangeEvent, useContext } from "react";

import { Switch } from "@renderer/components/Switch"
import { CommonContext } from "@renderer/utils/contexts/CommonStorage";

export function Settings() {
    const { config: { configs, reset, updateConfigs } } = useContext(CommonContext);

    const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        updateConfigs(name, checked);
    }

    return (
        <div className="absolute inset-0 w-full h-full text-white grid grid-rows-[auto,1fr] pt-2">
            <h1 className="text-center text-2xl px-4">Settings</h1>
            <ul className="overflow-auto px-4 content">
                {configs.map((config) => (
                    <li key={config.key} className="flex justify-between">
                        <span>{config.key}: </span>
                        <Switch
                            name={config.key}
                            checked={config.value}
                            onChange={handleUpdate}
                        />
                    </li>
                ))}
                <li>
                    <button onClick={reset}>Reset</button>
                </li>
            </ul>
        </div>
    )
}