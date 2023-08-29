import {NextApiRequest, NextApiResponse} from "next";
import logger from "@/components/api/logger";
import {getCountryCode, getCountryName} from "@/components/api/fetchGenericCountry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const dailyCountryCode = getCountryCode("flag")

    const dailyCountry = getCountryName("flag")

    const flag = `https://flagcdn.com/w640/${dailyCountryCode.toLowerCase()}.png`

    if(req.body){
        console.log("=====================================GAME FINISH=====================================")
        void logger("FINISHED GAME:",[["CORRECT COUNTRY",dailyCountry],["FLAG",flag],["GUESSES",req.body],["IP",ip]])
        console.log("=====================================================================================")
    }

    res.status(200).json({"country":dailyCountry})
}
