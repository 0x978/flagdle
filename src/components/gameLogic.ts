import Swal from "sweetalert2";
import {factObject, guess} from "@/misc/types";
import {useRouter} from "next/router";

export const guesses:guess[] = []

export async function handleGuess(guess: string,verifyAnswerAPI:string,correctAnswerAPI:string,factAPI:string,setFacts) {

    if (guesses.some((ans) => guess === ans.country)) {
        void Swal.fire({
            title: "Already Guessed",
            text: "You have already guessed this answer, try again!",
            icon: "warning",
            toast: true,
            position: "top",
            background: "#433151",
            color: "#9e75f0",
            showConfirmButton: false,
            timer: 2000,
        })
        return false
    }
    const res = await fetch(verifyAnswerAPI, {
        method: 'POST',
        body: guess
    })

    const data = await res.json();
    const correct: boolean = data.correct
    const newGuess = {
        country: guess,
        correct: correct,
    }

    guesses.push(newGuess)

    if (correct) {
        void handleGameOver(true, correctAnswerAPI,[...guesses, {country: guess, correct: true}])
    } else if (guesses.length + 1 < 6) {
        const fact = await getFact(guesses.length + 1,factAPI)
        setFacts(prevState => [...prevState, fact])
    }

    return correct
}

async function getFact(guessNumber: number,apiRoute:string) {
    const res = await fetch(apiRoute, {
        method: 'POST',
        body: guessNumber.toString()
    })
    const data = await res.json();
    return data.factData
}

export function isPlayedToday(isFlagGuessr:boolean) {
    const today = new Date().toISOString().split('T')[0];
    return isFlagGuessr ? localStorage.getItem(today) : localStorage.getItem(`C-${today}`)
}

export async function handleGameOver(isCorrect: boolean,apiRoute:string, ans?: guess[]) {

    const res = await fetch(apiRoute, {
        method: 'POST',
        body: ans?.map((guess) => guess.country).toString()
    })
    const data = await res.json();
    const correct = data.country

    Swal.fire({
        title: isCorrect ? "Congratulations!" : "Unlucky",
        icon: isCorrect ? "success" : "error",
        html: `<div style='display:flex; flex-direction: column; row-gap: 20px;'> 
                    <h1 style='font-size: larger' >${isCorrect ? `You got the correct answer in <span style='color: #77DD77'>${guesses.length}</span> guesses!`
            : "You did not get the flag this time!"}
                    </h1>
                    <h1 style='font-size: larger'>The correct answer was: <span style='color: #77DD77'>${correct}</span></h1>
                    <h1 style='font-size: larger'>A new flag is available at <span style='color: #53caf5'>12:00 AM UTC</span></h1>
                    <h1 style='font-size: larger'>Try to beat today's CountryGuessr?</h1>
                    </div>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: "#433151",
        color: "#9e75f0",
        showConfirmButton: true,
        confirmButtonText: "Try CountryGuessr"
    }).then((_) => {
        window.location.href = "/countryGuessr";
    })
}

export function memoryWriter(isCorrect: boolean,isFlagGuessr) {
    const today = new Date().toISOString().split('T')[0];
    isFlagGuessr ? localStorage.setItem(today, String(isCorrect)) : localStorage.setItem(`C-${today}`, String(isCorrect))
}