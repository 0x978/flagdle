import {NextApiRequest, NextApiResponse} from "next";
import {countryCodeMap, shuffledCountries} from "@/misc/countries";
import {logger} from "@/pages/api/fetchCorrect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const start = new Date(Date.UTC(2023, 7, 17, 0, 0, 0)).getTime()
    const current = Date.now()

    const timeDifference = Math.abs(current - start);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let countryDay = Math.floor(daysDifference)

    if(countryDay > 246){
        countryDay = countryDay - 246
    }

    const dailyCountry  = shuffledCountries[countryDay] as string

    const dailyCountryCode = countryCodeMap[dailyCountry]

    const flag = `https://flagcdn.com/w640/${dailyCountryCode.toLowerCase()}.png`

    await logger("CONNECTION",ip, dailyCountry, flag)

    res.status(200).json({flag:flag})

}