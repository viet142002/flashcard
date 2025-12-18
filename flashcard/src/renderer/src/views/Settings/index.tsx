import { ChangeEvent, Fragment, useContext, useMemo, useState } from 'react'

import { Switch } from '@renderer/components/Switch'
import { CommonContext } from '@renderer/utils/contexts/CommonStorage'
import { Button } from '@renderer/components/Buttons/Button'

export function Settings() {
    const {
        config: { configs, updateConfigs },
    } = useContext(CommonContext)

    const [configsState, setConfigsState] = useState(configs)

    const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked, value } = e.target;
        const [key, nameKey] = name.split('-');

        if (nameKey === 'delay') {
            setConfigsState((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    delay: value,
                },
            }))
        } else {
            setConfigsState((prev) =>({
                ...prev,
                [key]: {
                    ...prev[key],
                    enabled: checked
                }
            }))
        }
    }

    const handleSaveConfigs = () => {
        updateConfigs(configsState)
    }

    const handleReset = () => {
        setConfigsState(configs)
    }

    const isChangedConfig = useMemo(() => {
        return JSON.stringify(configs) !== JSON.stringify(configsState)
    }, [configs, configsState])

    return (
        <div className="absolute inset-0 w-full h-full text-white flex flex-col pt-2">
            <h1 className="text-center text-2xl px-4">Settings</h1>
            <ul className="overflow-auto px-4 content flex-1">
                {Object.entries(configsState).map(([key, config]) => (
                    <Fragment key={key}>
                        <li className="flex justify-between">
                            <span>{config.title}: </span>
                            <Switch
                                name={key}
                                checked={config.enabled}
                                onChange={handleUpdate}
                            />
                        </li>
                        <li className={`mb-4 ml-4 ${!config.enabled ? 'opacity-50' : ''}`}>
                            <label>Delay: </label>
                            <input
                                name={`${key}-delay`}
                                onChange={handleUpdate}
                                type="text"
                                value={config.delay}
                                className='bg-slate-400/60 rounded-md px-1'
                                disabled={!config.enabled}
                            />
                        </li>
                    </Fragment>
                ))}
            </ul>
            <div className={`flex justify-center gap-2 duration-300 ${isChangedConfig ? 'opacity-100' : 'opacity-0'}`}>
                <Button
                    hasBorder
                    onClick={handleReset}
                    disabled={!isChangedConfig}
                    className='px-2 rounded-md'
                >
                    Reset
                </Button>
                <Button
                    hasBorder
                    onClick={handleSaveConfigs}
                    disabled={!isChangedConfig}
                    className='px-2 rounded-md bg-sky-600'
                >
                    Save
                </Button>
            </div>
        </div>
    )
}
