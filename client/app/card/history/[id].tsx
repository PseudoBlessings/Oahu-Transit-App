import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { useContext } from "react";
import {textStyles, Colors} from "@/components/style"
import {HoloContext} from '@/contexts/holocontext';
import { useLocalSearchParams } from 'expo-router';
import { useFetchCardHistory } from "@/hooks/holo/holohooks";
import { HolocardActivity, HolocardActivityPreview } from "@/components/holocardcomponets";
import { Transaction } from "@/types/holo";

// Implement date header, adding a header for a group of transaction. Example: 
/**Today
 * Transaction #1
 * Transcation #2
 * Yesterday
 * Transaction #3
 * 01/01/2001
 * Transaction#4
 */
// function dateHeader(cardHistory:Transaction[]){
    
// }

export default function CardActivities(){
    const { id } = useLocalSearchParams();
    const holoContext = useContext(HoloContext);

    const holocard = holoContext?.holocards?.find((card) => {
    if (!id) 
        return false;
    return String(card.cardId) === String(id);
    })

    const {cardHistory, loading:cardHistoryLoading, error:errorLoadingCardHistory} = useFetchCardHistory(holocard?.cardId ?? 0)
    
    return(
    <View className="flex-1 relative pt-2 px-10" style={{backgroundColor: Colors.HoloSecondaryColor}}>
        {/**Card Info Section**/}
        <View>
            <Text className="text-center color-white" style={[textStyles.h1, textStyles.bold]}> {holocard?.cardName} - Activities </Text>
            <Text className="text-center color-white" style={[textStyles.h2, textStyles.bold]}> {holocard?.cardPhyscialID} </Text>
        </View>
        {/**Card Filter Section**/}
        {/* <View className="flex-row">
            <Text className="text-start color-white" style={[textStyles.h2, textStyles.bold]}>Filters:</Text>
        </View> */}
        {/**Card Activities History*/}
        <FlatList
            className="flex flex-col g-3" 
            data={cardHistory}
            renderItem={({item}) => /**
                * TODO
                * Implement Pressable button and link the item transactionId to it.
                */     
            <HolocardActivityPreview holocardActivity={item}/>}
            keyExtractor={item => item.transactionId}/>
    </View>
    )
}