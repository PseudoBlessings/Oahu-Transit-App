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
    holocardCappingInfo: HolocardCappingInfo[] | undefined
    currentPass:string
}

export interface HoloAccountInfo{
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    Email: string;
}