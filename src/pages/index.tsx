import {FC, useEffect, useState} from "react"
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'
import {factObject, guess} from "@/misc/types";
import Submit from "@/components/submit";
import Confetti from 'react-confetti';
import {useTimeout, useWindowSize} from 'react-use';
import Swal from "sweetalert2"
import ClueBoxes from "@/components/clueBoxes";
import {useRouter} from "next/router";
import {guesses, handleGameOver, handleGuess, isPlayedToday, memoryWriter} from "@/components/gameLogic";


const Index: FC = () => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>()
    const [flag, setFlag] = useState<string>("")
    const [facts, setFacts] = useState<factObject[]>([])
    const [displayClues, setDisplayClues] = useState<boolean>(false)
    const {width, height} = useWindowSize()
    const [confettiIsComplete] = useTimeout(4000);
    const router = useRouter()

    useEffect(() => {
        if (guesses.length >= 6) {
            memoryWriter(false)
            setIsGameActive(false)
            void handleGameOver(false)
        }
    }, [guesses])

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
        const isPlayed = isPlayedToday(true)
        if (isPlayed !== null) {
            if (isPlayed === "true") { // is "true" (string as its local storage) if the user was correct.
                void handleGameOver(true,"/api/fetchCorrect")
            } else {
                void handleGameOver(false,"/api/fetchCorrect")
            }
        }
    }, [])

    function guesser(){
        handleGuess(currentGuess,"/api/guessHandler","/api/fetchCorrect","/api/dailyFacts",setFacts).then((isCorrect) => {
            if(isCorrect){
                setIsUserCorrect(true)
                setIsGameActive(false)
                memoryWriter(true,true)
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
