import {countryFacts} from "@/misc/types";

export default async function newFactHandler(country:string):Promise<countryFacts>{
    const facts:countryFacts = {capital: "", continent: "", isLandLocked: "", language: "", population: "", region: ""}
    console.log(country)
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${country}`)
    let data = await res.json()
    data = data[0]
    facts.capital = data.capital[0]
    facts.continent = data.continents[0]
    facts.region = data.subregion
    facts.isLandLocked = data.landlocked
    facts.language = Object.values(data.languages)[0] as string
    facts.population = data.population
    
    return facts
}