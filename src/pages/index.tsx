import {FC, useEffect, useState} from "react"
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'
import {guess} from "@/misc/types";
import Submit from "@/components/submit";
import Confetti from 'react-confetti';
import {useTimeout, useWindowSize} from 'react-use';
import Swal from "sweetalert2"



const Index: FC = () => {
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect,setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>()
    const [guesses, setGuesses] = useState<guess[]>([])
    const [flag, setFlag] = useState<string>("")
    const { width, height } = useWindowSize()
    const [isComplete] = useTimeout(2000);
    const CryptoJS = require('crypto-js');

    useEffect(() => {
        if (guesses.length >= 6) {
            memoryWriter(false)
            setIsGameActive(false)
            handleGameOver(false)
        }
    }, [guesses])

    useEffect(() => {
        async function fetchFlag() {
            const res = await fetch("/api/fetchDailyFlag")
            const data = await res.json()
            console.log(data)
            if (data.flag) {
                setFlag(data.flag)
            } else {
                alert("Error fetching flag")
            }
        }

        void fetchFlag()
        const isPlayed = isPlayedToday()
        if(isPlayed !== null){
            if(isPlayed === "true"){
                void handleGameOver(true)
            }
            else{
                void handleGameOver(false)
            }
        }
    }, [])

    async function handleGuess(guess: string) {

        if (guesses.some((ans) => guess === ans.country)) {
            alert("Already guessed")
            return
        }
        const res = await fetch('/api/guessHandler', {
            method: 'POST',
            body: guess
        })

        const data = await res.json();
        const correct: boolean = data.correct
        const newGuess = {
            country: guess,
            correct: correct,
        }

        setGuesses((prevState) => {
            return [...prevState, newGuess]
        })
        if (correct) {
            setIsUserCorrect(true)
            setIsGameActive(false)
            memoryWriter(true)
            void handleGameOver(true,[...guesses,{country:guess,correct:true}])
        }
    }

    async function handleGameOver(isCorrect: boolean,ans?:guess[]) {
        console.log(ans?.map((guess) => guess.country).toString())
        const res = await fetch('/api/fetchCorrect', {
            method: 'POST',
            body: ans?.map((guess) => guess.country).toString()
        })
        const data = await res.json();
        const correct = data.country

        if (isCorrect) {
            void Swal.fire({
                title: "Congratulations!",
                html: `<div style='display:flex; flex-direction: column; row-gap: 20px;'> 
            <h1 style='font-size: larger'>You got the correct answer in <span style='color: #77DD77'>${guesses.length +1}</span> guess!</h1>
            <h1 style='font-size: larger'>The correct answer was: <span style='color: #77DD77'>${correct}</span></h1>
            <h1 style='font-size: larger'>A new flag is available at <span style='color: #53caf5'>12:00 AM UTC</span></h1>
          </div>`,
                icon: "success",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                background: "#433151",
                color: "#9e75f0",
            });

        } else {
            void Swal.fire({
                title: "Unlucky!",
                icon: "error",
                html: `<div style='display:flex; flex-direction: column; row-gap: 20px;'> 
                    <h1 style='font-size: larger' >You did not get the flag this time!</h1>
                    <h1 style='font-size: larger'>The correct answer was: <span style='color: #77DD77'>${correct}</span></h1>
                    <h1 style='font-size: larger'>A new flag is available at <span style='color: #53caf5'>12:00 AM UTC</span></h1>
                    </div>`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                background: "#433151",
                color: "#9e75f0",
            })
        }
    }

    function memoryWriter(isCorrect:boolean){
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(today,String(isCorrect))
    }

    function isPlayedToday(){
        const today = new Date().toISOString().split('T')[0];
        return localStorage.getItem(today)
    }

    return (
        <>
            {isUserCorrect && <Confetti width={width} height={height} recycle={!isComplete()}/>}
            <Head>
                <title>Flag Guesser</title>
                <meta name="0x978.com" content="cat"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="h-screen flex justify-center text-center bg-deepPurple">
                <div className="flex flex-col items-center my-3 space-y-2">
                    <h1 className="text-5xl text-superCoolEdgyPurple">Flag Daily game thing</h1>
                    <img
                        className="w-96"
                        src={flag}
                        alt="The daily flag"
                    />

                    {isGameActive && <Submit currentGuess={currentGuess} setCurrentGuess={setCurrentGuess}
                                             handleGuess={handleGuess}/>}

                    {guesses.length > 0 && <GuessBoxes guesses={guesses}/>}

                </div>
            </main>
        </>
    );


}

export default Index
