import {FC, useEffect, useState} from "react"
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'
import {factObject, guess} from "@/misc/types";
import Submit from "@/components/submit";
import Confetti from 'react-confetti';
import {useTimeout, useWindowSize} from 'react-use';
import ClueBoxes from "@/components/clueBoxes";
import {useRouter} from "next/router";
import {handleGameOver, handleGuess, isPlayedToday, memoryWriter} from "@/components/gameLogic";


const Index: FC = () => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>("")
    const [flag, setFlag] = useState<string>("")
    const [facts, setFacts] = useState<factObject[]>([])
    const [displayClues, setDisplayClues] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<guess[]>([])
    const {width, height} = useWindowSize()
    const [confettiIsComplete] = useTimeout(4000);
    const router = useRouter()

    useEffect(() => {
        async function fetchFlag() {
            const res = await fetch("/api/fetchDailyFlag")
            const data = await res.json()
            if (data.flag) {
                setFlag(data.flag)
            } else {
                alert("Error fetching flag")
            }
        }

        void fetchFlag()
        let isPlayed = isPlayedToday(true)
        if (isPlayed !== null) {
            const stats:[boolean,number] = JSON.parse(isPlayed)
            if (stats[0]) {
                void handleGameOver(true, "/api/fetchCorrect",stats[1])
            } else {
                void handleGameOver(false, "/api/fetchCorrect",stats[1])
            }
        }
    }, [])

    function guesser() {
        handleGuess(currentGuess, "/api/guessHandler", "/api/fetchCorrect", "/api/dailyFacts", setFacts, guesses, setGuesses)
            .then((isCorrect) => {
                if (isCorrect) {
                    setIsUserCorrect(true)
                    setIsGameActive(false)
                    memoryWriter(true, true,guesses.length)
                }
                if (!isCorrect && guesses.length >= 6) {
                    setIsGameActive(false)
                    memoryWriter(false, false,guesses.length)
                    void handleGameOver(false, "/api/fetchCorrect",guesses.length)
                }
            })
    }


    return (
        <>
            {isUserCorrect && <Confetti width={width} height={height} recycle={!confettiIsComplete()}/>}
            <Head>
                <title>Flag Guesser</title>
                <meta name="0x978.com" content="cat"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="min-h-screen flex flex-col items-center text-center ">
                <div className="flex flex-col items-center my-3 space-y-4">
                    <h1 className="text-5xl text-superCoolEdgyPurple">Flag Daily game thing</h1>
                    <img
                        className="w-96"
                        src={flag}
                        alt="The daily flag"
                    />

                    {isGameActive && <Submit currentGuess={currentGuess} setCurrentGuess={setCurrentGuess}
                                             handleGuess={guesser}/>}

                    {guesses.length > 0 &&
                        <button
                            className={`${!displayClues ? `bg-pastelYellow` : `bg-superCoolEdgyPurple`} text-black w-44 h-11 rounded-3xl`}
                            onClick={() => setDisplayClues(prevState => !prevState)}>{displayClues ? "Display Guesses" : "Display Clues"}</button>
                    }

                    {!displayClues ?
                        guesses.length > 0 && <GuessBoxes guesses={guesses}/>
                        :
                        <ClueBoxes clues={facts}/>
                    }

                </div>
            </main>
        </>
    );


}

export default Index
