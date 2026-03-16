import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { cardStyles, textStyles, scale, moderateScale } from "./style";
import Divider from "./divider";

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
    {/**Holocard Info*/}
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
}

export function HolocardBalance(){}

export function CardActivitySection(){}
