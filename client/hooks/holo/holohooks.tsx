import { getCappingPotsbyTransitAccount, getCurrentCustomerAccount, getTransitAccount, GetTransitAccountProducts } from "@/api/holocardapi";
import { HoloAuthContext } from "@/contexts/holoauthcontext";
import { HoloAccountInfo, HolocardInfo } from "@/types/holo"
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
            balance: res.Balance,
            currentPass: ""
            }));

            await Promise.all(parsedCards.map(async (card) => {
            const [productData, cappingData] = await Promise.all([
                GetTransitAccountProducts(card.cardId, holoAuth.session!),
                getCappingPotsbyTransitAccount(card.cardId, holoAuth.session!)
            ]);

            productData.Purse.forEach((purse) => {
                card.currentPass = purse.Description;
            });

            cappingData.Result.forEach((cap) => {
                if (cap.MissingValue === 0) {
                card.currentPass = cap.Description === "1Mo" ? "Month Pass" : "Day Pass";
                }
            });
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