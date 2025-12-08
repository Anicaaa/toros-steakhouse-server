import pkg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const useSSL = process.env.DATABASE_URL?.includes("render.com") || isProduction;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        guest_number TEXT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        notes TEXT
      );
    `);
    console.log("Bookings table created successfully!");
  } catch (err) {
    console.error("Error creating bookings table:", err);
  }
};

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  createTable().then(() => process.exit(0));
}
