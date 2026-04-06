import React, {createContext, PropsWithChildren, useState, useRef, useEffect, ReactNode } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import{WebView} from "react-native-webview"
import Ionicons from '@expo/vector-icons/Ionicons';
import * as HolocardAPI from "@/api/holocardapi";
import HoloProvider, { HoloContext } from "./holocontext";
interface HoloAuthContextValue {
    session: string | undefined;
    setSession: React.Dispatch<React.SetStateAction<string | undefined>>;
    holoAccessGranted: boolean;
    setHoloAccessGranted: React.Dispatch<React.SetStateAction<boolean>>;
    sessionIsValid: boolean;
    setSessionIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HoloAuthContext = createContext<HoloAuthContextValue | undefined>(undefined);

export default function HoloAuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<string|undefined>(undefined);
    const webViewRef = useRef<WebView>(null);
    const [holoAccessGranted, setHoloAccessGranted] = useState<boolean>(true);
    const [sessionIsValid, setSessionIsValid] = useState<boolean>(false);

    useEffect(()=>{
        const sessionExist = async (session:string|undefined) =>{
            if(session && session !== "" && session.includes("__jwt")){
                console.log("Session tokens does exist: " + session)
                return true;
            }else{
                console.log("Session tokens doesn't exist")
                setSessionIsValid(false)
                if (session !== undefined) setSession(undefined)
                return false;
            }
        }
        const checkSessionValidity = async (session:string|undefined) =>{
            if(await sessionExist(session)){
                console.log("Testing session validity")
                try {
                        const isValid = await HolocardAPI.ping(session);
                        
                        if (isValid) {
                            console.log("Session is valid");
                            setSessionIsValid(true);
                            return true;
                        } else {
                            console.log("Session is not valid")
                            setSessionIsValid(false);
                            return false;
                        }
                    } catch (error) {
                        console.error("Ping failed entirely:", error);
                        setSessionIsValid(false); 
                        return false;
                    }
            }else{
                console.log("Session doesn't exist as such not valid")
                setSessionIsValid(false)
                return false
            }
        }
        checkSessionValidity(session)
    },[session])

    return (
        <HoloAuthContext value={{ session, setSession, holoAccessGranted, setHoloAccessGranted, sessionIsValid, setSessionIsValid }}>
            <View>
                <Modal visible={(!session && holoAccessGranted)} animationType="slide" allowSwipeDismissal={true}>
                    <View className="h-12 w-full flex-row items-center justify-end px-4 bg-gray-200">
                        <TouchableOpacity onPress={() => setHoloAccessGranted(false)}>
                            <Ionicons name="exit-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <WebView
                            className="flex-1"
                            ref={webViewRef}
                            source={{ uri: "https://www.holocard.net/en/sign-in/" }}
                            sharedCookiesEnabled={true}
                            thirdPartyCookiesEnabled={true}
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
                                    HolocardAPI.ping(cookies).then((res)=>{
                                        console.log(res)
                                        setSession(cookies)
                                    }).catch((error)=>{
                                        setSession(undefined);
                                        console.error(error)
                                    })
                                }
                            }}
                        />
                    </View>
                </Modal>
            </View>
            <HoloProvider>
            {children}
            </HoloProvider>
        </HoloAuthContext>
    );
}