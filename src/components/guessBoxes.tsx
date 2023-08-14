import {FC} from "react"
import GuessBox from "@/components/guessBox";
import {nanoid} from "nanoid";

interface GuessBoxesProps {
    guesses: string[]
}

const GuessBoxes: FC<GuessBoxesProps> = ({guesses}) => {
    return(
        <div className={"w-72 border-4 border-green-300"}>
            {guesses.map((guess) => {
                return(
                    <GuessBox country={guess}/>
                )
            })}
        </div>
    )
}

export default GuessBoxes