import { Request, Response } from "express";
import { Pool } from "pg";
import { Character } from "../types/Character.model";
import { Characters } from "../types/Characters.model";
import { GuessParams } from "../types/GuessParams.model";
import { evaluateGuess } from "../functions/evaluateGuess";

export const handleGuess = async (req: Request, res: Response, pool: Pool, characters: Characters, today: Character, authKEY: string) => {
    const invalidGuess = { error: "Invalid guess: CHARACTER/GUESS COUNT/GUESS STRING/USERNAME NOT VALID!", message: "", code: 400 };
    const validGuess = { error: "", message: "", guessProximity: [] as GuessParams, guess: {} as Character, resultString: '', count: 0, code: 200 };

    // takes in a guess counter, a guess json object, a guess string of emojis, and a username
    if (req.query.guess && req.query.guessCount && req.query.username && req.query.resultString && req.headers['auth'] === authKEY && req.headers['user']) {
        // double json parse because we stored the object as a string in an object that's a string
        const userObj = JSON.parse(JSON.parse(req.header('user')!));
        // verify request cookie
        if (userObj._auth !== authKEY) {
            res.status(401).send({ error: "INVALID REQUEST PROVIDED: cookie", code: 401 });
        }
        const guess = req.query.guess as string;
        const resultString = req.query.resultString as string;
        const username = req.query.username as string;
        let count = +(req.query.guessCount as string);
        const charNames = characters.map(char => char.name);
        if (charNames.includes(guess) && count < 10) {
            count++;
            const guessObj = characters.filter(character => character.name === guess)[0];
            const [proximity, newResultString] = evaluateGuess(today, guessObj, resultString);
            const guessIsCorrect = today.name === guessObj.name ? true : false;
            // send today's results to database
            if (count === 10 || guessIsCorrect) {
                // form connection
                const client = await pool.connect();

                // conduct queries
                //// fetches the length of the guesses of a particular user, probably not necessary yet
                //// const guessesArrayLength = await pool.query(`SELECT COALESCE(ARRAY_LENGTH(guesses, 1), 0) AS length FROM user_information WHERE username='${ username }'`);
                const response = await pool.query(`
                    INSERT INTO games_played(username, date, result, resultstring, answer)
                    VALUES ('${ username }', '${ new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }', '${ "win" ? guessIsCorrect : "loss" }', '${ newResultString }', '${ today.name }')
                    RETURNING *
                `);

                // release connection
                client.release();
            }

            // send result object to frontend
            if (guessIsCorrect) {
                res.status(200).send({ 
                    ...validGuess, 
                    message: "Correct guess, good job!", 
                    guessProximity: proximity, 
                    guess: guessObj, 
                    count: count, 
                    resultString: newResultString 
                });
            }
            else {
                res.status(200).send({ 
                    ...validGuess, 
                    message: "Incorrect guess, better luck next time!", 
                    guessProximity: proximity, 
                    guess: guessObj, 
                    count: count, 
                    resultString: newResultString 
                });
            }
        }
        else {
            res.status(401).send({ ...invalidGuess, error: count > 10 ? "COUNT IS > 10!" : "Invalid guess: CHARACTER NOT FOUND IN CHARACTER.JSON!", code: 401 });
        }
    }
    else {
        res.status(req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401).send({ 
            ...invalidGuess, 
            code: req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401, 
            error: req.headers['auth'] === authKEY && req.headers['auth'] ? "Invalid guess: CHARACTER/GUESS COUNT/GUESS STRING/USERNAME NOT VALID!" : "INVALID REQUEST PROVIDED" 
        });
    }
}