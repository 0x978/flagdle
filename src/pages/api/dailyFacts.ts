import {NextApiRequest, NextApiResponse} from "next";
import {undefined} from "zod";
import newFactHandler from "@/components/api/factHandlers/newFactHandler";
import decideFact from "@/components/api/factHandlers/decideFact";
import factLogger from "@/components/api/factHandlers/factLogger";
import {countryCodeMap} from "@/misc/countries";
import {getCountryName} from "@/components/api/fetchGenericCountry";

interface countryFacts{
    population:string,
    continent:string,
    capital:string,
    region:string,
    language:string,
    isLandLocked:string,
}

let localCountry:string|undefined
let facts:countryFacts = {capital: "", continent: "", language: "", population: "", region: "", isLandLocked:""}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const fetchedCountry = getCountryName("flag")
    let fetched = false
    if(localCountry !== fetchedCountry){
        fetched = true
        localCountry = fetchedCountry
        facts = await newFactHandler(countryCodeMap[localCountry])
        factLogger(facts)
    }
    const guessNum = parseInt(req.body)
    const decidedFact = decideFact(facts,guessNum)
    res.status(200).json({didFetch:fetched,factData:decidedFact})
}


