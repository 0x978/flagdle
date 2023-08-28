import {FC, useEffect, useState} from "react"
import Confetti from "react-confetti";
import Head from "next/head";
import Submit from "@/components/submit";
import GuessBoxes from "@/components/guessBoxes";
import ClueBoxes from "@/components/clueBoxes";
import {factObject, guess} from "@/misc/types";
import {useTimeout, useWindowSize} from "react-use";
import {handleGameOver, handleGuess, isPlayedToday, memoryWriter} from "@/components/gameLogic";

interface CountryGuessrProps {

}

const CountryGuessr: FC<CountryGuessrProps> = ({}) => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>("")
    const [country, setCountry] = useState<string>("")
    const [facts, setFacts] = useState<factObject[]>([])
    const [displayClues, setDisplayClues] = useState<boolean>(false)
    const {width, height} = useWindowSize()
    const [guesses,setGuesses] = useState<guess[]>([])

    const [isComplete] = useTimeout(4000);

    useEffect(() => {
        async function fetchCountry() {
            const res = await fetch("/api/countryGuessr/fetchDailyCountry")
            const data = await res.json()
            if (data.country) {
                setCountry(data.country)
            } else {
                alert("Error fetching Country")
            }
        }

        void fetchCountry()
        const isPlayed = isPlayedToday(false)
        if (isPlayed !== null) {
            const stats:[boolean,number] = JSON.parse(isPlayed)
            if (stats[0]) {
                void handleGameOver(true, "/api/countryGuessr/fetchCorrect",stats[1])
            } else {
                void handleGameOver(false, "/api/countryGuessr/fetchCorrect",stats[1])
            }
        }
    }, [])

    function guesser() {
        handleGuess(currentGuess, "/api/countryGuessr/guessHandler/", "/api/countryGuessr/fetchCorrect/", "/api/countryGuessr/fetchFact", setFacts,guesses,setGuesses)
            .then((isCorrect) => {
                if (isCorrect) {
                    setIsUserCorrect(true)
                    setIsGameActive(false)
                    memoryWriter(true, false,guesses.length)
                }
                if (!isCorrect && guesses.length+1 === 6) {
                    setIsGameActive(false)
                    memoryWriter(false,false,guesses.length)
                    void handleGameOver(false,"/api/countryGuessr/fetchCorrect/",guesses.length)
                }
            })
    }

    return (
        <>
            {isUserCorrect && <Confetti width={width} height={height} recycle={!isComplete()}/>}
            <Head>
                <title>Country Guessr</title>
                <meta name="0x978.com" content="cat"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="min-h-screen flex flex-col items-center text-center ">
                <div className="flex flex-col items-center my-3 space-y-4">
                    <h1 className="text-5xl text-superCoolEdgyPurple">CountryGuessr</h1>
                    <img
                        className="w-96"
                        src={country}
                        alt="The daily Country"
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
    )
}

export default CountryGuessr