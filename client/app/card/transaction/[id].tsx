import { HoloContext } from "@/contexts/holocontext";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View, Text, Image } from "react-native";
import {textStyles, Colors, cardStyles} from "@/components/style"
import {useFetchTransactionInfo} from "@/hooks/holo/holohooks"
import {HolocardTransactionDetails} from "@/components/holocardcomponets"


export default function TransactionDetails(){
    const { rawId } = useLocalSearchParams(); // transactional id
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const holoContext = useContext(HoloContext);

    const {transactionInfo, loading, error} = useFetchTransactionInfo(id)


    return(
        <View className="flex-1 flex-col gap-3 p-10" style={{backgroundColor: Colors.HoloSecondaryColor}}>
            {
                loading ? <Text style={[textStyles.h1, textStyles.bold]}>Loading</Text>:((transactionInfo && !error) ? <HolocardTransactionDetails holocardTransactionDetails={transactionInfo}/>:
                <Text style={[textStyles.h1, textStyles.bold]}>ERROR</Text>)
            }
        </View>
    )
}