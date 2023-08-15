import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const guess = req.body

    if(guess === "Tuvalu"){
        res.status(200).json({correct:1})
    }
    res.status(200).json({correct:0})
}