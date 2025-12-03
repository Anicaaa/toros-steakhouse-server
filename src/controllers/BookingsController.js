import { pool } from "../db.js";
import Joi from "joi";

// Validation schema
const bookingSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().allow(null, ""),
  phone: Joi.string().allow(null, ""),
  guestNumber: Joi.number().integer().min(1).required(),
  date: Joi.string().required(), // YYYY-MM-DD
  startTime: Joi.string().required(), // HH:mm
  endTime: Joi.string().required(),
  notes: Joi.string().allow(null, ""),
});

// Check overlapping bookings
async function isAvailable(date, startTime, endTime, excludeId = null) {
  let query = `
    SELECT * FROM bookings
    WHERE date = $1
      AND NOT (end_time <= $2 OR start_time >= $3)
  `;

  const params = [date, startTime, endTime];

  if (excludeId) {
    query += ` AND id != $4`;
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return result.rows.length === 0;
}

export const createBooking = async (req, res) => {
  const { error, value } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { name, email, phone, guestNumber, date, startTime, endTime, notes } =
    value;

  const available = await isAvailable(date, startTime, endTime);
  if (!available) {
    return res.status(409).json({ error: "This time slot is already booked." });
  }

  const query = `
    INSERT INTO bookings (name, email, phone, guest_number, date, start_time, end_time, notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const params = [
    name,
    email,
    phone,
    guestNumber,
    date,
    startTime,
    endTime,
    notes,
  ];
  const result = await pool.query(query, params);

  res.status(201).json({ booking: result.rows[0] });
};

export const getBookings = async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM bookings ORDER BY date, start_time`
  );
  res.json({ bookings: result.rows });
};

export const getBookingById = async (req, res) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    req.params.id,
  ]);
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Not found" });
  res.json({ booking: result.rows[0] });
};

export const updateBooking = async (req, res) => {
  const { error, value } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const id = req.params.id;

  const { name, email, phone, guestNumber, date, startTime, endTime, notes } =
    value;

  const available = await isAvailable(date, startTime, endTime, id);
  if (!available) {
    return res.status(409).json({ error: "This time slot is already booked." });
  }

  const query = `
    UPDATE bookings 
    SET name=$1, email=$2, phone=$3, guest_number=$4, date=$5, start_time=$6, end_time=$7, notes=$8
    WHERE id=$9
    RETURNING *
  `;

  const params = [
    name,
    email,
    phone,
    guestNumber,
    date,
    startTime,
    endTime,
    notes,
    id,
  ];
  const result = await pool.query(query, params);

  res.json({ booking: result.rows[0] });
};

export const deleteBooking = async (req, res) => {
  await pool.query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);
  res.json({ success: true });
};
