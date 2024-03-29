import {countryCodeMap} from "@/misc/countries";

export interface guess{
    correct:boolean
    country:string
}

export interface CountryCodeMap {
    [country: string]: string;
}

export type CountryCodeKeys = keyof typeof countryCodeMap;

export interface factObject{
    factType:string
    factString:string
}

export interface countryFacts{
    population:string,
    continent:string,
    capital:string,
    region:string,
    language:string,
    isLandLocked:string,
}
