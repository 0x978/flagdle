import {NextApiRequest, NextApiResponse} from "next";
import {countryCodeMap, shuffledCountries} from "@/misc/countries";
import {country} from "@/pages/api/guessHandler";
import {undefined} from "zod";
import {logger} from "@/pages/api/fetchCorrect";

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
    const fetchedCountry = country()
    let fetched = false
    if(localCountry !== fetchedCountry){
        fetched = true
        localCountry = fetchedCountry
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCodeMap[localCountry]}`)
        let data = await res.json()
        data = data[0]
        facts.capital = data.capital[0]
        facts.continent = data.continents[0]
        facts.region = data.subregion
        facts.isLandLocked = data.landlocked
        facts.language = Object.values(data.languages)[0] as string
        facts.population = data.population
        logDidFetch(facts)
    }
    res.status(200).json({didFetch:fetched,facts:facts})
}

function logDidFetch(factData:countryFacts){
    type paramTypes = {
        state: Capitalize<string>;
        additionalArgs: [Capitalize<string>, string][];
    };
    const params:paramTypes = {
        state:"FETCHED NEW FACTS",
        additionalArgs: [["CAPITAL", factData.capital], ["CONTINENT", factData.continent], ["REGION", factData.region], ["LANDLOCKED", factData.isLandLocked.toString(),], ["LANGUAGE",
            factData.language], ["POPULATION", factData.population]]
    }
    void logger(params.state,params.additionalArgs)
}
