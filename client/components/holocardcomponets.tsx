import { useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, DimensionValue } from "react-native";
import { cardStyles, textStyles, scale, moderateScale, Colors } from "./style";
import Divider from "./divider";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { HolocardAutoloadInfo, HolocardCappingInfo, Transaction } from "@/types/holo";

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

export interface HolocardCappingProps{
    passName: string; 
    totalSpent: number; 
    totalNeeded:number; 
    ValidTo:string //ISO Format;
}

export interface HolocardBalanceProps{
    currentBalance: number;
    currentCaps?: HolocardCappingInfo[];
    autoloadsInfo?: HolocardAutoloadInfo[];
}

export interface HolocardCardActivityProps{
    holocardCardActivities?:Transaction[]
}

export interface HolocardCardActivityTransactionProps{
    holocardActivityTransaction:Transaction
}
export interface HolocardCardActivityMainInfoProps{
    holocardActivityTransaction:Transaction
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


function getCardImage(cardType?: string): any {
    switch (cardType) {
        case "Adult Card":
            return require("../assets/images/holo/adult.png");
        default:
            return require("../assets/images/holo/adult.png");
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
                    >${(currentBalance/100).toFixed(2)}</Text>
                    
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
    const imageSource = getCardImage(cardType);
    return(
        <View className="self-stretch inline-flex flex-col justify-center items-center gap-2.5">
                <Text style={[textStyles.h1, textStyles.bold, {fontSize:moderateScale(60, 0.6)}]} className="text-center justify-start text-white">{cardName}</Text>
                <Image 
                    source={imageSource}
                    resizeMode="contain"
                    className="grow w-full"
                    />
                <Text style={[textStyles.h1, textStyles.bold]} className="text-center justify-start text-white">{physicalCardId}</Text>
        </View>
    )
}

function HolocardCapping({passName, totalSpent, totalNeeded, ValidTo}:HolocardCappingProps){
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
        <View className="flex-col gap-2">
            <Text className="text-white" style={[textStyles.h1]}>{passName} Pass • {new Date(ValidTo).toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric'} )}</Text>
            {/**Progress Bar Component*/}
            <View className="flex">
                <View className="h-2 z-10 absolute rounded-full" style={{backgroundColor:`${Colors.HoloSecondaryColor}`, width:progressCalc({totalAmount: totalNeeded, currentAmount: totalSpent})}}></View>
                <View className="bg-white w-full h-2 absolute rounded-full"></View>
            </View>
            {/**Cash Progress Component*/}
            <View className="flex flex-row justify-between">
                <Text className="text-white" style={[textStyles.h2]}>${(totalSpent/100).toFixed(2)}</Text>
                <Text className="text-white" style={[textStyles.h2]}>${(totalNeeded/100).toFixed(2)}</Text>
            </View>
        </View>
    )
}

export function HolocardBalance({currentBalance, currentCaps, autoloadsInfo}:HolocardBalanceProps){
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
                {currentCaps?.map((currentCap, index)=>(
                    <HolocardCapping key={index} passName={currentCap.Name} totalNeeded={currentCap.Amount} totalSpent={currentCap.CurrentValue} ValidTo={currentCap.ValidTo}/>
                ))}
                
                {
                    autoloadsInfo?.map((autoloadInfo, index) => {
                        if(autoloadInfo.autoloadType === "Monthly"){
                            return <Text key={index} className="text-white opacity-50" style={[textStyles.h1]}> {autoloadInfo.autoloadType} Autoload: {new Date(autoloadInfo.autoloadDate ?? "").toLocaleString('default', { day: '2-digit', month: 'long'} )} ${(autoloadInfo.autoloadAmount/100).toFixed(2)}</Text>
                        }else{
                            return <Text key={index} className="text-white opacity-50" style={[textStyles.h1]}> {autoloadInfo.autoloadType} Autoload: Loads ${(autoloadInfo.autoloadAmount/100).toFixed(2)} when below ${((autoloadInfo.autoloadThresholdAmount ?? 0)/100).toFixed(2)} </Text>
                        }
                    })
                }
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

export function HolocardCardActivity({ holocardCardActivities }: HolocardCardActivityProps){
    return(
        <View className="flex flex-col gap-3">
                <View className="flex-row justify-between">
                    <Text className="text-white" style={[textStyles.h1, textStyles.bold]}>Card Activity</Text>
                    <Pressable>
                        <Text className="text-white" style={[textStyles.h1]}>See All</Text>
                    </Pressable>
                </View>
                {/**Card Activity Card Component*/} 
                {holocardCardActivities?.map((holocardCardActivity, index)=> {
                    const credit = "credit" in holocardCardActivity ? holocardCardActivity.credit : 0;
                    const balance = "balance" in holocardCardActivity ? holocardCardActivity.balance : 0;
                    return(
                    <View key={index} className="flex flex-row p-2.5 gap-2.5 bg-white" style={[cardStyles.card]}>
                        <HolocardCardActivityIcon holocardActivityTransaction={holocardCardActivity}/>
                        <View className="flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <HolocardCardActivityMainInfo holocardActivityTransaction={holocardCardActivity}/>
                        </View>
                        <View className="flex-1 flex-col justify-center items-start gap-0.5">
                            <HolocardCardActivityDescription holocardActivityTransaction={holocardCardActivity}/>
                        </View>
                        <View className="flex flex-col justify-start items-end gap-2.5">
                            {credit<0?<Text style={[textStyles.h1, {color: "#8F0000"}]}>-${((credit*-1)/100).toFixed(2)}</Text>:<Text style={[textStyles.h1, {color: "#058F00"}]}>+${(credit/100).toFixed(2)}</Text>}
                            <Text style={[textStyles.h3, textStyles.bold,]}>Balance: ${(balance/100).toFixed(2)}</Text>
                        </View>
                    </View>
                    )
                })}
            </View>
    )
}

function HolocardCardActivityIcon({holocardActivityTransaction}:HolocardCardActivityMainInfoProps){
    switch(holocardActivityTransaction.transactionType){
        case "Boarding":
            return <FontAwesome6 name="person-walking-luggage" size={50} color="black" />
        case "Transfer":
            return <MaterialCommunityIcons name="bus-multiple" size={24} color="black" />
        case "Load":
            return <Fontisto name="bus-ticket" size={50} color="black" />
        case "Charge":
            return <MaterialCommunityIcons name="cash-plus" size={50} color="black" />
        case "Use":
            return <FontAwesome6 name="person-walking-luggage" size={50} color="black" />
        case "FareMediaSale":
            return <MaterialIcons name="add-card" size={50} color="black" />
        case "83":
    }
}

function HolocardCardActivityMainInfo({holocardActivityTransaction}:HolocardCardActivityMainInfoProps){
    
    let BaseRender = ({transactionTitle}:{transactionTitle: string;}) => (<>
        <Text style={[textStyles.h1, textStyles.bold]}>{transactionTitle}</Text>
        <Text style={[textStyles.h3, textStyles.bold]}>{new Date(holocardActivityTransaction.timestamp).toLocaleString('default', {dateStyle:"short", timeStyle:"medium"})}</Text>
    </>)

    switch(holocardActivityTransaction.transactionType){
        case "Boarding":
            return(
                <BaseRender transactionTitle={holocardActivityTransaction.transactionType}/>
            )
        case "Transfer":
            return(
                <BaseRender transactionTitle={holocardActivityTransaction.transactionType}/>
            )
        case "Load":
            return(
                <BaseRender transactionTitle="Added Pass"/>
            )
        case "Charge":
            return(
                <BaseRender transactionTitle="Reload"/>
            )
        case "Use":
            return(
                <BaseRender transactionTitle="Used Pass"/>
            )
        case "FareMediaSale":
            return(
                <BaseRender transactionTitle="Purchased Card"/>
            )
        case "83":
            return
    }
}

function HolocardCardActivityDescription({holocardActivityTransaction}:HolocardCardActivityTransactionProps){

    const BaseRender = ({transactionDescription}:{transactionDescription:string;}) =>(
        <Text numberOfLines={3} ellipsizeMode="tail" style={[textStyles.h3, textStyles.bold]}>
                {transactionDescription}
        </Text>
    )

    switch(holocardActivityTransaction.transactionType){
        case "Boarding":
            return(<BaseRender transactionDescription={`${holocardActivityTransaction.lineName} 
Stop: ${holocardActivityTransaction.stopName}`}/>)
        case "Transfer":
            return(<BaseRender transactionDescription={`${holocardActivityTransaction.lineName} 
Stop: ${holocardActivityTransaction.stopName}`}/>)
        case "Load":
            return(<BaseRender transactionDescription={`Loaded: ${holocardActivityTransaction.trasactionName} 
Valid to: ${new Date(holocardActivityTransaction.validTo ?? "").toLocaleString('default', {dateStyle:'short', timeStyle:'long'})}`}/>)
        case "Charge":
            return
        case "Use":
            return(<BaseRender transactionDescription={`Used the ${holocardActivityTransaction.trasactionName} Pass 
${holocardActivityTransaction.lineName} 
Stop: ${holocardActivityTransaction.stopName} 
Valid to: ${new Date(holocardActivityTransaction.validTo ?? "").toLocaleString('default', {dateStyle:'short', timeStyle:'long'})}`}/>)
        case "FareMediaSale":
            return(
                <BaseRender transactionDescription={`Bought ${holocardActivityTransaction.trasactionName}`}/>
            )
        case "83":
            return
    }
}
