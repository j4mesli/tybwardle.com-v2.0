import { Request, Response } from 'express';
import { Pool } from 'pg';
import { CookieHeaders } from '../types/CookieHeaders.model';

export const handleRegistration = async (req: Request, res: Response, pool: Pool, authKEY: string) => {
    const invalidRegistration = { error: "Invalid username/password/email provided!", message: "", code: 400 };
    const validRegistration = { error: "", message: `User ${ req.query.username } at email ${ req.query.email } was successfully registered!`, auth: {} as CookieHeaders, code: 200 };

    if (req.query.username && req.query.password && req.query.email && req.headers['auth'] === authKEY) {
        const username = req.query.username as string;
        const email = req.query.email as string;
        const password = req.query.password as string;

        // establish pool connection
        const client = await pool.connect();

        // validate that the username is not already in user_information
        const users = (await pool.query(`SELECT username, email FROM user_information WHERE username='${ username }' OR email='${ email }'`)).rows;
        if (users.length === 0) {
            const response = await pool.query(`
                INSERT INTO user_information (username, email, password)
                VALUES ('${ username }', '${ email }', '${ password }')
                RETURNING *            
            `);
            res.send({ ...validRegistration, auth: { auth: authKEY, user: username } });
        }
        else {
            const usernames = users.map(user => user.username);
            const emails = users.map(user => user.email);
            res.status(400).send({ 
                ...invalidRegistration, 
                error: 
                    usernames.includes(username) && emails.includes(email)
                    ? "A USER WITH THAT USERNAME AND EMAIL IS ALREADY REGISTERED!"
                    : usernames.includes(username)
                    ? "A USER WITH THAT USERNAME IS ALREADY REGISTERED!"
                    : "A USER WITH THAT EMAIL IS ALREADY REGISTERED!",
            });
        }
        // select table_name from information_schema.tables WHERE table_schema='public'
        // SELECT (ARRAY(SELECT UNNEST(guesses) ORDER BY (UNNEST(guesses)).date DESC LIMIT 5)) AS recent_guesses FROM user_information WHERE username=${ username };

        // release connection
        client.release();

    }
    else {
        res.status(req.headers['auth'] === authKEY ? 400 : 401).send({ 
            ...invalidRegistration,
            code: req.headers['auth'] === authKEY ? 400 : 401,
            error: req.headers['auth'] === authKEY ? "Invalid username/password/email provided!" : "INVALID REQUEST PROVIDED" 
        });
    }
}