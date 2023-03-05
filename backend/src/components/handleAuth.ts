import { Request, Response } from 'express';
import { Pool } from 'pg';

export const handleAuth = async (req: Request, res: Response, pool: Pool, authKEY: string) => {
    const invalidLogin = { error: "Invalid Login: Invalid Username And/Or Password Provided!", message: "", code: 401 };
    const validLogin = { error: "", message: "User authenticated, welcome!", code: 200 };

    if (req.query.username && req.query.password && req.headers['auth'] === authKEY) {
        const username = req.query.username;
        const password = req.query.password;
        // form connection
        const client = await pool.connect();

        // conduct queries
        const response = await pool.query(`SELECT * FROM user_information where username='${ username }'`);
        if (response.rows.length > 0) {
            if (response.rows[0]['password'] === password) {
                res.status(200).send(validLogin);
            }
            else {
                res.status(401).send(invalidLogin);
            }
        }
        else {
            res.status(401).send(invalidLogin);
        }

        // release connection
        client.release();
    }
    else {
        res.status(req.headers['auth'] === authKEY ? 400 : 401).send({ 
            ...invalidLogin, 
            error: req.headers['auth'] !== authKEY ? "INVALID REQUEST PROVIDED" : 'Invalid Login: Invalid Username And/Or Password Provided!', 
            code: req.headers['auth'] === authKEY ? 400 : 401 
        });
    }
}