import {countryFacts, factObject} from "@/misc/types";

export default function decideFact(factData:countryFacts,guessNum:number){
    const rand = Math.round(Math.random())
    let fact:factObject = {factString: "", factType: ""}
    switch (guessNum){
        case 1:
            fact.factType = "Is the country landlocked?"
            fact.factString = factData.isLandLocked.toString()
            break;
        case 2:
            if(rand > 0.5){
                fact.factType = "On which continent is the country located?"
                fact.factString = factData.continent
            }
            else{
                fact.factType = "What is the capital of this country?"
                fact.factString = factData.capital
            }
            break
        case 3:
            fact.factType = "What is the most spoken language here?"
            fact.factString = factData.language
            break
        case 4:
            fact.factType = "What is the estimate population?"
            fact.factString = factData.population.toLocaleString();
            break
        case 5:
            fact.factType = "In which region is the country located"
            fact.factString  = factData.region
            break
        default:
            fact.factType = "Error"
            fact.factString = "Error"
    }
    return fact
}