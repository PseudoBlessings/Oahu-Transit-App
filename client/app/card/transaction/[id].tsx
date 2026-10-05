import { HoloContext } from "@/contexts/holocontext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View, Text, Image } from "react-native";
import {textStyles, Colors, cardStyles} from "@/components/style"


export default function TransactionDetails(){
    const { id } = useLocalSearchParams(); // transactional id
    const holoContext = useContext(HoloContext);


    return(
        <View className="flex-1 flex-col gap-3 p-10" style={{backgroundColor: Colors.HoloSecondaryColor}}>
            <View style={[cardStyles.card, cardStyles.cardShadow]} className="flex-col gap-3 !p-3 bg-white">
                <View className="flex-row justify-between">
                    {/** Transaction Name & Date */}
                    <View className="flex-col">
                        <Text style={[textStyles.h1, textStyles.bold]}>Test</Text>
                        <Text style={[textStyles.h2, textStyles.bold]}>01/01/01</Text>
                    </View>
                    {/** Transaction Amount & Balance */}
                    <View className="flex-col">
                        <Text className="text-right" style={[textStyles.h1, textStyles.bold]}>$0.00</Text>
                        <Text className="text-right" style={[textStyles.h2, textStyles.bold]}>Balance: $8.00</Text>
                    </View>
                </View>

                {/** Boarding or Transfering Information*/}
                <View className="flex-col">
                    {/* <Map></Map> Add a pin in a google map of this location*/}
                    <Text style={[textStyles.h2]}>Stop: MOANALUA RD + 98-1059</Text>
                    <Text style={[textStyles.h2]}>Vehicle #: 6978</Text>
                    <Text style={[textStyles.h2]}>Route: 54 - Upper Pearl City</Text>
                </View>
                {/** Reloading/Purchasing Pass */}
                <View className="flex-col">
                    {/** Card Graphic */}
                    <View className="p-3 gap-2 flex-col rounded-xl border-black border-8 bg-white">
                        <View className="flex-row justify-between"> 
                            <Text style={[textStyles.h1, textStyles.bold]}>Default Card</Text>
                            <Image className="w-12 h-12" source={{uri: "https://img.icons8.com/?size=100&id=106551&format=png&color=000000"}}/>
                        </View>
                        <Image className="w-12 h-12" source={{uri: "https://img.icons8.com/?size=100&id=3559&format=png&color=000000"}}/>
                        <Text className="text-center" style={[textStyles.h1, textStyles.bold]}>•••• •••• •••• 1234</Text>
                        <Image className="w-12 h-12"/>
                    </View>
                    {/** Bank Graphic */}
                    <View className="flex-col p-3 gap-1">
                        <Text className="text-center" style={[textStyles.h1, textStyles.bold]}>Default Bank</Text>
                        <Image className="w-full aspect-square" source={{uri: "https://img.icons8.com/?size=500&id=77054&format=png&color=000000"}}/>
                        <Text className="text-center" style={[textStyles.h1, textStyles.bold]}>•••• •••• •••• 1234</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}