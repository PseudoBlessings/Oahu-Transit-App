import { useContext } from "react";
import { Text, View } from "react-native";
import { HoloContext } from "@/contexts/holoauthcontext";

export default function Index() {
  const { session, setSession } = useContext(HoloContext)
  return (
    <View
      className="flex-1 justify-center items-center"
    >
      <Text>Here is the session:</Text>
      <Text>{JSON.stringify(session)}</Text>
    </View>
  );
}
