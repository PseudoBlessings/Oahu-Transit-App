import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { cardStyles, textStyles, scale } from "./style";
import Divider from "./divider";

export interface HolocardPreviewInterface{
    cardName:string;
    cardType:string;
    currentBalance:number;
    currentPass:string;
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

function getCardImage(cardType:string):string{
    return ""
}


export function HolocardPreview({cardName, cardType, currentBalance, currentPass}:HolocardPreviewInterface){
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
                    >${currentBalance}</Text>
                    
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

export function HolocardInfo(){}

export function HolocardBalance(){}

export function CardActivitySection(){}
