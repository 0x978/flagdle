import {NextApiRequest, NextApiResponse} from "next";
import {countryCodeMap, shuffledCountries} from "@/misc/countries";
import {undefined} from "zod";
import {logger} from "@/pages/api/fetchCorrect";
import {factObject} from "@/misc/types";
import {fetchDailyCountryCode} from "@/pages/api/countryGuessr/fetchDailyCountry";

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
    const fetchedCountry = fetchDailyCountryCode()
    let fetched = false
    if(localCountry !== fetchedCountry){
        fetched = true
        localCountry = fetchedCountry
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${fetchedCountry}`)
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
    const guessNum = parseInt(req.body)
    const decidedFact = decideFact(facts,guessNum)
    res.status(200).json({didFetch:fetched,factData:decidedFact})
}

function logDidFetch(factData:countryFacts){
    type paramTypes = {
        state: Capitalize<string>;
        additionalArgs: [Capitalize<string>, string][];
    };
    const params:paramTypes = {
        state:"COUNTRY: NEW FACTS",
        additionalArgs: [["CAPITAL", factData.capital], ["CONTINENT", factData.continent], ["REGION", factData.region], ["LANDLOCKED", factData.isLandLocked.toString(),], ["LANGUAGE",
            factData.language], ["POPULATION", factData.population]]
    }
    void logger(params.state,params.additionalArgs)
}

function decideFact(factData:countryFacts,guessNum:number){
    const rand = Math.round(Math.random())
    let fact:factObject = {factString: "", factType: ""}
    switch (guessNum){
        case 1:
            fact.factType = "Is the country landlocked?"
            fact.factString = factData.isLandLocked.toString()
            break;
        case 2:
            if(rand > 0.5){
                fact.factType = "On which continent is the country located?"
                fact.factString = factData.continent
            }
            else{
                fact.factType = "What is the capital of this country?"
                fact.factString = factData.capital
            }
            break
        case 3:
            fact.factType = "What is the most spoken language here?"
            fact.factString = factData.language
            break
        case 4:
            fact.factType = "What is the estimate population?"
            fact.factString = factData.population.toLocaleString();
            break
        case 5:
            fact.factType = "In which region is the country located"
            fact.factString  = factData.region
            break
        default:
            fact.factType = "Error"
            fact.factString = "Error"
    }
    return fact
}