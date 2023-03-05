import { Character } from "../types/Character.model";

export const evaluateGuessString = (ans: Character, guess: Character, guessString: string) => {
    let newStr = guessString;
    
    // check name
    if (ans.name === guess.name) {
        newStr += "🟩".repeat(7);
        return newStr;
    }
    else 
        newStr += "🟥";
    
    // check race
    if (ans.race === guess.race)
        newStr += "🟩";
    else 
        newStr += "🟥";
    
    // check affiliation
    if (ans.affiliation === guess.affiliation)
        newStr += "🟩";
    else 
        newStr += "🟥";

    // check status
    if (ans.status === guess.status)
        newStr += "🟩";
    else 
        newStr += "🟥";
    
    // check height
    if (ans.height !== 0 && guess.height !== 0) {
        if (ans.height === guess.height)
            newStr += "🟩";
        else if (ans.height > guess.height)
            newStr += "🔺";
        else
            newStr += "🔻";
    }
    else  
        newStr += "🟥";

    // check weight
    if (ans.weight !== 0 && guess.weight !== 0) {
        if (ans.weight === guess.weight)
            newStr += "🟩";
        else if (ans.weight > guess.weight)
            newStr += "🔺";
        else
            newStr += "🔻";
    }
    else  
        newStr += "🟥";

    return newStr;
}