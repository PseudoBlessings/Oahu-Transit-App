import { View, Text, Image, DimensionValue, Pressable, Button, ScrollView } from "react-native";
import { useContext } from 'react'
import { Colors} from "@/components/style";
import { HolocardBalance, HolocardInfo, HolocardCardActivity, HolocardCardActivityProps } from "@/components/holocardcomponets";
import { useLocalSearchParams } from 'expo-router';
import {HoloContext} from '@/contexts/holocontext'



export default function Holocard(){

    const { id } = useLocalSearchParams();
    const holoContext = useContext(HoloContext);

const holocard = holoContext?.holocards?.find((card) => {
    if (!id) 
        return false;
    return String(card.cardId) === String(id);
    })


    const sampleActivities:HolocardCardActivityProps[] = [
    {
        activityName: "Boarding",
        activityID: "06484FCO-70-86-69B4CBC3396",
        activityType:"Boarding",
        activityTimestamp: "2026-03-14T02:45:23Z",
        activityDescription: "Boarded the bus on stop: KAMEHAMEHA HWY + OPP PALI MOMI ST",
        activityCharge: -300,
        activityBalance: 0,
    },
    {
        activityName: "Reload",
        activityID: "62843e41-d9dd-4287-9a39-4425a19fbe55",
        activityType:"Charge",
        activityTimestamp: "2026-03-11T03:00:25Z",
        activityDescription: "Reloaded card",
        activityCharge: 2000,
        activityBalance: 2100,
    }
];

    const today = new Date()
    
    return(
        <ScrollView contentContainerStyle={{paddingHorizontal:5, paddingTop:10, paddingBottom:60, gap:15}} style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            <HolocardInfo cardName={holocard?.cardName ?? "Holocard"} cardType={holocard?.cardType ?? ""} physicalCardId={holocard?.cardPhyscialID ?? ""}/>
            <HolocardBalance currentBalance={holocard?.balance ?? 0} currentCaps={holocard?.holocardCappingInfo}/>
            <HolocardCardActivity holocardCardActivities={sampleActivities}/>
        </ScrollView>
    )
} 