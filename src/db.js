import pg from "pg";
export const pool = new pg.Pool({
  port: 5432,
  host: "localhost",
  user: "postgres",
  password: "xlgricky20131415",
  database: "tasksdb", // Nombre correcto de la propiedad
});
pool.on("connect", () => {
  console.log("Database connection established");
});
