import {FC, useEffect, useState} from "react"
import Image from "next/image";
import GuessBoxes from "@/components/guessBoxes";
import Head from 'next/head'

interface IndexProps {

}

const Index: FC<IndexProps> = ({}) => {
    const [currentGuess,setCurrentGuess] = useState<string>("")
    const [guesses, setGuesses] = useState<string[]>([])
    const [isGameActive,setIsGameActive] = useState<boolean>(true)

    useEffect(() => {
        if(guesses.length >= 6){
            alert("Game Over")
            setIsGameActive(false)
        }
    },[guesses])

    function handleGuess(ans:string){
        setCurrentGuess("")

        if(guesses.some((guess) => guess === ans )){
            alert("Already guessed")
            return
        }

        setGuesses((prevState) => {
            return [...prevState,ans]
        })
    }

    return (
        <>
            <Head>
                <title>Flag Guesser</title>
                <meta name="0x978.com" content="cat"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="h-screen flex justify-center text-center ">
                <div className="flex flex-col items-center">
                    <h1 className="text-5xl">Flag Daily game thingy</h1>
                    <img
                        className="w-96"
                        src="https://cdn.britannica.com/03/3303-004-C17F03F9/Flag-Tuvalu.jpg"
                        alt="The daily flag"
                    />

                    <GuessBoxes guesses={guesses}/>

                    <input className="w-96 border-4 border-superCoolEdgyPurple my-3" onChange={(e) => setCurrentGuess(e.target.value)}
                          value={currentGuess} placeholder={"Enter answer"}/>
                    <div className="mt-4">
                        <button onClick={() => handleGuess(currentGuess)} >Submit</button>
                    </div>
                </div>
            </main>
        </>
    );


}

export default Index
