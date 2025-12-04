import express from "express";
import { sendContactMessage } from "../controllers/ContactsController.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;
