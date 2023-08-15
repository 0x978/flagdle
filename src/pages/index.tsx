import {FC, useEffect, useState} from "react"
import Image from "next/image";
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'
import Select from "react-select";
import countries from "@/misc/countries";

const Index: FC = () => {
    const [currentGuess, setCurrentGuess] = useState<string>()
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [guesses, setGuesses] = useState<string[]>([])

    useEffect(() => {
        if (guesses.length >= 6) {
            alert("Game Over")
            setIsGameActive(false)
        }
    }, [guesses])

    async function handleGuess(guess: string) {

        if (guesses.some((ans) => guess === ans)) {
            alert("Already guessed")
            return
        }

        setGuesses((prevState) => {
            return [...prevState, guess]
        })

        const res = await fetch('/api/guessHandler', {
            method: 'POST',
            body: JSON.stringify(guess)
        })
        const data = await res.json();
        if (data) {
            console.log(data)
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

            <main className="h-screen flex justify-center text-center my-3">
                <div className="flex flex-col items-center">
                    <h1 className="text-5xl">Flag Daily game thing</h1>
                    <img
                        className="w-96"
                        src="https://cdn.britannica.com/03/3303-004-C17F03F9/Flag-Tuvalu.jpg"
                        alt="The daily flag"
                    />
                    <Select
                        className={"w-96"}
                        id="country"
                        onChange={(guess) => guess ? setCurrentGuess(guess.value) : alert("Please select a country")}
                        options={countries.map((country) => ({value: country, label: country}))}
                        placeholder="Select an option"
                    />

                    <div className="mt-4">
                        <button onClick={() => {
                            if (currentGuess) {
                                void handleGuess(currentGuess)
                            } else {
                                alert("Please select a guess")
                            }
                        }}>Submit
                        </button>
                    </div>

                    {guesses.length > 0 && <GuessBoxes guesses={guesses}/>}

                </div>
            </main>
        </>
    );


}

export default Index
