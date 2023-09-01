import {FC, useEffect, useState} from "react"
import {factObject, guess} from "@/misc/types";
import {useTimeout, useWindowSize} from "react-use";
import {handleGameOver, handleGuess, isPlayedToday, memoryWriter} from "@/components/gameLogic";
import Confetti from "react-confetti";
import Head from "next/head";
import Submit from "@/components/submit";
import GuessBoxes from "@/components/guessBoxes";
import ClueBoxes from "@/components/clueBoxes";

interface ClueGuessrProps {

}

const ClueGuessr: FC<ClueGuessrProps> = ({}) => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>("")
    const [clues,setClues] = useState<string[]>([])
    const [index,setIndex] = useState<number>(0)
    const {width, height} = useWindowSize()
    const [confettiIsComplete] = useTimeout(4000);


    return (
        <>
            {isUserCorrect && <Confetti width={width} height={height} recycle={!confettiIsComplete()}/>}
            <Head>
                <title>Clue Guessr</title>
                <meta name="0x978.com" content="cat"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="min-h-screen flex flex-col items-center text-center ">
                <div className="flex flex-col items-center my-3 space-y-4">
                    <h1 className="text-5xl text-superCoolEdgyPurple">Clue Guessr</h1>
                    <h1 className="text-3xl text-superCoolEdgyPurple">Hint Number: {index+1}</h1>

                    <div>
                        <button className={"bg-red-300 w-44"}>{"<--"}</button>
                        <button className={"bg-green-300 w-44"}>{"-->"}</button>
                    </div>

                </div>
            </main>
        </>
    );

}

export default ClueGuessr