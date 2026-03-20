export interface APIResponse<APIResponseDataType>{
    Data: APIResponseDataType;
    ErrorsByField: Record<string, any>;
    Messages: string[];
    Success: boolean;
}

async function apiRequest<APIResponseDataType, HTTPBodyType = any>(endpoint: string, httpMethod:"GET"|"POST", cookies?: string, body?:HTTPBodyType){
    const hasCookies = cookies && cookies.trim().length > 0;
    let response:Response;
    try{
        response = await fetch(`https://www.holocard.net/umbraco/${endpoint}`, {
            "headers": {
                ...(body ? {"accept": "application/json, text/javascript, */*; q=0.01"}  : {"accept": "*/*"}),
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                ...(cookies ? { "cookie": cookies } : {}),
                "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
            },
            body: body ? JSON.stringify(body) : null,
            "method": `${httpMethod}`,
            ...(cookies ? {} : {"mode": "cors"}),
            ...(cookies ? {} : {"credentials": "include"})
            });

        if(!response.ok){
            throw new Error("HTTP Error: " + response.status + " Endpoint: " + endpoint)
        }

        const data:APIResponse<APIResponseDataType> = await response.json()

        if (data.Messages[1] === "invalid session"){
            throw new Error("Session/Cookies are invalid, please get new ones");
        }

        return data.Data
    }catch(error){
        console.error("Endpoint: " + endpoint + " failed to " + httpMethod + " | Error Message: " + error )
        throw error
    }
}


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

/******************************** API Call GetCurrentCustomerAccount ********************************/


interface CurrentCustomerAccountData {
    Id: number;
    UserName: string;
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    PhonePin: string;
    DateOfBirth: string; //ISO format
    Email: string;
    CellPhoneNumber: string;
    FaxNumber: string;
    Gender: number;
    ShippingAddressId: number;
    InvoiceAddressId: number;
    State: number;
    LastPasswordChange: string;
    IsPasswordTemporary: boolean;
    IsEmailConfirmed: boolean;
    CustomerLanguageId: any | null; 
    CustomerAccountRoleId: any | null;
    IsVerificationLockout: boolean;
    LockoutUntil: string;
    VanpoolGroupId: string;
    VanpoolOperatorId: any | null;
}

