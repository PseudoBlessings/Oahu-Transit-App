import {createContext, PropsWithChildren, useState } from "react";
import { Modal, View } from "react-native";
import{WebView} from "react-native-webview"

export const HoloContext = createContext<any>(null);

export default function HoloAuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<any>(null);

    return (
        <HoloContext.Provider value={{ session, setSession }}>
            <Modal visible={!session} animationType="slide" style={{height: 100, width:100}}>
                <View className="flex-1" style={{flex:1}}>
                    <WebView
                        className="flex-1"
                        style={{flex:1}}
                        source={{ uri: "https://www.holocard.net" }}
                        // onMessage={...} 
                    />
                </View>
            </Modal>
            {children}
        </HoloContext.Provider>
    );
}