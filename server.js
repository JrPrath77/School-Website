// server.js is created because we can't directly integrate Gemini API key in the browser 
// because it would be exposed. So from backend we have to send this API key to frontend (chat.js)

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Load schoolInfo from School_Info.json
let schoolInfo = '';
try {
  const schoolDataPath = path.join(__dirname, 'School_Info.json');
  const rawData = fs.readFileSync(schoolDataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);
  // CORRECTED LINE: Access 'full_context' instead of 'schoolInfo'
  schoolInfo = jsonData.full_context;
  console.log('✅ schoolData loaded:', schoolInfo.split('\n')[0]); // Preview first line
} catch (err) {
  console.error('❌ Failed to load School_Info.json:', err);
  schoolInfo = 'School context could not be loaded.';
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST route
app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Handle "tell me about the school"
    const schoolKeywords = ["school", "about the school", "शाळेची माहिती", "शाळा"];
    const containsSchoolKeyword = schoolKeywords.some(keyword =>
      prompt.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsSchoolKeyword) {
      return res.json({ reply: schoolInfo });
    }

    // Use Gemini with contextual system prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const messages = [
      {
        role: "user",
        parts: [
          `You are an AI assistant for Dnyansiddhi Scholar Academy (DSA) and Dnyansiddhi Adarsh Gurukul Academy (DAGA).
Your purpose is to provide helpful, accurate, and concise information about the school based on the provided school context.
Always maintain a polite and slightly formal tone. Your replies should be short and to the point.
If a user asks a question not covered by the provided information, politely state that you can only answer questions based on the available school details.
If further assistance is needed, direct them to contact the school.

SCHOOL_CONTEXT:
${schoolInfo}`
        ]
      }
    ];

    const chat = model.startChat({ history: messages });
    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();

    res.json({ reply: responseText });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Something went wrong while processing your request.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
