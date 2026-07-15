import express from "express";
import rateLimit from "express-rate-limit";
import { handleContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Limit to 5 submissions per 15 minutes per IP to prevent spam/abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

router.post("/", contactLimiter, handleContactForm);

export default router;
