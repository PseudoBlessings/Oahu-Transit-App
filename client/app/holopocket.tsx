import { View, Text, ScrollView, Pressable } from "react-native";
import { useContext } from "react";
import {cardStyles, Colors} from "@/components/style"
import { HolocardPreviewProps, HolocardPreview } from "@/components/holocardcomponets";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import {HoloContext} from '@/contexts/holocontext'
import { useRouter } from "expo-router";

export default function HoloPocket(){
    const router = useRouter();
    const holoContext = useContext(HoloContext);
    
    const handleCardPress = (cardId: number) => {
        router.push({
        pathname: "/card/[id]",
        params: { id: cardId }
        });
    };

    return(<View className="flex-1 relative pt-2">
        <View className="left-0 top-0 absolute w-full h-1/3 -z-1 rounded-b-2xl" style={{backgroundColor: Colors.HoloSecondaryColor}}/>
        <ScrollView className="flex-1 px-5">
            <View className="w-full mb-2">
                <Feather name="arrow-left-circle" size={36} color="black" />
            </View>
            {holoContext?.holocards?.map((holocardInfo, index) => (
                <Pressable key={holocardInfo.cardId} onPress={() => handleCardPress(holocardInfo.cardId)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                    <View key={index} className="mb-5">
                        <HolocardPreview cardName={holocardInfo.cardName} cardType={holocardInfo.cardType} currentBalance={holocardInfo.balance} currentPass={holocardInfo.currentPass ?? ""}/>
                    </View>
                </Pressable>
            ))}
            <View style={[cardStyles.card]} className="flex justify-center items-center bg-white">
                <Text>Add Card</Text>
                <AntDesign name="plus-circle" size={24} color="black" />
            </View>
        </ScrollView>
    </View>
    )
}