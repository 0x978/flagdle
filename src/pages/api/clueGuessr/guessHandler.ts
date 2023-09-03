import {NextApiRequest, NextApiResponse} from "next";
import {getCountryName} from "@/components/api/fetchGenericCountry";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const guess = req.body
    console.log(getCountryName("clue"))
    if(guess === getCountryName("clue")){
        res.status(200).json({correct:1})
        return
    }
    res.status(200).json({correct:0})
}
