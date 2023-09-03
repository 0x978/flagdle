import {NextApiRequest, NextApiResponse} from "next";
import logger from "@/components/api/logger";
import fetchGenericCountry from "@/components/api/fetchGenericCountry";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const fetchedCountry = await fetchGenericCountry("country") as {country:string,path:string}

    if(!fetchedCountry){
        res.status(404)
        return
    }
    if(!fetchedCountry.path){
        res.status(404).json({"error":"Path Missing"})
        return
    }

    await logger("Country Connection",[["IP",ip],["DAILY COUNTRY",fetchedCountry.country],["Country Path",fetchedCountry.path]])

    res.status(200).json({"country":fetchedCountry.path})
}

