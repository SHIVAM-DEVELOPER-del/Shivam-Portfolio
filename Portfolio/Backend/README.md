# Portfolio Backend — Contact Form (Gmail + WhatsApp)

This backend receives contact form submissions from your portfolio and sends you:
1. An **email** to your Gmail
2. A **WhatsApp message** to your phone

## Folder Structure

```
Backend/
├── config/
│   └── nodemailer.js       # Gmail transporter setup
├── controllers/
│   └── contactController.js # validates form + sends email & WhatsApp
├── routes/
│   └── contactRoutes.js     # POST /api/contact
├── middleware/
│   └── errorHandler.js      # 404 + error handling
├── utils/
│   └── sendWhatsApp.js      # CallMeBot WhatsApp sender
├── .env.example             # copy this to .env and fill in your values
├── .gitignore
├── package.json
├── server.js                 # app entry point
└── README.md
```

## 1. Install dependencies

```bash
cd Backend
npm install
```

## 2. Create your `.env` file

Copy the example file and fill in your real values:

```bash
cp .env.example .env
```

### Gmail setup (to receive emails)
1. Turn on 2-Step Verification on your Google account: https://myaccount.google.com/security
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password into `GMAIL_APP_PASSWORD` in `.env` (NOT your normal Gmail password)

### WhatsApp setup (to receive WhatsApp messages) — via CallMeBot, free & no business account needed
1. Save this contact on your phone: **+34 644 59 71 47**
2. Send it this exact WhatsApp message: `I allow callmebot to send me messages`
3. Wait for a reply containing your personal API key
4. Put your WhatsApp number (with country code, digits only) in `WHATSAPP_PHONE`, and the API key in `WHATSAPP_API_KEY`

## 3. Run the server

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start       # plain node
```

Server runs at `http://localhost:5000` by default.

## 4. API Endpoint

**POST** `/api/contact`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hi, I'd love to work with you!"
}
```

Success response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "whatsappSent": true
}
```

## 5. Connect it to your frontend

Your `contact.html` now has a working form that POSTs to this endpoint.
Update the `API_URL` constant at the top of the `<script>` in `contact.html`
to match wherever this backend is deployed (e.g. Render, Railway) once it's live.

## Notes
- Rate limiting is enabled: max 5 submissions per 15 minutes per IP, to prevent spam.
- If WhatsApp isn't configured yet, the form will still work and send email — WhatsApp sending is skipped gracefully.
- Never commit your real `.env` file — it's already in `.gitignore`.
