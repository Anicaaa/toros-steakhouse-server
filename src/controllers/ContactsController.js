import { sendContactEmail } from "../utils/email.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body ?? {};

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email and message are required" });
    }

    await sendContactEmail({ name, email, phone: phone || "", message });

    return res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};
