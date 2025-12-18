import { createContext, ReactNode } from "react";
import { useConfigs } from "../hooks";

interface CommonStorageType {
    config: {
        configs: ReturnType<typeof useConfigs>['configs'];
        reset: ReturnType<typeof useConfigs>['reset'];
        updateConfigs: ReturnType<typeof useConfigs>['updateConfigs'];
    }
}

const initialState: CommonStorageType = {
    config: {
        configs: {} as ReturnType<typeof useConfigs>['configs'],
        reset: () => {},
        updateConfigs: () => {}
    }
}

export const CommonContext = createContext<CommonStorageType>(initialState);

export default function CommonProvider({ children }: { children: ReactNode }) {
    const { configs, reset, updateConfigs } = useConfigs();

    return (
        <CommonContext.Provider value={{ config: { configs, reset, updateConfigs } }}>
            {children}
        </CommonContext.Provider>
    )
}