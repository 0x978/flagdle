import {FC, useEffect, useState} from "react"
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'
import {guess} from "@/misc/types";
import Submit from "@/components/submit";


const Index: FC = () => {
    const [currentGuess, setCurrentGuess] = useState<string>()
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [guesses, setGuesses] = useState<guess[]>([])
    const [flag,setFlag] = useState<string>("")

    useEffect(() => {
        if (guesses.length >= 6) {
            alert("Game Over")
            setIsGameActive(false)
        }
    }, [guesses])

    useEffect(() => {
        async function fetchFlag(){
            const res = await fetch("/api/fetchDailyFlag")
            const data = await res.json()
            console.log(data)
            if(data.flag){
                setFlag(data.flag)
            }
            else{
                alert("Error fetching flag")
            }
        }
        void fetchFlag()
    },[])

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
        const correct:boolean = data.correct
        const newGuess = {
            country:guess,
            correct:correct,
        }

        setGuesses((prevState) => {
            return [...prevState, newGuess]
        })
        if(correct){
            setIsGameActive(false)
        }
    }

    return (
        <>
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

                    {isGameActive && <Submit currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} handleGuess={handleGuess} />}

                    {guesses.length > 0 && <GuessBoxes guesses={guesses}/>}

                </div>
            </main>
        </>
    );


}

export default Index
