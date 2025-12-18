import { useConfigs } from "@renderer/utils/hooks"

export function Settings() {
    const { configs, reset, updateConfigs } = useConfigs()

    return (
        <div>
            <h1>Settings</h1>

            <div>
                <ul>
                    {configs.map((config) => (
                        <li key={config.key}>
                            <input type="checkbox" checked={config.value} />
                            <span>{config.key}: </span>
                        </li>
                    ))}
                    <li>
                        <button onClick={reset}>Reset</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}