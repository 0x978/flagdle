import {countryArray, countryCodeMap, invertedCountryCodeMap, shuffleArray, shuffledCountries} from "@/misc/countries";
import fs from "fs";

const clueGuessrCountries = shuffleArray(countryArray,45)
export let startDay = new Date(Date.UTC(2023, 7, 24, 0, 0, 0)).getTime()
export const dailyCountryArray:string[] = shuffleArray(fs.readdirSync("public/countryOutlines").map((filename:string) => filename),42) // Array containing shuffled country outlines
const outlineDir = "public/countryOutlines"

let index = getIndex()
export default async function fetchGenericCountry(gamemode:string){
    index = getIndex()
    switch (gamemode){
        case "flag":
            const dailyCountry  = shuffledCountries[index] as string
            const dailyCountryCode = countryCodeMap[dailyCountry]
            const flag = `https://flagcdn.com/w640/${dailyCountryCode.toLowerCase()}.png`
            return {flag:flag,country:dailyCountry,countryCode:dailyCountryCode,index:index}
        case "country":
            const country = dailyCountryArray[index] as string
            const fullpath = `${outlineDir.slice(6)}/${country}` // receiving component doesn't want /public/ prefix
            return {country:country,path:fullpath}
        case "clue":
            return clueGuessrCountries[index]
    }

}

function getIndex(){
    const current = Date.now()

    const timeDifference = Math.abs(current - startDay);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if(isRestart()){ // on day 242, number of countries will run out. Reset start, so tomorrow there is countries.
        startDay = Date.now()
    }

    return Math.floor(daysDifference)
}

function isRestart(){
    const timeDifference = Math.abs(Date.now() - startDay);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference === 240;

}

export function getCountryName(gamemode:string){
    switch (gamemode){
        case "flag":
            return shuffledCountries[index] as string
        case "country":
            const countryFile = dailyCountryArray[index]
            return invertedCountryCodeMap[countryFile.slice(0,2).toUpperCase()]
        case "clue":
            return clueGuessrCountries[index]
        default:
            throw new Error("Invalid gamemode")
    }
}

export function getCountryCode(gamemode:string){
    switch (gamemode){
        case "flag":
            return countryCodeMap[getCountryName("flag")]
        case "country":
            const countryFile = dailyCountryArray[index] as string
            return countryFile.slice(0,2).toUpperCase()
        case "clue":
            return countryCodeMap[clueGuessrCountries[index]]
        default:
            throw new Error("Invalid gamemode")
    }
}