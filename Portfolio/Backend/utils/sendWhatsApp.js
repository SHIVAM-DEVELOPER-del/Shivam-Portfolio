import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends a WhatsApp text message to your own number using CallMeBot.
 * Setup is required once — see .env.example for the 3-step activation.
 * @param {string} text - message body to send
 */
export const sendWhatsApp = async (text) => {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!phone || !apiKey) {
    console.warn("⚠️  WhatsApp not configured — skipping WhatsApp notification.");
    return { sent: false, reason: "missing_config" };
  }

  const url = "https://api.callmebot.com/whatsapp.php";

  try {
    await axios.get(url, {
      params: {
        phone,
        text,
        apikey: apiKey,
      },
    });
    return { sent: true };
  } catch (error) {
    console.error("WhatsApp send failed:", error.message);
    return { sent: false, reason: error.message };
  }
};
