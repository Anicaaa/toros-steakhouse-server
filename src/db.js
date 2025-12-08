import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const useSSL =
  process.env.DATABASE_URL.includes("render.com") ||
  process.env.NODE_ENV === "production";

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
        guest_number INT NOT NULL,
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

if (require.main === module) {
  createTable().then(() => process.exit(0));
}
