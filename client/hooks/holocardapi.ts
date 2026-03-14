
export async function ping(cookies?: string):Promise<number>{
    let response;
    try{
        if(cookies && cookies.trim().length > 0){
            response = await fetch("https://www.holocard.net/umbraco/Api/SessionApi/Ping", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": cookies,
                    "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
                },
                "body": null,
                "method": "GET"
                });
        }else{
            response = await fetch("https://www.holocard.net/umbraco/Api/SessionApi/Ping", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.holocard.net/en/customeraccount/my-cards/",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
            });
        }
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const pingTime = await response.json();
        if(pingTime === 0){
            throw new Error(`Ping time is too short: ${pingTime} ms`);
        }

        return pingTime
    }catch(error){
        console.error("Error pinning server info:", error);
        throw error; 
    }
}


export async function getAccountInfo(cookies: string) {
    try {
        const response = await fetch("https://www.holocard.net/umbraco/api/CustomerAccountApi/GetCurrentCustomerAccount", {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en",
                "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookies,
                "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
            },
            body: null,
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching account info:", error);
        throw error; 
    }

    // returns a json formated as:
    // {
    //     "Success": boolean,
    //     "Messages": [],
    //     "ErrorsByField": {},
    //     "Data": {
    //         "Id": number,
    //         "UserName": string,
    //         "FirstName": string,
    //         "LastName": string,
    //         "PhoneNumber": string,
    //         "PhonePin": string,
    //         "DateOfBirth": string,
    //         "Email": string,
    //         "CellPhoneNumber": string,
    //         "FaxNumber": string,
    //         "Gender": number,
    //         "ShippingAddressId": number,
    //         "InvoiceAddressId": number,
    //         "State": number,
    //         "LastPasswordChange": string,
    //         "IsPasswordTemporary": boolean,
    //         "IsEmailConfirmed": boolean,
    //         "CustomerLanguageId": null,
    //         "CustomerAccountRoleId": null,
    //         "IsVerificationLockout": boolean,
    //         "LockoutUntil": string,
    //         "VanpoolGroupId": string,
    //         "VanpoolOperatorId": null
    //     }
    // }
}

interface GetTransitAccountsResult {
    Id: number; // This is the card's online ID number
    Description: string; // This is the card's name
    FareCategory: number;
    FareCategoryExpiry: null;
    FareMediaId: string;
    PrintedNumber: string; // This is the card's physical ID number
    CardTypeName: string;
    FareMediaType: number;
    State: number;
    BlockingReason: number;
    IsIssued: boolean;
    Balance: number; // This is the card's balance
    PreTaxBalance: number;
    CardholderId: null;
    CustomerAccountId: number;
    InstitutionAccountId: null;
    InstitutionAccountIds: any[];
    Participants: any[];
    ExpirationDate: string;
    FareMediaTypeExternalIdentifier: number;
    ParticipantId: null;
    BlockDate: null;
    HasVirtualCard: boolean;
    PrimaryAccountId: null;
    AssociationType: number;
    ReplacedTransitAccountId: null;
    OrderDetailId: null;
    ReplacedTransitAccountPrintedCardNumber: null;
    AssociationDescription: null;
    PaymentAccountReference: null;
    ParticipantIdentifier: null;
    ParticipantFirstName: null;
    ParticipantLastName: null;
}

interface GetTransitAccountsData {
    Result: GetTransitAccountsResult[];
    TotalCount: number;
}

export interface GetTransitAccountsResponse {
    Data: GetTransitAccountsData;
    ErrorsByField: Record<string, any>;
    Messages: string[];
    Success: boolean;
}

export interface GetTransitAccountProductsPurse{
    Id: number;
    Name: string;
    Description: string;
    Type: number;
    Price: number;
    IsActive: boolean;
    ValidFrom: string;
    ValidTo: string;
    RemainingValue: number;
    RefundValue: number;
    IsPreTax: boolean;
    ExternalIdentifier: number;
    ActivateUntil: null;
    NumberOfTrips: null;
    AccountId: number;
    GroupSize: null;
}

export interface GetTransitAccountProductsData{
    Passes: [];
    Purse: GetTransitAccountProductsPurse[];
    PreTaxPurse: [];
}

export interface GetTransitAccountProductsResponse{
    Data: GetTransitAccountProductsData;
    ErrorsByField: Record<string, any>;
    Messages: string[];
    Success: boolean;
}
export async function getCards(cookies?: string):Promise<readonly [GetTransitAccountsResponse, GetTransitAccountProductsResponse[]]>{
    try{
        let getTransitAccountsResponse: Response;
        const getTransitAccountProductsResponses: GetTransitAccountProductsResponse[] = [];
        
        if(cookies && cookies.trim().length > 0){
            getTransitAccountsResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransitAccounts", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en",
                    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": cookies,
                    "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
                },
                "body": null,
                "method": "POST"
            });
        } else {
            getTransitAccountsResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransitAccounts", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en",
                    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.holocard.net/en/customeraccount/my-cards/",
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }
        if (!getTransitAccountsResponse.ok) {
            throw new Error(`HTTP error status: ${getTransitAccountsResponse.status}`);
        }

        const transitAccountsData: GetTransitAccountsResponse = await getTransitAccountsResponse.json();
        console.log(transitAccountsData)

        if(cookies && cookies.trim().length > 0){
            for (const transitAccountResult of transitAccountsData.Data.Result) {
                const response = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransitAccountProducts", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": cookies,
                },
                "body": `TransitAccountId=${transitAccountResult.Id}`,
                "method": "POST"
                });
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                const getTransitAccountProductsData: GetTransitAccountProductsResponse = await response.json();
                getTransitAccountProductsResponses.push(getTransitAccountProductsData);
            }
        } else {
            for (const transitAccountResult of transitAccountsData.Data.Result) {
            const response = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransitAccountProducts", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.holocard.net/en/customeraccount/my-cards/",
                "body": `TransitAccountId=${transitAccountResult.Id}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
                });
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const getTransitAccountProductsData: GetTransitAccountProductsResponse = await response.json();
            getTransitAccountProductsResponses.push(getTransitAccountProductsData);
        }
        }

        const cardData:readonly [GetTransitAccountsResponse, GetTransitAccountProductsResponse[]] = [transitAccountsData,getTransitAccountProductsResponses]
        console.log(cardData)
        return (cardData)

    } catch (error) {
        console.error("Error fetching card info:", error);
        throw error; 
    }


    // returns a tuple formatted as:
    // [
    //     GetTransitAccountsResponse,  // Transit accounts data
    //     GetTransitAccountProductsResponse[]  // Array of products for each account
    // ]
    // Where GetTransitAccountsResponse has the structure:
    // {
    //     "Success": boolean,
    //     "Messages": [],
    //     "ErrorsByField": {},
    //     "Data": {
    //         "Result": [
    //             {
    //                 "Id": number, (This is the card's online ID number)
    //                 "Description": string, (This is the card's name)
    //                 "FareCategory": number,
    //                 "FareCategoryExpiry": null,
    //                 "FareMediaId": string,
    //                 "PrintedNumber": string, (This is the card's physical ID number)
    //                 "CardTypeName": string,
    //                 "FareMediaType": number,
    //                 "State": number,
    //                 "BlockingReason": number,
    //                 "IsIssued": boolean,
    //                 "Balance": number, (This is the card's balance)
    //                 "PreTaxBalance": number,
    //                 "CardholderId": null,
    //                 "CustomerAccountId": number,
    //                 "InstitutionAccountId": null,
    //                 "InstitutionAccountIds": [],
    //                 "Participants": [],
    //                 "ExpirationDate": string,
    //                 "FareMediaTypeExternalIdentifier": number,
    //                 "ParticipantId": null,
    //                 "BlockDate": null,
    //                 "HasVirtualCard": boolean,
    //                 "PrimaryAccountId": null,
    //                 "AssociationType": number,
    //                 "ReplacedTransitAccountId": null,
    //                 "OrderDetailId": null,
    //                 "ReplacedTransitAccountPrintedCardNumber": null,
    //                 "AssociationDescription": null,
    //                 "PaymentAccountReference": null,
    //                 "ParticipantIdentifier": null,
    //                 "ParticipantFirstName": null,
    //                 "ParticipantLastName": null
    //             }
    //         ],
    //         "TotalCount": number
    //     }
    // }
    // And GetTransitAccountProductsResponse has the structure:
    // {
    //     "Success": boolean,
    //     "Messages": [],
    //     "ErrorsByField": {},
    //     "Data": {
    //         "Passes": [],
    //         "Purse": [
    //             {
    //                 "Id": number,
    //                 "Name": string,
    //                 "Description": string,
    //                 "Type": number,
    //                 "Price": number,
    //                 "IsActive": boolean,
    //                 "ValidFrom": string,
    //                 "ValidTo": string,
    //                 "RemainingValue": number,
    //                 "RefundValue": number,
    //                 "IsPreTax": boolean,
    //                 "ExternalIdentifier": number,
    //                 "ActivateUntil": null,
    //                 "NumberOfTrips": null,
    //                 "AccountId": number,
    //                 "GroupSize": null
    //             }
    //         ],
    //         "PreTaxPurse": []
    //     }
    // }
}