import {FC} from "react"

interface GuessBoxProps {
    country:string
    isCorrect: boolean
}

const GuessBox: FC<GuessBoxProps> = ({country,isCorrect}) => {

    const isCorrectStyle = isCorrect ? `border-green-500` : `border-red-500`

    return(
        <main className={`border-4 ${isCorrectStyle}`}>
            <h1 key={country}>{country}</h1>
        </main>
    )
}

export default GuessBox