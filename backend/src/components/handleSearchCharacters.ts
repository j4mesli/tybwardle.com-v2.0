import { Request, Response } from 'express';
import { Characters } from '../types/Characters.model';

export const handleSearchCharacters = (req: Request, res: Response, characters: Characters, authKEY: string) => {
    const invalidSearch = { error: "Invalid search parameters: SEARCH NOT DEFINED!", message: "", results: [] as Characters, code: 400 };
    const validSearch = { error: "", message: "", code: 200 };

    if (req.query.search && req.headers['auth'] === authKEY && req.headers['user']) {
        const userObj = JSON.parse(req.headers['user'] as string);
        // verify request cookie
        if (userObj.auth !== authKEY) {
            res.status(401).send({ error: "INVALID REQUEST PROVIDED: cookie", code: 401 });
        }

        const search = req.query.search as string;
        const results = characters.filter(character => {
            // uses RegEx to parse Characters array for matching results, and returns them
            const regex = new RegExp(`${ search }`, 'gi');
            return character.name.match(regex);
        });
        res.status(200).send({ ...validSearch, results: results, message: `Search processed! No. of results returned: ${ results.length }` });
    }
    else {
        res.status(req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401).send({ 
            ...invalidSearch, 
            code: req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401, 
            error: req.headers['auth'] === authKEY && req.headers['auth'] ? "Invalid search parameters: SEARCH NOT DEFINED!" : "INVALID REQUEST PROVIDED"
        });
    }
}