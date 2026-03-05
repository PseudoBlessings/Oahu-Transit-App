import React, {createContext, PropsWithChildren, useState, useRef } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import{WebView} from "react-native-webview"
import Ionicons from '@expo/vector-icons/Ionicons';

export const HoloContext = createContext<any>(null);

export default function HoloAuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<any>(null);
    const webViewRef = useRef<WebView>(null);

    return (
        <HoloContext.Provider value={{ session, setSession }}>
            <View>
                <Modal visible={!session} animationType="slide" allowSwipeDismissal={true}>
                    <View className="h-12 w-full flex-row items-center justify-end px-4 bg-gray-200">
                        <TouchableOpacity onPress={() => setSession({})}>
                            <Ionicons name="exit-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <WebView
                            className="flex-1"
                            ref={webViewRef}
                            source={{ uri: "https://www.holocard.net/en/sign-in/" }}
                            onLoad={(event)=>{
                                webViewRef.current?.injectJavaScript(`
                                        window.ReactNativeWebView.postMessage(document.cookie);
                                        true;`
                                    )
                            }}
                            onNavigationStateChange={(NavState)=>{
                                const url:string = NavState.url
                                if(url.includes("/customeraccount/my-cards/")){
                                    webViewRef.current?.injectJavaScript(`
                                        window.ReactNativeWebView.postMessage(document.cookie);
                                        true;`
                                    )
                                }
                                else if(!(url.includes("/sign-in/") || url.includes("/customeraccount/security-challenge"))){
                                    webViewRef.current?.stopLoading()
                                    const Login = 'https://www.holocard.net/en/sign-in/';
                                    const redirectTo = 'window.location = "' + Login + '"';
                                    webViewRef.current?.injectJavaScript(redirectTo);
                                }
                            }}
                            onMessage={(event)=>{
                                const cookies:string = event.nativeEvent.data
                                console.log("Captured Cookie:", event.nativeEvent.data);
                                if(cookies.includes("__jwt")){
                                    setSession(event.nativeEvent.data);
                                }
                            }}
                        />
                    </View>
                </Modal>
            </View>
            {children}
        </HoloContext.Provider>
    );
}