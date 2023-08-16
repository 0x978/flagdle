import {FC} from "react"
import GuessBox from "@/components/guessBox";
import {nanoid} from "nanoid";
import {guess} from "@/misc/types";

interface GuessBoxesProps {
    guesses: guess[]
}

const GuessBoxes: FC<GuessBoxesProps> = ({guesses}) => {
    return(
        <div className={"w-72 border-4 space-y-2"}>
            {guesses.map((guess) => {
                return(
                    <GuessBox country={guess.country} isCorrect={guess.correct}/>
                )
            })}
        </div>
    )
}

export default GuessBoxes