import { View, Text, ScrollView, Pressable } from "react-native";
import { useContext } from "react";
import {textStyles, Colors} from "@/components/style"

export default function CardActivities(){
    
    return(<View className="flex-1 relative pt-2" style={{backgroundColor: Colors.HoloSecondaryColor}}>
        {/**Card Info**/}
        <View className="flex-1">
            <Text className="text-center color-white" style={[textStyles.h1, textStyles.bold]}> Zviko's Holo Card - Activities </Text>
            <Text className="text-center color-white" style={[textStyles.h2, textStyles.bold]}> 1111 2222 3333 4444 555 </Text>
        </View>
    </View>)
}