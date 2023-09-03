import {NextApiRequest, NextApiResponse} from "next";
import fetchGenericCountry, {getCountryCode} from "@/components/api/fetchGenericCountry";

const dailyCountry = ""
let currentClues:string[] = []

interface customClueObject{
    continents:string[]
    languages:string[]
    landlocked:boolean,
    population:string,
    subregion:string
    unMember:boolean
    timezones:string[]
    car:{
        side:string
    }
    area:string,
    coatOfArms:{png:string},
    currencies:string[]
    tld:string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const country = await fetchGenericCountry("clue")
    if(country !== dailyCountry){
        const countryCode = getCountryCode("clue")
        const clues = await customFactHandler(countryCode)
        currentClues = createDailyFacts(clues)
    }

    res.status(200).json({"clues":currentClues})
}

function createDailyFacts(clues:customClueObject){
    const isTwoContinents = clues.continents.length > 1
    const isTwoLanguages = Object.values(clues.languages).length > 1

    const clueZero = `The country ${clues.landlocked ? "is" : "is not"} landlocked`
    const clueOne = `The country has a population of ${clues.population} people`
    const clueTwo = `The country is located ${isTwoContinents ? 'mostly ' : ''}in ${clues.continents[0]} ${isTwoContinents ? `, but is also located in ${clues.continents[1]}` : ''}`
    const clueThree = `The country subregion is ${clues.subregion}`
    const clueFour = `The country ${clues.unMember ? 'is' : 'is not'} a member of the UN`
    const clueFive = `The country mainly speaks ${Object.values(clues.languages)[0] as string} ${isTwoLanguages ? `But also ${Object.values(clues.languages)[1]} is spoken` : ''}`
    const clueSix = coinFlip() ? `The country spans the following timezones: ${clues.timezones}` : `The country drives on the ${clues.car.side} hand side`
    const clueSeven = clues.coatOfArms.png !== undefined ? clues.coatOfArms.png as string : `The country has an area of ${clues.area} km²`
    const clueEight = `The predominant currency of this country is the ${[Object.keys(clues.currencies)[0]]}`
    const clueNine = `The top level domains (tld) for this country are: ${clues.tld}`
    const clueTen = `https://flagcdn.com/w640/${getCountryCode("clue").toLowerCase()}.png`

    return [clueZero,clueOne,clueTwo,clueThree,clueFour,clueFive,clueSix,clueSeven,clueEight,clueNine,clueTen]
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