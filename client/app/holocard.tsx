import { View, Text, Image } from "react-native";
import { Colors, textStyles, moderateScale } from "@/components/style";

export default function Holocard(){
    return(
        <View className="flex-1 flex-col" style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            {/**Holocard Info*/}
            <View className="self-stretch inline-flex flex-col justify-center items-center gap-2.5">
                <Text style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(60, 0.6)}]} className="text-center justify-start text-white">Zviko's Holocard</Text>
                <Image/>
                <Text style={[textStyles.h1, textStyles.bold]} className="text-center justify-start text-white">3105930014120301254</Text>
            </View>
        </View>
    )
} 