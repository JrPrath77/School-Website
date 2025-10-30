# Dnyansiddhi School Website (DSA / DAGA)

Modern school website with a Node.js + Express backend and a primarily static frontend (HTML/CSS/JS). The backend exposes an AI-powered `/ask` endpoint (Google Gemini) and includes a scheduled email report sender that pulls data from a MySQL database.

A Vite + React + TypeScript scaffold is included under `src/` for future SPA pages, but the current site is served as static HTML from the project root.

---

## Quick Overview

- Backend: Node.js + Express with an AI endpoint that uses Google Gemini.
- Frontend: Static HTML/CSS/JS in the repository root. Tailwind config exists. Optional React app scaffolded in `src/`.
- Email reports: `mail.js` generates and emails reports from MySQL data (admissions + contact queries).
- Database: MySQL (via `mysql2`).

---

## Tech Stack

- Backend: Node.js, Express, @google/generative-ai, dotenv, cors, body-parser  
- Email / Scheduling: nodemailer, node-cron  
- Database: MySQL (mysql2)  
- Frontend: Static HTML/CSS/JS (root); optional React + TypeScript (Vite) in `src/`  
- Tooling: Vite, Tailwind, PostCSS

---

## Repository Structure

- `index.html` and other HTML files — main static pages
- `styles/` — page-specific CSS
- `js/` — page scripts (notable: `js/chat.js` integrates with `/ask`)
- `server.js` — Express server (serves static files, exposes `/ask`)
- `mail.js` — sends weekly/email reports using MySQL data
- `School_Info.json` — school context injected into the AI prompt
- `src/` — Vite + React + TypeScript scaffold (optional)
- `vite.config.ts`, `tailwind.config.js`, `postcss.config.js` — frontend tooling configs
- `.env` — environment variables (DO NOT commit secrets)

---

## Prerequisites

- Node.js 18+
- NPM (bundled with Node)
- MySQL server (required for `mail.js`) — database name used: `daga_education`

---

## Environment Variables

Create a `.env` file in the project root with:

GEMINI_API_KEY=your_google_gemini_api_key  
EMAIL_USER=your_gmail_address  
EMAIL_PASS=your_gmail_app_password

Notes:
- Never commit real secrets. Rotate any exposed keys immediately.
- If using Gmail with 2FA, use an App Password for `EMAIL_PASS`.

---

## Database Setup (for mail.js)

Run the SQL below to create the expected database and tables:

```sql
CREATE DATABASE IF NOT EXISTS daga_education;
USE daga_education;

CREATE TABLE IF NOT EXISTS student_admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(255),
  age INT,
  address TEXT,
  parent_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  previous_school VARCHAR(255),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

If your MySQL credentials differ, update the connection config in `mail.js` (defaults shown below):

host: 'localhost', user: 'root', password: '', database: 'daga_education'

---

## Install

Install dependencies:

npm install

---

## Run the Project

Option A — Start Express server (serves static site + AI endpoint)
- Command: npm run dev or node server.js
- Default URL: http://localhost:3001
- The server serves static files from the project root; open `/` to view `index.html`.

Option B — Use Vite (for the `src/` React app scaffold)
- Dev server: npm run vite
- Open: http://localhost:5173
- Production build: npm run build
- Preview build: npm run preview

Note: The production-ready pages at present are the static HTML files in the project root. The React scaffold exists for future development.

---

## API: AI Assistant

- Endpoint: POST /ask  
- Request body: { "prompt": "Your question" }  
- Response: { "reply": "Model response text" }  

Behavior:
- `server.js` loads `School_Info.json` and injects `full_context` into the model system prompt.
- If the incoming prompt contains school-related keywords (including Marathi equivalents), the endpoint can return the school context directly without calling the model (see `server.js` for the keyword check and system prompt).

Troubleshooting:
- If you receive a 404 for the Gemini model, verify the model name in `server.js`. As of Oct 2024, `gemini-2.5-flash` works; Google may update or deprecate model names. Check Google AI Studio or the official docs for the latest model names.

---

## Email Report Job

- Implemented in `mail.js`.
- Generates HTML tables summarizing `student_admissions` and `contact_messages` and sends them by email using Gmail SMTP (EMAIL_USER / EMAIL_PASS).
- Scheduling: currently configured to run once with a short delay on start. A weekly cron (Sunday 23:59) exists but is commented out.

Run manually:

node mail.js

Ensure MySQL is running and the tables contain data.

---

## Common Scripts

- npm run dev — Starts Express server (`server.js`)
- npm start — Same as above
- npm run vite — Vite dev server for React scaffold
- npm run build — Vite production build to `dist/`
- npm run preview — Preview Vite production build

---

## Development Tips

- Add `.env` to `.gitignore` and keep secrets out of the repo.
- AI behaviour and system prompt logic are in `server.js`.
- Frontend chat integration: see `js/chat.js` (calls `/ask`).
- If you change model behavior or context, test `/ask` locally before deploying.

---

## License

This is an internal / sponsored project. Add a formal license file (e.g., `LICENSE`) if needed.

---