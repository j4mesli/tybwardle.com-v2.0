import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { Pool } from "pg";
import { handleAuth } from "./components/handleAuth";
import cron from 'node-cron';
import * as fs from "fs";
import path from "path";
import { Character } from "./types/Character.model";
import { Characters } from "./types/Characters.model";
import { handleSearchCharacters } from "./components/handleSearchCharacters";
import { handleGuess } from "./components/handleGuess";
import { handleFetchAllCharacters } from "./components/handleFetchAllCharacters";
import { handleRegistration } from "./components/handleRegistration";
import { evaluateGuessTime } from "./functions/evaluateGuessTime";
import { handleGetRecentGuess } from "./components/handleGetRecentGuess";
const characters: Characters = JSON.parse(fs.readFileSync(path.join(__dirname, "../json/characters.json")).toString());
const today: Character = JSON.parse(fs.readFileSync(path.join(__dirname, "../json/today.json")).toString());

// init server
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// cron job random choice
const charactersFilePath = path.join(__dirname, 'characters.json');
const todayFilePath = path.join(__dirname, 'today.json');
const chooseRandomCharacter = cron.schedule('0 0 * * *', () => {
    console.log('Running job to update today.json...');

    // Read the characters.json file and parse it into an array
    const characters = JSON.parse(fs.readFileSync(charactersFilePath, 'utf-8'));

    // Select a random character from the array
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    // Write the random character to the today.json file
    fs.writeFileSync(todayFilePath, JSON.stringify(randomCharacter));

    console.log(`Updated today.json with character: ${randomCharacter.name}`);
});
chooseRandomCharacter.start();

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
app.get("/register", async (req: Request, res: Response) => await handleRegistration(req, res, pool, process.env.AUTHKEY!));

// login
app.get("/auth", async (req: Request, res: Response) => await handleAuth(req, res, pool, process.env.AUTHKEY!));

// fetch all characters
app.get("/fetchAllCharacters", (req: Request, res: Response) => handleFetchAllCharacters(req, res, characters, process.env.AUTHKEY!))

// fetch search results
app.get("/searchCharacters", async (req: Request, res: Response) => handleSearchCharacters(req, res, characters, process.env.AUTHKEY!));

// validate did not solve today
app.get("/validateToday", async (req: Request, res: Response) => await evaluateGuessTime(req, res, process.env.AUTHKEY!, pool));

// parse user guess
app.get("/processGuess", async (req: Request, res: Response) => await handleGuess(req, res, pool, characters, today, process.env.AUTHKEY!));

// get user guess from database
app.get("/getTodayGuess", async (req: Request, res: Response) => await handleGetRecentGuess(req, res, pool, process.env.AUTHKEY!));