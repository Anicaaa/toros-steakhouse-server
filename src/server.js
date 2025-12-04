import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookingsRouter from "./routes/bookings.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://toros-steakhouse.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/bookings", bookingsRouter);
app.use("/api/contact", contactRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on port ${port}`)
);
