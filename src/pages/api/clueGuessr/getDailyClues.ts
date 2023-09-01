import {NextApiRequest, NextApiResponse} from "next";
import fetchGenericCountry, {getCountryCode} from "@/components/api/fetchGenericCountry";

const dailyCountry = ""
let currentClues = []
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const country = await fetchGenericCountry("clue")
    if(country !== dailyCountry){
        const countryCode = getCountryCode("clue")
        const clues = await customFactHandler(countryCode)
        currentClues = createDailyFacts(clues)
    }

    res.status(200).json({"OK":currentClues})
}

function createDailyFacts(clues){
    const clueZero = clues.landlocked
    const clueOne = clues.population
    const clueTwo = clues.continents[0]
    const clueThree = clues.subregion
    const clueFour = clues.unMember
    const clueFive = Object.values(clues.languages)[0] as string
    const clueSix = coinFlip() ? clues.timezones[0] : clues.car.side
    const clueSeven = clues.coatOfArms.png
    const clueEight = clues.currencies[Object.keys(clues.currencies)[0]].name
    const clueNine = clues.tld

    return [clueZero,clueOne,clueTwo,clueThree,clueFour,clueFive,clueSix,clueSeven,clueEight,clueNine]
}

function coinFlip(){
    const coin = Math.random()
    return coin < 0.5
}

async function customFactHandler(countryCode:string){
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    let data = await res.json()
    data = data[0]
    return data
}