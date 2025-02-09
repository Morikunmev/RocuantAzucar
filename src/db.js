import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "./config.js";
import pg from "pg";
export const pool = new pg.Pool({
  port: PG_PORT,
  host: PG_HOST,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE, // Nombre correcto de la propiedad
});
pool.on("connect", () => {
  console.log("Database connection established");
});
