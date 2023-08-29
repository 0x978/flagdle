import logger from "@/components/api/logger";
import {countryFacts} from "@/misc/types";

export default function factLogger(factData:countryFacts) {
    type paramTypes = {
        state: Capitalize<string>;
        additionalArgs: [Capitalize<string>, string][];
    };
    const params: paramTypes = {
        state: "FETCHED NEW FACTS",
        additionalArgs: [["CAPITAL", factData.capital], ["CONTINENT", factData.continent], ["REGION", factData.region], ["LANDLOCKED", factData.isLandLocked.toString(),], ["LANGUAGE",
            factData.language], ["POPULATION", factData.population]]
    }
    void logger(params.state, params.additionalArgs)
}