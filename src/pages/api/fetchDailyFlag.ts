import {NextApiRequest, NextApiResponse} from "next";
import logger from "@/components/api/logger";
import fetchGenericCountry from "@/components/api/fetchGenericCountry";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const flagObj = await fetchGenericCountry("flag") as { flag: string, country: string, countryCode: string, index: number };

    if(!flagObj){
        res.status(404)
        return
    }

    if(!flagObj.flag){
        res.status(404).json({"error":"Flag not fetched"})
        return
    }

    await logger("CONNECTION",[["IP",ip],["DAILY COUNTRY",flagObj.country],["FLAG URL",flagObj.flag]])


    res.status(200).json({flag:flagObj.flag})

}