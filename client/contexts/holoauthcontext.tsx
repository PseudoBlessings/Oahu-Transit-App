import React, {createContext, PropsWithChildren, useState, useRef, useEffect } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import{WebView} from "react-native-webview"
import Ionicons from '@expo/vector-icons/Ionicons';
import * as HolocardAPI from "@/hooks/holocardapi";
export interface HolocardInfo{
    cardId: number
    cardPhyscialID: string
    cardType: string
    cardName: string
    balance: number
    currentPass:string
}

export const HoloContext = createContext<any>(null);

export default function HoloAuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<any>(null);
    const webViewRef = useRef<WebView>(null);
    const [holoAccessGranted, setHoloAccessGranted] = useState<boolean>(true);
    const [cards, setCards] = useState<HolocardInfo[]>([]);

    useEffect(()=>{
        const getAllCards = async () => {
            if (!session) {
                console.log("No session available, skipping card fetch");
                return;
            }
            try{
                console.log("Fetching cards for session:", session ? "present" : "null");
                let cards:HolocardInfo[] = [];
                const [accountsResponse, productsResponses] = await HolocardAPI.getCards(session);
                console.log("Accounts response:", accountsResponse);
                console.log("Products responses:", productsResponses);
                
                accountsResponse.Data.Result.forEach((card, index) => {
                    const products = productsResponses[index];
                    let currentPass = "None";
                    
                    const mappedCard: HolocardInfo = {
                        cardId: card.Id,
                        cardPhyscialID: card.PrintedNumber,
                        cardType: card.CardTypeName,
                        cardName: card.Description,
                        balance: card.Balance,
                        currentPass: currentPass
                    };
                    cards.push(mappedCard);
                });
                console.log("Mapped cards:", cards);
                setCards(cards);
            }catch(error){
                console.error("Error fetching cards:", error);
            }
        };
        getAllCards();
    }, [session])

    return (
        <HoloContext.Provider value={{ session, setSession, holoAccessGranted, setHoloAccessGranted, cards }}>
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
                                        setSession(null);
                                        console.error(error)
                                    })
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