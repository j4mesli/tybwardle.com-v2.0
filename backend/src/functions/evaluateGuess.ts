import { Character } from "../types/Character.model";
import { GuessParams } from "../types/GuessParams.model";
import { evaluateResultString } from "./evaluateResultString";

export const evaluateGuess = (ans: Character, guess: Character, resultString: string): [GuessParams, string] => {
    const newResultString = evaluateResultString(ans, guess, resultString);
    const proximity: GuessParams = [
        { name: { 
            evaluation: ans.name === guess.name ? 'correct' : 'incorrect', 
            value: guess.name 
        } },
        { race: { 
            evaluation: ans.race === guess.race ? 'correct' : 'incorrect', 
            value: guess.race 
        } },
        { affiliation: { 
            evaluation: ans.affiliation === guess.affiliation ? 'correct' : 'incorrect', 
            value: guess.affiliation 
        } },
        { status: { 
            evaluation: ans.status === guess.status ? 'correct' : 'incorrect', 
            value: guess.status 
        } },
        { height: { 
            evaluation: (ans.height === 0 || guess.height === 0) ? 'incorrect' : ans.height > guess.height ? 'more' : ans.height < guess.height ? 'less' : 'correct', 
            value: guess.height 
        } },
        { weight: {
            evaluation: (ans.weight === 0 || guess.weight === 0) ? 'incorrect' : ans.weight > guess.weight ? 'more' : ans.weight < guess.weight ? 'less' : 'correct',
            value: guess.weight,
        } },
    ];
    return [proximity, newResultString];
}