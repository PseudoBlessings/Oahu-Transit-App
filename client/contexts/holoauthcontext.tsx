import {createContext, PropsWithChildren, useState } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import{WebView} from "react-native-webview"

export const HoloContext = createContext<any>(null);

export default function HoloAuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<any>(null);

    return (
        <HoloContext.Provider value={{ session, setSession }}>
            <View>
                <Modal visible={!session} animationType="slide">
                    <View className="h-12 w-full flex-row items-center justify-end px-4 bg-gray-200">
                        <TouchableOpacity onPress={() => setSession({})}>
                            <Text className="text-lg font-bold">✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <WebView
                            className="flex-1"
                            source={{ uri: "https://www.holocard.net" }}
                            // onMessage={...} 
                        />
                    </View>
                </Modal>
            </View>
            {children}
        </HoloContext.Provider>
    );
}