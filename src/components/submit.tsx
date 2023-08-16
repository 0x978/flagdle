import {FC} from "react"
import Select from "react-select";
import countries from "@/misc/countries";
import {guess} from "@/misc/types";

interface SubmitProps {
    currentGuess ?: string
    setCurrentGuess : (guess:string) => void
    handleGuess : (guess:string) => void
}

const Submit: FC<SubmitProps> = ({currentGuess,setCurrentGuess,handleGuess}) => {
    return(
        <main>
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
        </main>
    )
}

export default Submit