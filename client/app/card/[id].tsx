import { View, Text, Image, DimensionValue, Pressable, Button, ScrollView } from "react-native";
import { useContext, useEffect } from 'react'
import { Colors} from "@/components/style";
import { HolocardBalance, HolocardInfo, HolocardCardActivity, HolocardCardActivityProps } from "@/components/holocardcomponets";
import { useLocalSearchParams } from 'expo-router';
import {HoloContext} from '@/contexts/holocontext'
import { useFetchAutoloads, useFetchCardHistory } from "@/hooks/holo/holohooks";
import { HolocardAutoloadInfo } from "@/types/holo";



export default function Holocard(){

    const { id } = useLocalSearchParams();
    const holoContext = useContext(HoloContext);

const holocard = holoContext?.holocards?.find((card) => {
    if (!id) 
        return false;
    return String(card.cardId) === String(id);
    })

    const today = new Date()

    const {autoloadsInfo, loading:autoloadInfoLoading, error:errorLoadingAutoloadInfo} = useFetchAutoloads(holocard?.cardId ?? 0)
    const {cardHistory, loading:cardHistoryLoading, error:errorLoadingCardHistory} = useFetchCardHistory(holocard?.cardId ?? 0)
    
    return(
        <ScrollView contentContainerStyle={{paddingHorizontal:5, paddingTop:10, paddingBottom:60, gap:15}} style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            <HolocardInfo cardName={holocard?.cardName ?? "Holocard"} cardType={holocard?.cardType ?? ""} physicalCardId={holocard?.cardPhyscialID ?? ""}/>
            <HolocardBalance currentBalance={holocard?.balance ?? 0} currentCaps={holocard?.holocardCappingInfo} autoloadsInfo={autoloadsInfo}/>
            <HolocardCardActivity holocardCardActivities={cardHistory?.slice(0, 3)}/>
        </ScrollView>
    )
} 