export async function getCurrentCustomerAccount(cookies: string) {
        return apiRequest<CurrentCustomerAccountData>("api/CustomerAccountApi/GetCurrentCustomerAccount", "GET", cookies)
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

export async function getTransitAccount(cookies?:string){
    return apiRequest<GetTransitAccountsData>("Api/CustomerAccountApi/GetTransitAccounts", "POST", cookies)
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

export interface GetTransitAccountProductsBody{
    Id:number;
}

export async function GetTransitAccountProducts<GetTransitAccountProductsData, GetTransitAccountProductsBody>(transitAccountId:number, cookies?:string){
    return apiRequest("Api/CustomerAccountApi/GetTransitAccountProducts", "POST", cookies, `TransitAccountId=${transitAccountId}`)
}


export interface Transaction {
    AppliedCapping: any | null;
    DeviceNumber: number;
    LineName: string;
    LineNumber: number;
    NumberOfPersons: number;
    OperatorId: number;
    PurseBalance: number;
    PurseBalancePreTax: number | null;
    PurseCredit: number;
    PurseCreditPreTax: number | null;
    Result: string;
    ResultId: number;
    SalesChannelId: number;
    SalesChannel: string | null;
    StopName: string;
    StopNumber: number;
    TicketExternalNumber: number;
    TicketName: string;
    Timestamp: string; // ISO 8601 Date string
    TransactionId: string;
    TransactionType: string;
    TransactionTypeId: number;
    ValidFrom: string;  // ISO 8601 Date string
    ValidTo: string;    // ISO 8601 Date string
    VehicleNumber: number;
}

export interface GetTransactionHistoryData {
    Transaction: Transaction;
    RetailLocation: any | null;
}

export interface GetTransactionHistoryResponse {
    Success: boolean;
    Messages: string[];
    ErrorsByField: Record<string, string[]>;
    Data: GetTransactionHistoryData[];
}


export interface CapingPotResult {
    PotId: number;
    Name: string;
    ValidFrom: string; // ISO 8601 Date string
    ValidTo: string;   // ISO 8601 Date string
    Amount: number;
    CurrentValue: number;
    MissingValue: number;
    Description: string;
}

export interface GetCappingPotsByTransitAccountData {
    Result: CapingPotResult[];
    TotalCount: number;
}

export interface GetCappingPotsByTransitAccountResponse {
    Success: boolean;
    Messages: string[];
    ErrorsByField: Record<string, any>;
    Data: GetCappingPotsByTransitAccountData;
}

export async function getSpecificCardInfo(transitAccountId: number, cookies?: string):Promise<readonly [GetTransactionHistoryResponse,GetCappingPotsByTransitAccountResponse]>{
    let getCappingPotsByTransitAccountData:GetCappingPotsByTransitAccountResponse
    let getTransactionHistoryData:GetTransactionHistoryResponse;
    try{
        if(cookies && cookies.trim().length > 0){
            const getTransactionHistoryResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransactionHistory", {
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
                "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
            },
            "body": `TransitAccountId=${transitAccountId}&Take=50`,
            "method": "POST"
            });
            getTransactionHistoryData  = await getTransactionHistoryResponse.json()
            if(getTransactionHistoryData.Messages[1] = "invalid session"){
                throw new Error("invalid session");
            }
            console.log(getTransactionHistoryData)
            
        }else{
            const getTransactionHistoryResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetTransactionHistory", {
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
                    "body": "TransitAccountId=3576078&Take=50",
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    });
            getTransactionHistoryData  = await getTransactionHistoryResponse.json()
            if(getTransactionHistoryData.Messages[1] = "invalid session"){
                throw new Error("invalid session");
            }
            console.log(getTransactionHistoryData)
        }
    }catch(error){
        console.error(`Error fetching transaction history of account #${transitAccountId} error:`, error);
        throw error;
    }

    try{
        if(cookies && cookies.trim().length > 0){
            const getCappingPotsByTransitAccountResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetCappingPotsByTransitAccount", {
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
                    "cookie": "_ga=GA1.1.713995643.1769149985; .AspNetCore.Antiforgery.1PT5AqCGLRE=CfDJ8NfMm-Hhw9JBnr4ewCvVEjK9olUMmgclGhBNqCc3ansRecbdIFREHtOX5akY7fc_12CtuQhzD0vpneF6sDmXh834Wl_X1HKq2qwPvKt7yft_yW1p9dM_hYQg7AFVcuE9DJPmyseeoDxus6CbauFV0mc; BIGipServerprod-www.app~prod-www_pool=861692938.20480.0000; _ga_XHF2XRCXBB=GS2.1.s1773713625$o34$g1$t1773713703$j60$l0$h0; __jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6ImVGYXJlV2ViUG9ydGFsSG9sbyIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW5pc3RyYXRvciIsInVzZXJUeXBlIjoiQ3VzdG9tZXIiLCJuYW1lIjoiWnZpa29tYm9yZXJvIE1hc2lrZSIsImN1c3RvbWVyQWNjb3VudElkIjoiMTIxNDEzNCIsImVtYWlsQWRkcmVzcyI6InptYXNpa2VAZ21haWwuY29tIiwic3RhdGUiOiJBQ1RJVkUiLCJ1c2VybmFtZSI6InptYXNpa2VAZ21haWwuY29tIiwiY2hhbCI6ImZhbHNlIiwicGFzc3dvcmRGb3JjZVVwZGF0ZSI6ImZhbHNlIiwiZGF5c0JlZm9yZUV4cGlyYXRpb24iOiIwIiwicmVxdWVzdFBhc3N3b3JkUmVzZXQiOiJmYWxzZSIsImFjY291bnRWZXJpZmljYXRpb24iOiJmYWxzZSIsInJlcXVlc3RQYXNzd29yZFNldCI6ImZhbHNlIiwidWlkIjoiMTM1YjdlOTEtNjk1ZS00MGE3LTk1ZTgtODJmNDk4ODRjMDg5IiwibmJmIjoxNzczNzE0OTE1LCJleHAiOjE3NzM3MTU4MTUsImlhdCI6MTc3MzcxNDkxNSwiaXNzIjoiaHR0cHM6Ly93d3cuaG9sb2NhcmQubmV0LyIsImF1ZCI6WyJodHRwczovL3d3dy5ob2xvY2FyZC5uZXQvIiwiaHR0cHM6Ly93d3cuaG9sb2NhcmQubmV0LyIsImh0dHBzOi8vd3d3LmhvbG9jYXJkLm5ldC8iLCJodHRwczovL3d3dy5ob2xvY2FyZC5uZXQvIiwiaHR0cHM6Ly93d3cuaG9sb2NhcmQubmV0LyIsImh0dHBzOi8vd3d3LmhvbG9jYXJkLm5ldC8iLCJodHRwczovL3d3dy5ob2xvY2FyZC5uZXQvIiwiaHR0cHM6Ly93d3cuaG9sb2NhcmQubmV0LyJdfQ.RcyDLV9ecmt51s9O__GynaDruOf5sFF3WgW1mYFqWcU",
                    "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
                },
                "body": `TransitAccountId=${transitAccountId}`,
                "method": "POST"
            });
            getCappingPotsByTransitAccountData = await getCappingPotsByTransitAccountResponse.json()
            if(getCappingPotsByTransitAccountData.Messages[1] = "invalid session"){
                throw new Error("invalid session");
            }
            console.log(getCappingPotsByTransitAccountData)
            
        }else{
            const getCappingPotsByTransitAccountResponse = await fetch("https://www.holocard.net/umbraco/Api/CustomerAccountApi/GetCappingPotsByTransitAccount", {
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
                "body": `TransitAccountId=${transitAccountId}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
                });
            getCappingPotsByTransitAccountData = await getCappingPotsByTransitAccountResponse.json()
            if(getCappingPotsByTransitAccountData.Messages[1] = "invalid session"){
                throw new Error("invalid session");
            }
            console.log(getCappingPotsByTransitAccountData)
            
            
        }
    }catch(error){
        console.error(`Error fetching capping pots info of account #${transitAccountId} error:`, error);
        throw error;
    }
    const cardInfo:readonly [GetTransactionHistoryResponse,GetCappingPotsByTransitAccountResponse] = [getTransactionHistoryData,getCappingPotsByTransitAccountData];

    return cardInfo
}

/**
 * {
    * "Success": boolean,
    * "Messages": any[],
    * "ErrorsByField": Record<string, any>,
    * "Data": {
        * "Result": [
            * {
            * "PotId": number,
            * "Name": string,
            * "ValidFrom": string,   // ISO 8601 Date
            * "ValidTo": string,     // ISO 8601 Date
            * "Amount": number,      // e.g., 8000 (cents/units)
            * "CurrentValue": number,
            * "MissingValue": number,
            * "Description": string
            * }
        * ],
        * "TotalCount": number
    * }
 * }
 * 
 * 
 * 
 * {
    * "Success": boolean,
    * "Messages": string[],
    * "ErrorsByField": Record<string, any>,
    * "Data": [
        * {
            * "Transaction": {
                * "AppliedCapping": null | any,
                * "DeviceNumber": number,
                * "LineName": string,
                * "LineNumber": number,
                * "NumberOfPersons": number,
                * "OperatorId": number,
                * "PurseBalance": number,
                * "PurseBalancePreTax": null | number,
                * "PurseCredit": number,
                * "PurseCreditPreTax": null | number,
                * "Result": string,
                * "ResultId": number,
                * "SalesChannelId": number,
                * "SalesChannel": null | string,
                * "StopName": string,
                * "StopNumber": number,
                * "TicketExternalNumber": number,
                * "TicketName": string,
                * "Timestamp": string, // ISO 8601 Date
                * "TransactionId": string,
                * "TransactionType": string,
                * "TransactionTypeId": number,
                * "ValidFrom": string, // ISO 8601 Date
                * "ValidTo": string,   // ISO 8601 Date
                * "VehicleNumber": number
            * },
            * "RetailLocation": null | any
        * }
    * ]
 * }
 */

