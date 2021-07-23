import React from "react";
import { useContext, createContext, useState } from "react";

type BrightnessState = {
    brightness: number;
    setBrightness: React.Dispatch<React.SetStateAction<number>>;
};

type ContrastState = {
    contrast: number;
    setContrast: React.Dispatch<React.SetStateAction<number>>;
};

type NightVisionState = {
    nightVision: boolean;
    setNightVision: React.Dispatch<React.SetStateAction<boolean>>;
};

type Context = {
    brightnessState: BrightnessState;
    contrastState: ContrastState;
    nightVisionState: NightVisionState;
};

const defaults = {
    brightnessState: {
        brightness: 0,
        setBrightness: (): number => 0,
    },
    contrastState: {
        contrast: 0,
        setContrast: (): number => 0,
    },
    nightVisionState: {
        nightVision: false,
        setNightVision: (): boolean => false,
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

    const contextState: Context = {
        brightnessState: {
            brightness: brightness,
            setBrightness: setBrightness,
        },
        contrastState: {
            contrast: contrast,
            setContrast: setContrast,
        },
        nightVisionState: {
            nightVision: nightVision,
            setNightVision: setNightVision,
        },
    };

    return (
        <AppContext.Provider value={contextState}>
            {children}
        </AppContext.Provider>
    );
};
