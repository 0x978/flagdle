import {NextApiRequest, NextApiResponse} from "next";
import {countryCodeMap, shuffledCountries} from "@/misc/countries";
import {logger} from "@/pages/api/fetchCorrect";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const outlineDir = "./src/components/countryOutlines"
    const countries:string[] = fs.readdirSync(outlineDir).map((filename:string) => filename)

    const start = new Date(Date.UTC(2023, 7, 17, 0, 0, 0)).getTime()
    const current = Date.now()

    const timeDifference = Math.abs(current - start);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let countryDay = Math.floor(daysDifference)

    const dailyCountry  = countries[countryDay] as string

    const fullpath = `./src/components/countryOutlines/${dailyCountry}`

    res.status(200).json({"country":fullpath})
}