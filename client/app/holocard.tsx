import { View, Text, Image, DimensionValue, Pressable, Button } from "react-native";
import { Colors, textStyles, moderateScale, cardStyles } from "@/components/style";
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Holocard(){
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
        <View className="flex-1 flex-col px-5 pt-3 pb-2" style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            {/**Holocard Info*/}
            <View className="self-stretch inline-flex flex-col justify-center items-center gap-2.5">
                <Text style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(60, 0.6)}]} className="text-center justify-start text-white">Zviko's Holocard</Text>
                <Image/>
                <Text style={[textStyles.h1, textStyles.bold]} className="text-center justify-start text-white">3105930014120301254</Text>
            </View>
            {/**Holocard Balance Section*/}
            <View className="flex-col px-7 py-5 gap-2.5" style={[cardStyles.card, {backgroundColor:`${Colors.HoloAccentColor}`}]}>
                <Text className="text-white" style={[textStyles.h1]}>Card Balance</Text>
                <Text className="text-white" style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(96, 0.65)}]}>$15.00</Text>
                {/**Monthly Pass Progress Component*/}
                <View className="flex-col">
                    <Text className="text-white" style={[textStyles.h1]}>Month Pass • {today.toLocaleString('default', { month: 'long' })}</Text>
                    {/**Progress Bar Component*/}
                    <View className="flex">
                        <View className="h-2 z-10 absolute rounded-full" style={{backgroundColor:`${Colors.HoloSecondaryColor}`, width:progressCalc({percentage:0.5})}}></View>
                        <View className="bg-white w-full h-2 absolute rounded-full"></View>
                    </View>
                </View>
                {/**Daily Pass Progress Component*/}
                <View className="flex-col">
                    <Text className="text-white" style={[textStyles.h1]}>Daily Pass • {today.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric'} )}</Text>
                    {/**Progress Bar Component*/}
                    <View className="flex">
                        <View className="h-2 z-10 absolute rounded-full" style={{backgroundColor:`${Colors.HoloSecondaryColor}`, width:progressCalc({percentage:0.5})}}></View>
                        <View className="bg-white w-full h-2 absolute rounded-full"></View>
                    </View>
                </View>
                <Text className="text-white opacity-50" style={[textStyles.h1]}>Next Autoload February 18th $80</Text>
                {/**Balance Actions*/}
                <View className="flex flex-row self-stretch justify-around items-center overflow-hidden">
                    <View className="flex flex-col">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <Foundation name="refresh" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text>Autoload</Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <MaterialCommunityIcons name="cash-plus" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text>Add Cash</Text>
                    </View>
                    <View className="flex flex-col justify-center items-center">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <Ionicons name="ticket-outline" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text>Passes</Text>
                    </View>
                </View>
            </View>
        </View>
    )
} 