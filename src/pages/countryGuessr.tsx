import {FC, useEffect, useState} from "react"
import Confetti from "react-confetti";
import Head from "next/head";
import Submit from "@/components/submit";
import GuessBoxes from "@/components/guessBoxes";
import ClueBoxes from "@/components/clueBoxes";
import {factObject, guess} from "@/misc/types";
import {useTimeout, useWindowSize} from "react-use";
import Swal from "sweetalert2";

interface CountryGuessrProps {

}

const CountryGuessr: FC<CountryGuessrProps> = ({}) => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>()
    const [guesses, setGuesses] = useState<guess[]>([])
    const [country, setCountry] = useState<string>("")
    const [facts, setFacts] = useState<factObject[]>([])
    const [displayClues, setDisplayClues] = useState<boolean>(false)
    const {width, height} = useWindowSize()
    const [isComplete] = useTimeout(4000);

    useEffect(() => {
        if (guesses.length >= 6) {
            memoryWriter(false)
            setIsGameActive(false)
            void handleGameOver(false)
        }
    }, [guesses])

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
        const isPlayed = isPlayedToday()
        if (isPlayed !== null) {
            if (isPlayed === "true") {
                void handleGameOver(true)
            } else {
                void handleGameOver(false)
            }
        }
    }, [])

    async function handleGameOver(isCorrect: boolean, ans?: guess[]) {
        const res = await fetch('/api/countryGuessr/fetchCorrect', {
            method: 'POST',
            body: ans?.map((guess) => guess.country).toString()
        })
        const data = await res.json();
        const correct = data.country

        void Swal.fire({
            title: isCorrect ? "Congratulations!" : "Unlucky!",
            html: `<div style='display:flex; flex-direction: column; row-gap: 20px;'> 
            <h1 style='font-size: larger'>${isCorrect ? `You got the correct answer in <span style='color: #77DD77'>${guesses.length + 1}</span> guess!` : `You did not get the answer this time!`}</h1>
            <h1 style='font-size: larger'>The correct answer was: <span style='color: #77DD77'>${correct}</span></h1>
            <h1 style='font-size: larger'>A new game is available at <span style='color: #53caf5'>12:00 AM UTC</span></h1>
          </div>`,
            icon: isCorrect ? "success" : "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            background: "#433151",
            color: "#9e75f0",
        });
    }

    function memoryWriter(isCorrect: boolean) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`C-${today}`, String(isCorrect))
    }

    function isPlayedToday() {
        const today = new Date().toISOString().split('T')[0];
        return localStorage.getItem(`C-${today}`)
    }

    async function getFact(guessNumber: number) {
        const res = await fetch('/api/countryGuessr/fetchFact', {
            method: 'POST',
            body: guessNumber.toString()
        })
        const data = await res.json();
        return data.factData
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
                                             handleGuess={handleGuess}/>}

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