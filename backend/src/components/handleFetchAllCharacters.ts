import { Request, Response } from 'express';
import { Characters } from '../types/Characters.model';

export const handleFetchAllCharacters = (req: Request, res: Response, characters: Characters, authKEY: string) => {
    if (req.headers['auth'] === authKEY) {
        try {
            res.status(200).send({ error: "", message: "Character List Fetched!", characters: characters, code: 200 });
        }
        catch(err) {
            res.status(500).send({ error: "An unknown server error occured, sorry!", message: "", characters: [], code: 500 })
        }
    }
    else {
        res.status(req.headers['auth'] === authKEY ? 400 : 401).send({ 
            error: "INVALID REQUEST PROVIDED", 
            code: req.headers['auth'] === authKEY ? 400 : 401 
        });
    }
}