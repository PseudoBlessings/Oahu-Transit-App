import { Pressable, ScrollView, View, Text } from "react-native";
import { useContext} from 'react'
import { HolocardBalance, HolocardInfo, HolocardActivityPreviewsSection, HolocardActivityPreviews } from "@/components/holocardcomponets";
import { useLocalSearchParams } from 'expo-router';
import {HoloContext} from '@/contexts/holocontext'
import { useFetchAutoloads, useFetchCardHistory } from "@/hooks/holo/holohooks";
import { HolocardAutoloadInfo } from "@/types/holo";
import { Colors, textStyles } from "@/components/style";
import { useRouter } from "expo-router";



export default function Holocard(){

    const router = useRouter();
    const handleSeeAllActivities = (cardId: number) => {
        router.push({
        pathname: "/card/history/[id]",
        params: { id: cardId }
        });
    };

    const { id } = useLocalSearchParams();
    const holoContext = useContext(HoloContext);

const holocard = holoContext?.holocards?.find((card) => {
    if (!id) 
        return false;
    return String(card.cardId) === String(id);
    })

    const today = new Date()

    const {autoloadsInfo, loading:autoloadInfoLoading, error:errorLoadingAutoloadInfo} = useFetchAutoloads(holocard?.cardId ?? 0)
    const {cardHistory, loading:cardHistoryLoading, error:errorLoadingCardHistory} = useFetchCardHistory(holocard?.cardId ?? 0)
    
    return(
        <ScrollView contentContainerStyle={{paddingHorizontal:5, paddingTop:10, paddingBottom:60, gap:15}} style={{backgroundColor:`${Colors.HoloSecondaryColor}`}}>
            <HolocardInfo cardName={holocard?.cardName ?? "Holocard"} cardType={holocard?.cardType ?? ""} physicalCardId={holocard?.cardPhyscialID ?? ""}/>
            <HolocardBalance currentBalance={holocard?.balance ?? 0} currentCaps={holocard?.holocardCappingInfo} autoloadsInfo={autoloadsInfo}/>
            <View className="flex flex-col gap-3">
                <View className="flex-row justify-between">
                    <Text className="text-white" style={[textStyles.h1, textStyles.bold]}>Card Activity</Text>
                    <Pressable key={holocard?.cardId ?? 0} onPress={() => handleSeeAllActivities(holocard?.cardId ?? 0)}>
                        <Text className="text-white" style={[textStyles.h1]}>See All</Text>
                    </Pressable>
                </View>
                <HolocardActivityPreviews holocardActivities={cardHistory?.slice(0,3)}/>
            </View>
        </ScrollView>
    )
} 