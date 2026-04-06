import { createContext, PropsWithChildren} from "react"
import { View } from "react-native"
import { useFetchAccount, useFetchCards} from "@/hooks/holo/holohooks"
import { HoloAccountInfo, HolocardInfo } from "@/types/holo"

interface HoloContextValue{
    holocards: HolocardInfo[] | undefined;
    holoAccount: HoloAccountInfo | undefined;
    holocardsLoading: boolean;
    holoAccountLoading: boolean;
    holocardsError: boolean;
    holoAccountError: boolean;
}

export const HoloContext = createContext<HoloContextValue | undefined>(undefined);

export default function HoloProvider({ children }: PropsWithChildren){
    const {cards, loading:cardsLoading, error:errorLoadingCards} = useFetchCards()
    const {account, loading:accountLoading, error:errorLoadingAccount} = useFetchAccount()
    return(
        <HoloContext value={{
            holocards: cards, 
            holoAccount: account, 
            holocardsLoading: cardsLoading,
            holoAccountLoading: accountLoading,
            holocardsError: errorLoadingCards,
            holoAccountError: errorLoadingAccount
            }}>
            {children}
        </HoloContext>
        
    )
}
