import {NextApiRequest, NextApiResponse} from "next";
import {dailyCountryArray, isRestart} from "@/pages/api/countryGuessr/fetchDailyCountry";
import {countryCodeMap, invertedCountryCodeMap} from "@/misc/countries";

let start = new Date(Date.UTC(2023, 7, 24, 0, 0, 0)).getTime()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const guess = req.body
    if(guess === country()){
        res.status(200).json({correct:1})
        return
    }
    res.status(200).json({correct:0})
}

export function country(){

    if(isRestart()){
        start = Date.now()
    }

    const current = Date.now()

    const timeDifference = Math.abs(current - start);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let countryDay = Math.floor(daysDifference)

    let countryCode = dailyCountryArray[countryDay].slice(0,2).toUpperCase()


    return invertedCountryCodeMap[countryCode]
}