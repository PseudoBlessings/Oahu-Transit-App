import { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, DimensionValue } from "react-native";
import { cardStyles, textStyles, scale, moderateScale, Colors } from "./style";
import Divider from "./divider";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export interface HolocardPreviewProps{
    cardName:string;
    cardType:string;
    currentBalance:number;
    currentPass:string;
}

export interface HolocardInfoProps{
    cardName:string;
    cardType:string;
    physicalCardId:number|string;
}

export interface HolocardBalanceProps{
    currentBalance: number;
    totalSpentToday: number;
    totalSpentMonth: number;
    autoloadDate?: string;
    autoloadAmount?: number;
}

export interface HolocardCardActivityProps{
    activityType: string;
    activityName: string;
    activityTimestamp: string;
    activityDescription?:string;
    activityCharge: number;
    activityBalance: number;
}

const holocardPreviewStyle = StyleSheet.create({
    column:{
        flex: 1,
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:scale(10),
        paddingVertical:scale(22)
    }
})


function getCardImage(cardType?:string):string{
    switch (cardType) {
        case "Adult Card":
            return "../assets/images/holo/adult.png"
            break;
        default:
            return ""
            break;
    }
}


export function HolocardPreview({cardName, cardType, currentBalance, currentPass}:HolocardPreviewProps){
    useEffect(()=>{
        getCardImage(cardType)
    })

    const asset = Image.resolveAssetSource(require('../assets/images/holo/adult.png'));
    const ratio = asset.width / asset.height;


    return(
            <View
                style={[cardStyles.card, {backgroundColor:"white", flexDirection:'row', padding:scale(10), gap:scale(20)}]}
                >
                <Divider orientation="vertical" thickness={3} color="#D4D4D4" length={'45%'}>
                <View style={holocardPreviewStyle.column}>
                    <Text style={textStyles.h2}>Card</Text>
                    <Image 
                    source={require('../assets/images/holo/adult.png')}
                    resizeMode="contain"
                    className="grow w-full"
                    style={{height:scale(163), gap:scale(10)}}
                    />
                    <Text numberOfLines={1} className="text-center"  style={textStyles.h2}>{cardName}</Text>
                </View>
                <View style={holocardPreviewStyle.column}>
                    <Text style={textStyles.h2}>Balance</Text>
                    <Text className="grow w-full text-center align-middle"
                        style={textStyles.h1}
                    >${currentBalance/100}</Text>
                    
                </View>
                <View style={holocardPreviewStyle.column}>
                    <Text style={textStyles.h2}>Passes</Text>
                    <Text className="grow w-full text-center align-middle"
                    style={textStyles.h1}>{currentPass}</Text>
                </View>
                </Divider>
            </View>
    )
}

export function HolocardInfo({cardName, cardType, physicalCardId}:HolocardInfoProps){
    const asset = Image.resolveAssetSource(require('../assets/images/holo/adult.png'));
    const ratio = asset.width / asset.height;
    return(
        <View className="self-stretch inline-flex flex-col justify-center items-center gap-2.5">
                <Text style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(60, 0.6)}]} className="text-center justify-start text-white">{cardName}</Text>
                <Image 
                    source={require(getCardImage(cardType))}
                    resizeMode="contain"
                    className="grow w-full"
                    style={{height:scale(163)}}
                    />
                <Text style={[textStyles.h1, textStyles.bold]} className="text-center justify-start text-white">{physicalCardId}</Text>
        </View>
    )
}

