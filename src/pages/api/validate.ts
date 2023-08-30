import {NextApiRequest, NextApiResponse} from "next";
import {countryArray, countryCodeMap, invertedCountryCodeMap} from "@/misc/countries";
import fs from "fs"
import {fetch} from "next/dist/compiled/@edge-runtime/primitives";
import {dailyCountryArray} from "@/components/api/fetchGenericCountry";

// This endpoint returns the country outlines missing in src/components/countryOutlines and missing flags.
// Code isn't optimised, as this rarely runs.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const missingOutlines = undefined
    const missingFlags = undefined
    const countryGuessrDiscrepancies = verifyCountryGuessrValidation()
    res.status(200).json({missingOutlines:missingOutlines,missingflags:missingFlags,countryGuessr:countryGuessrDiscrepancies}) // Mostly islands + disputed territories.
}

function findMissingOutlines(){
    const outlineDir = "./public/countryOutlines"
    const files:string[] = fs.readdirSync(outlineDir).map((filename:string) => filename.slice(0,2).toUpperCase())

    const countryCodeArr = Object.values(countryCodeMap)

    const countryCodeMapKeys = Object.keys(countryCodeMap)

    const missing = []
    for(let i = 0 ; i < countryCodeArr.length;i++){
        if(!files.some(value => value === countryCodeArr[i])){
            missing.push(countryCodeMapKeys.find(key => countryCodeMap[key] === countryCodeArr[i]))
        }
    }
    return missing
}

async function findMissingFlags() {
    const countryCodeMapKeys = Object.keys(countryCodeMap)
    const missing = []
    for (let i = 0; i < countryCodeMapKeys.length; i++) {
        const code = countryCodeMap[countryCodeMapKeys[i]]
        const flag = await fetch(`https://flagcdn.com/w640/${code.toLowerCase()}.png`)
        if(flag.status !== 200){
            missing.push(code)
        }
    }
    return missing
}

function verifyCountryGuessrValidation(){
    let missing = []
    for(let i = 0 ; i < dailyCountryArray.length; i++){
        const countryFile = dailyCountryArray[i]
        if(!invertedCountryCodeMap[countryFile.slice(0,2).toUpperCase()]){
            missing.push(countryFile)
        }
    }
    return missing
}