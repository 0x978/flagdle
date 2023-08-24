import {NextApiRequest, NextApiResponse} from "next";
import {logger} from "@/pages/api/fetchCorrect";
import {fetchDailyCountryName} from "@/pages/api/countryGuessr/fetchDailyCountry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const dailyCountry = fetchDailyCountryName()

    if(req.body){
        console.log("=====================================COUNTRY GAME FINISH=====================================")
        void logger("FINISHED GAME:",[["CORRECT COUNTRY",dailyCountry],["Country",dailyCountry],["GUESSES",req.body],["IP",ip]])
        console.log("=============================================================================================")
    }

    res.status(200).json({"country":dailyCountry})
}