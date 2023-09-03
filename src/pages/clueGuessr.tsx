import {FC, useEffect, useState} from "react"
import {guess} from "@/misc/types";
import {useTimeout, useWindowSize} from "react-use";
import {handleGameOver, handleGuess, isPlayedToday, memoryWriter} from "@/components/gameLogic";
import Confetti from "react-confetti";
import Head from "next/head";
import Submit from "@/components/submit";
import GuessBoxes from "@/components/guessBoxes";
import Swal from "sweetalert2";

interface ClueGuessrProps {

}

const ClueGuessr: FC<ClueGuessrProps> = ({}) => {
    const [guesses, setGuesses] = useState<guess[]>([])
    const [isGameActive, setIsGameActive] = useState<boolean>(true)
    const [isUserCorrect, setIsUserCorrect] = useState<boolean>(false)
    const [currentGuess, setCurrentGuess] = useState<string>("")
    const [clues, setClues] = useState<string[]>([])
    const [index, setIndex] = useState<number>(0)
    const {width, height} = useWindowSize()
    const [confettiIsComplete] = useTimeout(4000);

    useEffect(() => {
        async function fetchClues() {
            const data = await fetch("/api/clueGuessr/getDailyClues")
            const fetchedClues = await data.json();
            setClues(fetchedClues.clues)
        }

        void fetchClues()
        const isPlayed = isPlayedToday("clue")
        if (isPlayed) {
            const stats: [string, number] = JSON.parse(isPlayed)
            if (stats[0] === "true") {
                void handleGameOver(true, "/api/clueGuessr/fetchCorrect", stats[1])
            } else {
                void handleGameOver(false, "/api/clueGuessr/fetchCorrect", stats[1])
            }
        }
    }, [])

    function indexHandler(isForward: boolean) {
        if (isForward) {
            if (index + 1 > guesses.length) {
                void Swal.fire({
                    title: "You haven't unlocked this clue yet!",
                    text: "You must submit another guess before trying to go to this clue",
                    icon: "warning",
                    toast: true,
                    position: "top",
                    background: "#433151",
                    color: "#9e75f0",
                    showConfirmButton: false,
                    timer: 3000,
                })
            } else {
                setIndex(prevState => prevState + 1)
            }
        }
        if (!isForward) {
            if (index === 0) {
                return
            } else {
                setIndex(prevState => prevState - 1)
            }
        }
    }


    function guesser() {
        handleGuess(currentGuess, "/api/clueGuessr/guessHandler", "/api/clueGuessr/fetchCorrect", guesses, setGuesses)
            .then((isCorrect) => {
                if (isCorrect) {
                    setIsUserCorrect(true)
                    setIsGameActive(false)
                    memoryWriter(true, "clue", guesses.length)
                    return
                }
                if (!isCorrect && guesses.length + 1 === 11) {
                    setIsGameActive(false)
                    memoryWriter(false, "clue", guesses.length)
                    void handleGameOver(false, "/api/fetchCorrect", guesses.length + 1)
                } else if (!(guesses.some((ans: guess) => currentGuess === ans.country))) {
                    setIndex(prevState => prevState + 1)
                }
            })
    }

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
                    <h1 className="text-3xl text-superCoolEdgyPurple">Hint Number: {index + 1}</h1>

                    {clues[index]?.substring(0, 5) === "https" ?
                        <div className={"flex flex-col items-center"}>
                            <h1 className={"text-3xl text-pastelGreen"}>{`${clues[index].substring(5, 12) === "://flag" ? "This country's flag is the following:"
                                : 'The country\'s coat of arms is the following:'}`}</h1>
                            <img
                                className="w-96"
                                src={clues[index]}
                                alt="The coat of arms"
                            />
                        </div> :
                        <h1 className={"text-3xl text-pastelGreen"}>{clues[index]}</h1>}

                    {isGameActive && <Submit currentGuess={currentGuess} setCurrentGuess={setCurrentGuess}
                                             handleGuess={guesser}/>}

                    <div>
                        <button onClick={() => indexHandler(false)} className={"bg-red-300 w-44"}>{"<--"}</button>
                        <button onClick={() => indexHandler(true)} className={"bg-green-300 w-44"}>{"-->"}</button>
                    </div>

                    {guesses.length > 0 && <GuessBoxes guesses={guesses}/>}

                </div>
            </main>
        </>
    );

}

export default ClueGuessr