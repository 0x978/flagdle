import {FC} from "react"
import {countryCodeMap} from "@/misc/countries";

interface GuessBoxProps {
    country:string
    isCorrect: boolean
}

const GuessBox: FC<GuessBoxProps> = ({country,isCorrect}) => {

    const isCorrectStyle = isCorrect ? `border-green-500` : `border-red-500`

    const flag = `https://flagcdn.com/w160/${countryCodeMap[country].toLowerCase()}.png`

    return(
        <main className={`border-4 ${isCorrectStyle} flex flex-row p-1 space-x-4 items-center`}>
            <div className="w-28 h-16 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                {country === "Nepal" ?
                    <img src={flag} alt={`${country} Flag`} className="h-full w-full object-contain" />
                :
                    <img src={flag} alt={`${country} Flag`} className="h-full w-full" />}
            </div>
            <h1 className="text-superCoolEdgyPurple text-lg">{country}</h1>

        </main>

    )
}

export default GuessBox