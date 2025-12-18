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

    const updateConfigs = useCallback((_configs: typeof configs) => {
        setConfigs(_configs);
        localStorage.setItem(KEYS.CONFIGS, JSON.stringify(_configs));
    }, []);

    const reset = useCallback(() => {
        localStorage.removeItem(KEYS.CONFIGS);
        setConfigs(CONFIGS);
    }, []);

    return { configs, updateConfigs, reset }
}