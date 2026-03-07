import { View, Text, ScrollView } from "react-native";
import {cardStyles, Colors} from "@/components/style"
import { HolocardPreviewInterface, HolocardPreview } from "@/components/holocardcomponets";
import { Fragment, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

export interface HoloPocketProps {
    holocardsPreviews: HolocardPreviewInterface[];
}

export default function HoloPocket({ holocardsPreviews }: HoloPocketProps){

    return(<View className="flex-1 relative pt-2">
        <View className="left-0 top-0 absolute w-full h-1/3 -z-1 rounded-b-2xl" style={{backgroundColor: Colors.HoloSecondaryColor}}/>
        <ScrollView className="flex-1 px-5">
            <View className="w-full mb-2">
                <Feather name="arrow-left-circle" size={36} color="black" />
            </View>
            {holocardsPreviews.map((holocardInfo, index) => (
                <View key={index} className="mb-5">
                    <HolocardPreview cardName={holocardInfo.cardName} cardType={holocardInfo.cardType} currentBalance={holocardInfo.currentBalance} currentPass={holocardInfo.currentPass}/>
                </View>
            ))}
            <View style={[cardStyles.card]} className="flex justify-center items-center">
                <Text>Add Card</Text>
                <AntDesign name="plus-circle" size={24} color="black" />
            </View>
        </ScrollView>
    </View>
    )
}