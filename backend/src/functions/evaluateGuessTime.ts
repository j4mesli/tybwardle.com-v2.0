import { Pool } from "pg";
import { Request, Response } from "express";

export const evaluateGuessTime = async (req: Request, res: Response, authKEY: string, pool: Pool) => {
    if (req.headers['auth'] === authKEY && req.headers['auth']) {
        const client = await pool.connect();
        const response = await pool.query(`
            SELECT * FROM games_played WHERE date='${ new Date().toLocaleDateString("EN",{ timeZone: "EST" }) }'
        `);
        client.release();
        if (response.rows.length > 0)
            res.status(401).send({ date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }), error: "ALREADY SOLVED TODAY", proceed: false, code: 401 });
        else {
            res.status(200).send({ date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }), proceed: true, code: 200 });
        }
    }
    else {
        res.status(400).send({ date: new Date().toLocaleDateString("EN",{ timeZone: "EST" }), error: "INVALID REQUEST PROVIDED", proceed: false, code: 400 });
    }
}