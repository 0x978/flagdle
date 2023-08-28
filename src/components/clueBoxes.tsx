import {FC} from "react"
import GuessBox from "@/components/guessBox";
import {factObject} from "@/misc/types";
import Clue from "@/components/Clue";
import {nanoid} from "nanoid";

interface ClueBoxesProps {
    clues:factObject[]
}

const ClueBoxes: FC<ClueBoxesProps> = ({clues}) => {
    return(
        <div className={"w-96 space-y-2 text-puddlePurple"}>
            {clues.map((clue) => {
                return(
                    <Clue title={clue.factType} fact={clue.factString} key={nanoid()}/>
                )
            })}
        </div>
    )
}

export default ClueBoxes