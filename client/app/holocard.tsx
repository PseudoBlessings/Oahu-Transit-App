import { View, Text, Image, DimensionValue, Pressable, Button, ScrollView } from "react-native";
import { Colors, textStyles, moderateScale, cardStyles } from "@/components/style";
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { HolocardBalance, HolocardInfo, HolocardCardActivity, HolocardCardActivityProps } from "@/components/holocardcomponets";
import { useEffect } from "react";

export interface HolocardProps{
        cardID:number;
    }

export default function Holocard(){

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

    const progressCalc = (options: { percentage?: number; currentAmount?: number; totalAmount?: number }):DimensionValue => {
        const { percentage, currentAmount, totalAmount } = options;
        if (percentage !== undefined) {
            if (percentage > 1) {
                throw new Error("Percentage cannot be higher than 1");
            }
            return `${percentage * 100}%`;
        } else if (currentAmount !== undefined && totalAmount !== undefined) {
            const progress = currentAmount > totalAmount ? 1 : currentAmount / totalAmount;
            return `${progress * 100}%`;
        } else {
            throw new Error("Either percentage or both currentAmount and totalAmount must be provided");
        }
    }
    
    return(
        <ScrollView contentContainerStyle={{paddingHorizontal:5, paddingTop:10, paddingBottom:60, gap:15}} style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            <HolocardInfo cardName="Zviko's Holocard" cardType="Adult Card" physicalCardId={1111222233334444555}/>
            <HolocardBalance currentBalance={1500} totalSpentMonth={5500} totalSpentToday={400}/>
            <HolocardCardActivity holocardCardActivities={sampleActivities}/>
        </ScrollView>
    )
} 