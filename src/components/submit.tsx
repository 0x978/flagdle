import {FC} from "react"
import Select from "react-select";
import {countryArray} from "@/misc/countries";
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
                onChange={(guess) => guess ? setCurrentGuess(guess.value as string) : alert("Please select a country")}
                options={countryArray.map((country) => ({value: country, label: country}))}
                styles={{  control: (styles) => ({ ...styles, backgroundColor: "#9e75f0",fontSize:"larger"}),
                    singleValue: (styles) => ({ ...styles, color: "white",}),
                    menuList: (styles) => ({...styles,backgroundColor: "#9e75f0",color:"white",fontSize:"larger"}),
                    placeholder: (styles) => ({...styles,color:"white"}),
                    option: (styles) => ({...styles,":hover":{"backgroundColor":"white",color:"black"}})
                }}
                placeholder="Select an option"
            />

            <div className="mt-4">
                <button className={"bg-superCoolEdgyPurple w-40 h-10 rounded-3xl text-white"} onClick={() => {
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