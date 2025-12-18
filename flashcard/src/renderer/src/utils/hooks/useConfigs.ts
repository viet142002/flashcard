import { useCallback, useEffect, useState } from "react"
import { CONFIGS } from "../configs"
import { KEYS } from "../constants";


export const useConfigs = () => {
    const [configs, setConfigs] = useState(CONFIGS)

    useEffect(() => {
        const configs = localStorage.getItem(KEYS.CONFIGS);
        if (configs) {
            setConfigs(JSON.parse(configs));
        }
    }, []);

    const updateConfigs = useCallback((key, value) => {
        setConfigs((prevConfig) => {
            const newConfigs =prevConfig.map(config => config.key === key ? { ...config, value } : config)
            localStorage.setItem(KEYS.CONFIGS, JSON.stringify(newConfigs));
            return newConfigs
        });
    }, []);

    const reset = useCallback(() => {
        localStorage.removeItem(KEYS.CONFIGS);
        setConfigs(CONFIGS);
    }, []);

    return { configs, updateConfigs, reset }
}