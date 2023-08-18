import {NextApiRequest, NextApiResponse} from "next";
import {shuffledCountries} from "@/misc/countries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const guess = req.body
    if(guess === country()){
        res.status(200).json({correct:1})
        return
    }
    res.status(200).json({correct:0})
}

function country(){
    const start = new Date(Date.UTC(2023, 7, 17, 0, 0, 0)).getTime()
    const current = Date.now()

    const timeDifference = Math.abs(current - start);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let countryDay = Math.floor(daysDifference)

    if(countryDay > 246){
        countryDay = countryDay - 246
    }

    const dailyCountry  = shuffledCountries[countryDay] as string
    return dailyCountry
}