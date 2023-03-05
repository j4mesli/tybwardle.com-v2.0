import { Pool } from "pg";

export const terminateConnection = async (pool: Pool) => {
    await pool.end();
}