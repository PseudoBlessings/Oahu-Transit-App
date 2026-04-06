import { useContext } from "react";
import { Text, View } from "react-native";
import type {HolocardPreviewProps} from "@/components/holocardcomponets"
import Holocard from "./holocard";
import HoloPocket from "./holopocket";

const DummyHoloCardPreview:HolocardPreviewProps[] = [{cardName: "Z's Card", cardType: "Adult", currentBalance: 1000, currentPass:""}, {cardName: "WEwooo Card", cardType: "Adult", currentBalance: 1050, currentPass:""}]


export default function Index() {
  return (
    <View
      className="flex-1"
    >
      <HoloPocket/>
    </View>
  );
}
