import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Pool } from "pg";
import { handleAuth } from "./components/handleAuth";
import { readFileSync } from "fs";
import path from "path";
import { Character } from "./types/Character.model";
import { Characters } from "./types/Characters.model";
import { handleSearchCharacters } from "./components/handleSearchCharacters";
import { handleGuess } from "./components/handleGuess";
import { handleFetchAllCharacters } from "./components/handleFetchAllCharacters";
import { handleRegistration } from "./components/handleRegistration";
const characters: Characters = JSON.parse(readFileSync(path.join(__dirname, "../json/characters.json")).toString());
const today: Character = JSON.parse(readFileSync(path.join(__dirname, "../json/today.json")).toString());

// init server
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// middleware
app.use(morgan('dev'));
dotenv.config();
const pool = new Pool({
    host: process.env.PGHOST!,
    database: process.env.PGDATABASE!,
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    port: +process.env.PGPORT!,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.PGCONNECTION!,
    }
});

// routes
app.get("/", (req, res) => res.send("Hello World!"));

// registration
app.get("/registration", async (req: Request, res: Response) => await handleRegistration(req, res, pool, process.env.AUTHKEY!));

// login
app.get("/auth", async (req: Request, res: Response) => await handleAuth(req, res, pool, process.env.AUTHKEY!));

// fetch all characters
app.get("/fetchAllCharacters", (req: Request, res: Response) => handleFetchAllCharacters(req, res, characters, process.env.AUTHKEY!))

// fetch search results
app.get("/searchCharacters", async (req: Request, res: Response) => handleSearchCharacters(req, res, characters, process.env.AUTHKEY!));

// parse user guess
app.get("/processGuess", async (req: Request, res: Response) => await handleGuess(req, res, pool, characters, today, process.env.AUTHKEY!));