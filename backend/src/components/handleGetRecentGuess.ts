import { Request, Response } from 'express';
import { Pool } from 'pg';

export const handleGetRecentGuess = async (req: Request, res: Response, pool: Pool, authKEY: string) => {
    if (req.headers['auth'] === authKEY && req.headers['user']) {
        const userObj = JSON.parse(JSON.parse(req.headers['user'] as string));
        // verify request cookie
        if (userObj._auth !== authKEY) {
            res.status(401).send({ error: "INVALID REQUEST PROVIDED: cookie", code: 401 });
        }
        // form connection
        const client = await pool.connect();

        const response = await pool.query(`
            SELECT * FROM games_played WHERE username='${ userObj._username }' and DATE = '${ new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }'
        `);

        client.release();

        if (response.rows.length === 0)
            res.status(400).send({ error: "USER DIDN'T COMPLETE IT TODAY", code: 400 });
        else
            res.status(200).send({ error: "", code: 200, data: response.rows[0] });
    }
    else {
        res.status(req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401).send({ 
            error: "INVALID REQUEST PROVIDED", 
            code: req.headers['auth'] === authKEY && req.headers['auth'] ? 400 : 401 
        });
    }
}