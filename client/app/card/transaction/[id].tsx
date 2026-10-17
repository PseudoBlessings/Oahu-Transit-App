import { HoloContext } from "@/contexts/holocontext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View, Text, Image } from "react-native";
import {textStyles, Colors, cardStyles} from "@/components/style"
import {useFetchTransactionInfo} from "@/hooks/holo/holohooks"
import {HolocardTransactionDetails} from "@/components/holocardcomponets"
import { Transaction } from "@/types/holo";


export default function TransactionDetails(){
    const { id} = useLocalSearchParams<{ id: string }>();
    const {cardActivityDetailsString} = useLocalSearchParams<{cardActivityDetailsString:string}>()
    const transactionId = Array.isArray(id) ? id[0] : id;
    const cardActivityDetails = JSON.parse(cardActivityDetailsString) as Transaction

    const {transactionInfo, loading, error} = useFetchTransactionInfo(transactionId)


    return(
        <View className="flex-1 flex-col gap-3 p-10" style={{backgroundColor: Colors.HoloSecondaryColor}}>
            {
                loading ? <Text style={[textStyles.h1, textStyles.bold]}>Loading</Text>:(((transactionInfo && !error) || cardActivityDetails) ? <HolocardTransactionDetails holocardTransactionDetails={transactionInfo} holocardActivityTransaction={cardActivityDetails}/>:
                <Text style={[textStyles.h1, textStyles.bold]}>ERROR</Text>)
            }
        </View>
    )
}