import { useContext } from "react";
import { Text, View } from "react-native";
import { HoloContext } from "@/contexts/holoauthcontext";
import HoloPocket, {HoloPocketProps} from "./holopocket";
import type {HolocardPreviewProps} from "@/components/holocardcomponets"
import Holocard from "./holocard";

const DummyHoloCardPreview:HolocardPreviewProps[] = [{cardName: "Z's Card", cardType: "Adult", currentBalance: 1000, currentPass:""}, {cardName: "WEwooo Card", cardType: "Adult", currentBalance: 1050, currentPass:""}]


export default function Index() {
  const { session, setSession, holoAccessGranted, cards } = useContext(HoloContext)
  return (
    <View
      className="flex-1"
    >
      <Holocard/>
    </View>
  );
}
