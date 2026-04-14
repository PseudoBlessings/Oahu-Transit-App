export interface HolocardCappingInfo{
    Name: string;
    ValidFrom: string; // ISO 8601 Date string
    ValidTo: string;   // ISO 8601 Date string
    Amount: number;
    CurrentValue: number;
    MissingValue: number;
    Description: string;
}

export interface HolocardInfo{
    cardId: number
    cardPhyscialID: string
    cardType: string
    cardName: string
    balance: number
    holocardCappingInfo?: HolocardCappingInfo[]
    currentPass?:string
}

export interface HoloAccountInfo{
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    Email: string;
}

export interface HolocardAutoloadInfo{
    cardId:number;
    autoloadId:number;
    autoloadType: "Monthly" | "Threshold";
    autoloadThresholdAmount?: number;
    autoloadDate?: string; //ISO 8601 Date string
    autoloadAmount: number;
    //autoloadPaymentSource?: []; // Will finish once the payment system is implemented.
}

export interface BaseHolocardTransaction{
    cardId:number;
    transactionId:string;
    timestamp:string;
    result:"Ok" | "ErrorInsufficientCredit" | "ErrorController" | string;
    trasactionName:string;
}


export interface BaseTravelTransaction extends BaseHolocardTransaction{
    stopName: string;
    vehicleNumber: number;
    lineName: string;
    validFrom: string | null; // ISO 8601 String
    validTo: string | null; // ISO 8601 String
}
export interface BoardingTransaction extends BaseTravelTransaction{
    transactionType: "Boarding";
    balance: number;
    credit: number;
}

export interface TransferTransaction extends BaseTravelTransaction{
    transactionType: "Transfer";
}

export interface ChargeTransaction extends BaseHolocardTransaction{
    transactionType: "Charge";
    balance: number;
    credit: number;
}

export interface LoadTransaction extends BaseHolocardTransaction{
    transactionType: "Load";
}

export interface UseTransaction extends BaseTravelTransaction{
    transactionType: "Use";
}

export interface FareMediaTransaction extends BaseHolocardTransaction{
    transactionType:"FareMediaSale";
}

export interface EightyThreeTransaction extends BaseTravelTransaction{
    transactionType: "83";
}

export type Transaction = 
    | BoardingTransaction 
    | TransferTransaction 
    | LoadTransaction
    | ChargeTransaction
    | UseTransaction
    | FareMediaTransaction
    | EightyThreeTransaction
    | any