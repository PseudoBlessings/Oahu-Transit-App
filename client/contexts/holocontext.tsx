import React, { createContext, ReactNode, useContext, useState } from 'react';

interface HoloProviderProps{
    children:ReactNode
}

interface HoloContextType {
    session: any;
    setSession: React.Dispatch<React.SetStateAction<any>>;
    cards: any[];
    setCards: React.Dispatch<React.SetStateAction<any[]>>;
}

const HoloContext = createContext<HoloContextType | null>(null);

export const HoloProvider = ({ children }:HoloProviderProps) => {
    const [session, setSession] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);
    return (
        <HoloContext.Provider value={{ session, setSession, cards, setCards }}>
        {children}
        </HoloContext.Provider>
    );
};

export const useHolo = () => useContext(HoloContext);