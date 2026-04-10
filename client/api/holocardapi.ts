export interface APIResponse<APIResponseDataType>{
    Data: APIResponseDataType;
    ErrorsByField: Record<string, any>;
    Messages: string[];
    Success: boolean;
}

async function apiRequest<APIResponseDataType>(endpoint: string, httpMethod:"GET"|"POST", cookies?: string, body?:string, contentType?:string){
    const hasCookies = cookies && cookies.trim().length > 0;
    let response:Response;
    try{
        response = await fetch(`https://www.holocard.net/umbraco/${endpoint}`, {
            "headers": {
                ...(httpMethod === "POST" ? {"accept": "application/json, text/javascript, */*; q=0.01"}  : {"accept": "*/*"}),
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                ...(contentType ? {"content-type": `${contentType}`} : {}),
                ...(cookies ? { "cookie": cookies } : {}),
                "Referer": "https://www.holocard.net/en/customeraccount/my-cards/"
            },
            body: body ? body : null,
            "method": `${httpMethod}`,
            ...(cookies ? {} : {"mode": "cors"}),
            ...(cookies ? {} : {"credentials": "include"})
            });

        if(!response.ok){
            throw new Error("HTTP Error: " + response.status + " Endpoint: " + endpoint)
        }

        const data:APIResponse<APIResponseDataType> = await response.json()

        console.log("Success Message for Endpoint (", endpoint, "):", data.Success)
        console.log("Message for Endpoint (", endpoint, "):", data.Messages)

        if (data.Messages[1] === "invalid session"){
            throw new Error("Session/Cookies are invalid, please get new ones");
        }

        if (!data.Success){
            throw new Error("Request resulted in a false success")
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

export async function getCurrentCustomerAccount(cookies?: string) {
        return apiRequest<CurrentCustomerAccountData>("api/CustomerAccountApi/GetCurrentCustomerAccount", "POST", cookies)
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

export async function getTransitAccount(cookies?:string):Promise<GetTransitAccountsData>{
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

export async function GetTransitAccountProducts(transitAccountId:number, cookies?:string):Promise<GetTransitAccountProductsData>{
    return apiRequest<GetTransitAccountProductsData>("Api/CustomerAccountApi/GetTransitAccountProducts", "POST", cookies, `TransitAccountId=${transitAccountId}`, "application/x-www-form-urlencoded; charset=UTF-8")
}


export interface Transaction {
    AppliedCapping: string | null;
    DeviceNumber: number | null;
    LineName: string | null;
    LineNumber: number | null;
    NumberOfPersons: number | null;
    OperatorId: number;
    PurseBalance: number | null;
    PurseBalancePreTax: number | null;
    PurseCredit: number | null;
    PurseCreditPreTax: number | null;
    Result: "Ok" | "ErrorInsufficientCredit" | "ErrorController" | "ErrorCiAlreadyDenied" | string;
    ResultId: number | null;
    SalesChannelId: number | null;
    SalesChannel: string | null;
    StopName: string | null;
    StopNumber: number | null;
    TicketExternalNumber: number;
    TicketName: string;
    Timestamp: string; // ISO 8601 Date string
    TransactionId: string; // UUID
    TransactionType: "Boarding" | "Charge" | "Transfer" | "Use" | "83" | "FareMediaSale" | "Load" | string ;
    TransactionTypeId: number;
    ValidFrom: string | null;  // ISO 8601 Date string
    ValidTo: string | null;    // ISO 8601 Date string
    VehicleNumber: number | null;
}

export interface GetTransactionHistoryData {
    Transaction: Transaction;
    RetailLocation: any | null;
}

export async function getTransitHistory(transitAccountId:number, take:number = 50, cookies?:string):Promise<GetTransactionHistoryData[]>{
    return apiRequest<GetTransactionHistoryData[]>("Api/CustomerAccountApi/GetTransactionHistory", "POST", cookies, `TransitAccountId=${transitAccountId}&Take=${take}`);
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

export async function getCappingPotsbyTransitAccount(transitAccountId:number, cookies?:string):Promise<GetCappingPotsByTransitAccountData>{
    return apiRequest<GetCappingPotsByTransitAccountData>("Api/CustomerAccountApi/GetCappingPotsByTransitAccount", "POST", cookies, `TransitAccountId=${transitAccountId}`, "application/x-www-form-urlencoded; charset=UTF-8")
}

export interface GetAutoloadsByTransitAccountIdData{
    Id: number;
    ProductId: number;
    AutoloadType: number;
    CustomerAccountId: number;
    InstitutionAccountId: number | null;
    FundingSourceId: number;
    BackupFundingSourceId: number | null;
    AutoloadThresholdValue: number;
    AutoloadValue: number;
    SuspendedFrom: string | null;
    SuspendedTo: string | null;
    PartialAutoLoadValue: number;
    MultipleFundingSources: any[];
    PeriodDayOfMonth: number;
    PeriodRunDate: string | null;  // ISO 8601 Date String
    AutoloadLimit: number | null;
    AutoloadResetPeriod: number | null;
}

export async function getAutoloadsByTransitAccountId(transitAccountId:number, cookies?:string):Promise<GetAutoloadsByTransitAccountIdData[]>{
    return apiRequest<GetAutoloadsByTransitAccountIdData[]>("Api/ProductsApi/GetAutoloadsByTransitAccountId", "POST", cookies, `TransitAccountId=${transitAccountId}`, "application/x-www-form-urlencoded; charset=UTF-8")
}