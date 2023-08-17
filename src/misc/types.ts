import {countryCodeMap} from "@/misc/countries";

export interface guess{
    correct:boolean
    country:string
}

export interface CountryCodeMap {
    [country: string]: string;
}

export type CountryCodeKeys = keyof typeof countryCodeMap;
