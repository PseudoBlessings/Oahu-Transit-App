import { getCappingPotsbyTransitAccount, getCurrentCustomerAccount, getTransitAccount, GetTransitAccountProducts, CapingPotResult, getAutoloadsByTransitAccountId } from "@/api/holocardapi";
import { HoloAuthContext } from "@/contexts/holoauthcontext";
import { HoloAccountInfo, HolocardAutoloadInfo, HolocardInfo } from "@/types/holo"
import { useContext, useEffect, useState } from "react";

export const useFetchAccount = () => {
    const [account, setAccount] = useState<HoloAccountInfo | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const holoAuth = useContext(HoloAuthContext);

    useEffect(() => {
        const getAccount = async () => {
            if (!holoAuth?.session || !holoAuth.holoAccessGranted) {
                setLoading(false);
                return;
            }

            try {
                const data = await getCurrentCustomerAccount();
                
                const parsedAccountInfo: HoloAccountInfo = {
                    FirstName: data.FirstName,
                    LastName: data.LastName,
                    PhoneNumber: data.PhoneNumber,
                    Email: data.Email
                };
                
                setAccount(parsedAccountInfo);
            } catch (error) {
                console.error("Failed to fetch account:", error);
                setError(true)
            } finally {
                setLoading(false);
            }
        };
        getAccount();
    }, [holoAuth?.session, holoAuth?.holoAccessGranted]);
    return { account, loading, error };
};

export const useFetchCards = () => {
    const [cards, setCards] = useState<HolocardInfo[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const holoAuth = useContext(HoloAuthContext); 

    useEffect(() => {
        const getCards = async () => {
        if (!holoAuth?.session || !holoAuth.holoAccessGranted) {
            setLoading(false);
            return;
        }

        try {
            const transitAccountData = await getTransitAccount(holoAuth.session!);
            const parsedCards: HolocardInfo[] = transitAccountData.Result.map((res: any) => ({
            cardId: res.Id,
            cardPhyscialID: res.PrintedNumber,
            cardName: res.Description,
            cardType: res.CardTypeName,
            balance: res.Balance
            }));

            await Promise.all(parsedCards.map(async (card) => {
                const cappingPotsByTransitAccountData = await getCappingPotsbyTransitAccount(card.cardId, holoAuth.session!)
                card.holocardCappingInfo = cappingPotsByTransitAccountData.Result.map((res: CapingPotResult) => ({
                    Name: res.Name,
                    ValidFrom: res.ValidFrom,
                    ValidTo: res.ValidFrom,
                    Amount: res.Amount,
                    CurrentValue: res.CurrentValue,
                    MissingValue: res.MissingValue,
                    Description: res.Description
                }))
            }))

            cards?.forEach((card) => {
                card.holocardCappingInfo?.sort((a, b) => {
                    const timestampA:number = Date.parse(a.ValidTo);
                    const timestampB:number = Date.parse(b.ValidTo);
                    if(timestampA < timestampB){
                        return -1;
                    }
                    else if(timestampB === timestampA){
                        return 0;
                    }
                    return 1;
                })
            })

            await Promise.all(parsedCards.map(async (card) => {
            const CappingPotsByTransitAccountData = await GetTransitAccountProducts(card.cardId, holoAuth.session!)
            let latestPass:number = 0;
            card.holocardCappingInfo?.forEach((cappingInfo, index) => {
                const timestamp:number = Date.parse(cappingInfo.ValidTo) 
                if(cappingInfo.MissingValue === 0 && timestamp > latestPass){
                    latestPass = timestamp;
                    card.currentPass = cappingInfo.Name
                }
            })
            }));
            setCards([...parsedCards]); 
        } catch (error) {
            console.error("Failed to fetch cards: ", error);
            setError(true)
        } finally {
            setLoading(false);
        }
        };

        getCards();
    }, [holoAuth?.session, holoAuth?.holoAccessGranted]);

    return { cards, loading, error };
};

export const useFetchAutoloads = (transitAccountId:number) => {
    const [autoloadsInfo, setAutoloadsInfo] = useState<HolocardAutoloadInfo[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const holoAuth = useContext(HoloAuthContext); 

    const getAutoloads = useEffect(() => {
        const getAutoloadsInfo = async () => {
            if (!holoAuth?.session || !holoAuth.holoAccessGranted) {
            setLoading(false);
            return;
        }

        try{
            const autoloadsInfo = await getAutoloadsByTransitAccountId(transitAccountId, holoAuth.session!)

            const parsedAutoloadsInfo:HolocardAutoloadInfo[] = autoloadsInfo.map((autoloadInfo) => {
                if(autoloadInfo.PeriodRunDate){
                    return{
                        cardId: transitAccountId,
                        autoloadId: autoloadInfo.Id,
                        autoloadType: "Monthly",
                        autoloadDate: autoloadInfo.PeriodRunDate,
                        autoloadAmount: autoloadInfo.AutoloadValue
                    }
                }else{
                    return{
                        cardId: transitAccountId,
                        autoloadId: autoloadInfo.Id,
                        autoloadType: "Threshold",
                        autoloadThresholdAmount: autoloadInfo.AutoloadThresholdValue,
                        autoloadAmount: autoloadInfo.AutoloadValue
                    }
                }
            })
            setAutoloadsInfo(...[parsedAutoloadsInfo])
        }catch(error){
            console.error("Failed to fetch schedule autoloads: ", error)
            setError(true)
        }finally{
            setLoading(false)
        }
        }
    getAutoloadsInfo();
    },[transitAccountId, holoAuth])
    return {autoloadsInfo, loading, error}
}