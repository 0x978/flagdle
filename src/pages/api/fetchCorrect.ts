import {NextApiRequest, NextApiResponse} from "next";
import {countryCodeMap, shuffledCountries} from "@/misc/countries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ip = req.headers["x-real-ip"] as string; // Header is set up on NGINX reverse proxy config

    const start = new Date(Date.UTC(2023, 7, 17, 0, 0, 0)).getTime()
    const current = Date.now()

    const timeDifference = Math.abs(current - start);

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    let countryDay = Math.floor(daysDifference)

    if(countryDay > 246){
        countryDay = countryDay - 246
    }

    const dailyCountry  = shuffledCountries[countryDay] as string

    const dailyCountryCode = countryCodeMap[dailyCountry]

    const flag = `https://flagcdn.com/w640/${dailyCountryCode.toLowerCase()}.png`

    if(req.body){
        console.log("=====================================GAME FINISH=====================================")
        void logger("FINISHED GAME:",ip,dailyCountry,flag,[["GUESSES",req.body]])
    }

    res.status(200).json({"country":dailyCountry})
}

export async function logger(state:Capitalize<string>,IP: string,dailyCountry:string,flagURL:string,additionalArgs?: [Capitalize<string>, string][]) {
    try{
        const res = await fetch(`https://ipapi.co/${IP}/json/`)
        const data = await res.json()
        const country = data.country_name
        const city = data.city
        const localTime = createTimeWithOffset(data.utc_offset)

        const dateTime = new Date().toLocaleDateString('en-gb', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        })

        console.log(`-------------------------------------------------------
${state}:
Location:${IP}, ${city}, ${country}
gameCountry:${dailyCountry}
flag:${flagURL}
${(additionalArgs ?? []).map(([key, value]) => `${key}: ${value}`).join('\n')}
ON:${dateTime}
LOCAL TIME:${localTime}
`)
    }
    catch (e){
        console.log("------------------------------------------------------------------------------------------")
        console.log("LOGGING FAILED")
        console.log(`IP: ${IP}`)
        console.log(e)
    }
}

function createTimeWithOffset(utcOffsetStr:string) {
    // Parse the UTC offset from the provided string
    const hours = parseInt(utcOffsetStr.substring(0, 3), 10);
    const minutes = parseInt(utcOffsetStr.substring(3), 10);

    // Calculate the total offset in milliseconds
    const totalOffsetMs = (hours * 60 + minutes) * 60 * 1000;

    // Get the current UTC time
    const now = new Date();

    // Calculate the local time based on the UTC offset
    const localTime = new Date(now.getTime() + totalOffsetMs);

    // Extract hours and minutes
    const localHours = localTime.getUTCHours();
    const localMinutes = localTime.getUTCMinutes();

    // Format the time in 24-hour format (e.g., "13:35")
    return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
}