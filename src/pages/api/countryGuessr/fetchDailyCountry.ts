import {NextApiRequest, NextApiResponse} from "next";
import {invertedCountryCodeMap, shuffleArray} from "@/misc/countries";
import {logger} from "@/pages/api/fetchCorrect";
import fs from "fs";

export let countryStartDay = new Date(Date.UTC(2023, 7, 24, 0, 0, 0)).getTime()
const outlineDir = "public/countryOutlines"

export const dailyCountryArray:string[] = shuffleArray(fs.readdirSync(outlineDir).map((filename:string) => filename),42)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    let dailyCountry = fetchDailyCountryFile()

    const fullpath = `${outlineDir.slice(6)}/${dailyCountry}` // receiving component doesn't want /public/ prefix

    await logger("Country Connection",[["IP",ip],["DAILY COUNTRY",dailyCountry],["Country URL",fullpath]])

    res.status(200).json({"country":fullpath})
}

function fetchDailyCountryFile(){
    const current = Date.now()

    const timeDifference = Math.abs(current - countryStartDay);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if(isRestart()){ // on day 242, number of countries will run out. Reset start, so tomorrow there is countries.
        countryStartDay = Date.now()
    }

    let countryDay = Math.floor(daysDifference)

    return dailyCountryArray[countryDay] as string
}

export function fetchDailyCountryName(){
    return invertedCountryCodeMap[fetchDailyCountryFile().slice(0,2).toUpperCase()]
}

export function fetchDailyCountryCode(){
    return fetchDailyCountryFile().slice(0,2).toUpperCase()
}

export function isRestart(){
    const timeDifference = Math.abs(Date.now() - countryStartDay);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference === 241;

}