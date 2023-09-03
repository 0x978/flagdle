import {NextApiRequest, NextApiResponse} from "next";
import logger from "@/components/api/logger";
import {getCountryName} from "@/components/api/fetchGenericCountry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const dailyCountry = getCountryName("clue")


    if(req.body){
        console.log("=====================================COUNTRY GAME FINISH=====================================")
        await logger("FINISHED CLUEGUESSR GAME:",[["CORRECT COUNTRY",dailyCountry],["Country",dailyCountry],["GUESSES",req.body],["IP",ip]])
        console.log("=============================================================================================")
    }

    res.status(200).json({"country":dailyCountry})
}