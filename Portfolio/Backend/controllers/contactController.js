import validator from "validator";
import transporter from "../config/nodemailer.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";

export const handleContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ── Basic validation ──
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are all required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (name.length > 100 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Name or message is too long.",
      });
    }

    // Escape basic HTML to keep the email body safe
    const safe = (str) => validator.escape(str.trim());
    const cleanName = safe(name);
    const cleanEmail = validator.normalizeEmail(email.trim());
    const cleanMessage = safe(message);

    // ── 1. Send email via Gmail ──
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: cleanEmail,
      subject: `New portfolio message from ${cleanName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage}</p>
      `,
    });

    // ── 2. Send WhatsApp notification (non-blocking on failure) ──
    const waText = `📩 New portfolio message!\nName: ${cleanName}\nEmail: ${cleanEmail}\nMessage: ${cleanMessage}`;
    const waResult = await sendWhatsApp(waText);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
      whatsappSent: waResult.sent,
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message. Please try again later.",
    });
  }
};
