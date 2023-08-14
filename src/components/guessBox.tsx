import {FC} from "react"

interface GuessBoxProps {
    country?:string
}

const GuessBox: FC<GuessBoxProps> = ({country}) => {

    console.log(country)

    return(
        <main className={"w border-black border-4"}>
            <h1>{country || "​"}</h1>
        </main>
    )
}

export default GuessBox