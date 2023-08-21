import {FC} from "react"

interface ClueProps {
    title:string
    fact:string
}

const Clue:FC<ClueProps> = ({ title, fact }) => {
    return (
        <div className="flex items-center justify-center h-24 rounded-3xl shadow-md mx-4 text-xl bg-pastelYellow">
            <div className="text-center w-full">
                <h1 className="font-semibold">{title}</h1>
                <hr className={"border-superCoolEdgyPurple border-4"}/>
                <h1 className="font-semibold">{fact}</h1>
            </div>
        </div>
    );
};

export default Clue