export function HolocardBalance({currentBalance, totalSpentMonth, totalSpentToday, autoloadAmount, autoloadDate}:HolocardBalanceProps){
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
            <View className="flex-col px-7 py-5 gap-2.5" style={[cardStyles.card, {backgroundColor:`${Colors.HoloAccentColor}`}]}>
                <Text className="text-white" style={[textStyles.h1]}>Card Balance</Text>
                <Text className="text-white" style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(96, 0.65)}]}>${(currentBalance/100).toFixed(2)}</Text>
                {/**Monthly Pass Progress Component*/}
                <View className="flex-col gap-2">
                    <Text className="text-white" style={[textStyles.h1]}>Month Pass • {today.toLocaleString('default', { month: 'long' })}</Text>
                    {/**Progress Bar Component*/}
                    <View className="flex">
                        <View className="h-2 z-10 absolute rounded-full" style={{backgroundColor:`${Colors.HoloSecondaryColor}`, width:progressCalc({totalAmount: 80, currentAmount:totalSpentMonth})}}></View>
                        <View className="bg-white w-full h-2 absolute rounded-full"></View>
                    </View>
                    {/**Cash Progress Component*/}
                    <View className="flex flex-row justify-between">
                        <Text className="text-white" style={[textStyles.h2]}>${(totalSpentMonth/100).toFixed(2)}</Text>
                        <Text className="text-white" style={[textStyles.h2]}>$80.00</Text>
                    </View>
                </View>
                {/**Daily Pass Progress Component*/}
                <View className="flex-col gap-2">
                    <Text className="text-white" style={[textStyles.h1]}>Daily Pass • {today.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric'} )}</Text>
                    {/**Progress Bar Component*/}
                    <View className="flex">
                        <View className="h-2 z-10 absolute rounded-full" style={{backgroundColor:`${Colors.HoloSecondaryColor}`, width:progressCalc({totalAmount: 7.5, currentAmount:totalSpentToday})}}></View>
                        <View className="bg-white w-full h-2 absolute rounded-full"></View>
                    </View>
                    {/**Cash Progress Component*/}
                    <View className="flex flex-row justify-between">
                        <Text className="text-white" style={[textStyles.h2]}>${(totalSpentToday/100).toFixed(2)}</Text>
                        <Text className="text-white" style={[textStyles.h2]}>$7.50</Text>
                    </View>
                </View>
                { autoloadAmount&&autoloadDate ? (
                    <Text className="text-white opacity-50" style={[textStyles.h1]}>Next Autoload {autoloadDate} ${(autoloadAmount/100).toFixed(2)}</Text>
                ) : null}
                {/**Balance Actions Componenet*/}
                <View className="flex flex-row self-stretch justify-around items-center overflow-hidden">
                    {/**Autoload Action Componenet*/}
                    <View className="flex flex-col justify-center items-center">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <Foundation name="refresh" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text className="text-white" style={[textStyles.h1]}>Autoload</Text>
                    </View>
                    {/**Add Cash Action Componenet*/}
                    <View className="flex flex-col justify-center items-center">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <MaterialCommunityIcons name="cash-plus" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text className="text-white" style={[textStyles.h1]}>Add Cash</Text>
                    </View>
                    {/**Passes Action Componenet*/}
                    <View className="flex flex-col justify-center items-center">
                        <Pressable>
                            <View className="bg-white rounded-[100px] inline-flex flex-col justify-center items-center aspect-square overflow-hidden">
                            <Ionicons name="ticket-outline" size={75} color="black" />
                            </View>
                        </Pressable>
                        <Text className="text-white" style={[textStyles.h1]}>Passes</Text>
                    </View>
                </View>
            </View>
    )
}

export function CardActivitySection({activityBalance, activityCharge, activityName, activityTimestamp, activityType, activityDescription}:HolocardCardActivityProps){
    return(
        <View className="flex flex-col">
                <View className="flex-row justify-between">
                    <Text className="text-white" style={[textStyles.h1, textStyles.bold]}>Card Activity</Text>
                    <Pressable>
                        <Text className="text-white" style={[textStyles.h1]}>See All</Text>
                    </Pressable>
                </View>
                {/**Card Activity Card Component*/}
                <View className="flex flex-row p-2.5 gap-2.5 bg-white" style={[cardStyles.card]}>
                    <FontAwesome6 name="person-walking-luggage" size={50} color="black" />
                    <View className="flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                        <Text style={[textStyles.h1, textStyles.bold]}>{activityName}</Text>
                        <Text style={[textStyles.h3, textStyles.bold]}>{activityTimestamp}</Text>
                    </View>
                    <View className="flex-1 flex-col justify-center items-start gap-2.5">
                        <Text style={[textStyles.h3, textStyles.bold,]}>{activityDescription}</Text>
                    </View>
                    <View className="flex flex-col justify-start items-end gap-2.5">
                        {activityCharge<0?<Text style={[textStyles.h1, {color: "#8F0000"}]}>-${(activityBalance/100).toFixed(2)}</Text>:<Text style={[textStyles.h1, {color: "#058F00"}]}>-${(activityBalance/100).toFixed(2)}</Text>}
                        <Text style={[textStyles.h3, textStyles.bold,]}>Balance: ${(activityBalance/100).toFixed(2)}</Text>
                    </View>
                </View>
            </View>
    )
}
