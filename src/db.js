import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "anica",
  host: "localhost",
  database: "booking_system",
  password: "",
  port: 5432,
});
