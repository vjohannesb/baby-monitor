import React from "react";
import { useContext, createContext, useState } from "react";

type FilterState = {
    brightness: number;
    setBrightness: React.Dispatch<React.SetStateAction<number>>;
    contrast: number;
    setContrast: React.Dispatch<React.SetStateAction<number>>;
    nightVision: boolean;
    setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
};

type ConnectionState = {
    connected: boolean;
    setConnected: React.Dispatch<React.SetStateAction<boolean>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
};

type Context = {
    filterState: FilterState;
    connectionState: ConnectionState;
};

const defaults = {
    filterState: {
        brightness: 0,
        setBrightness: (): number => 0,
        contrast: 0,
        setContrast: (): number => 0,
        nightVision: false,
        setNightVision: (): boolean => false,
    },
    connectionState: {
        connected: false,
        setConnected: (): boolean => false,
        address: "192.168.50.5",
        setAddress: (): string => "192.168.50.5",
    },
};

const AppContext = createContext<Context>(defaults);

export function useAppContext(): Context {
    return useContext(AppContext);
}

//* Component
export const ContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [nightVision, setNightVision] = useState(false);
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("192.168.0.199");

    const contextState: Context = {
        filterState: {
            brightness: brightness,
            setBrightness: setBrightness,
            contrast: contrast,
            setContrast: setContrast,
            nightVision: nightVision,
            setNightVision: setNightVision,
        },
        connectionState: {
            connected: connected,
            setConnected: setConnected,
            address: address,
            setAddress: setAddress,
        },
    };

    return (
        <AppContext.Provider value={contextState}>
            {children}
        </AppContext.Provider>
    );
};
