import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import KnowledgeBase from '../models/KnowledgeBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load School_Info.json once at startup
let schoolInfo = null;
try {
  const raw = readFileSync(join(__dirname, '../../../School_Info.json'), 'utf-8');
  schoolInfo = JSON.parse(raw);
} catch {
  console.warn('[RAG] Could not load School_Info.json — fallback will be unavailable.');
}

/**
 * Simple keyword-based RAG search against the MongoDB knowledge base.
 * Returns top-N most relevant entries scored by keyword overlap.
 */
export async function findRelevantKnowledge(question, topN = 5) {
  const tokens = tokenize(question);
  if (tokens.length === 0) return [];

  const entries = await KnowledgeBase.find({});

  const scored = entries.map(entry => {
    let score = 0;
    for (const token of tokens) {
      for (const keyword of entry.keywords) {
        if (keyword.includes(token) || token.includes(keyword)) score += 1;
      }
      if (entry.topic.includes(token)) score += 2;
      if (entry.title.toLowerCase().includes(token)) score += 1;
    }
    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => s.entry);
}

/**
 * Build the context string from KB entries.
 */
export function buildContext(entries) {
  if (entries.length === 0) return '';
  return entries
    .map(e => `[${e.topic.toUpperCase()}] ${e.title}:\n${e.content}`)
    .join('\n\n---\n\n');
}

/**
 * Search School_Info.json for relevant information using keyword matching.
 * Returns a flat text summary of matching sections, or '' if no match found.
 */
export function searchSchoolInfo(question) {
  if (!schoolInfo) return '';

  const tokens = tokenize(question);
  if (tokens.length === 0) return '';

  // Keyword → section mappings
  const KEYWORD_SECTIONS = [
    {
      keywords: ['admission', 'प्रवेश', 'admissions', 'cet', 'entrance', 'apply', 'enroll', 'eligibility'],
      key: 'admission_info',
      label: 'Admission Information',
    },
    {
      keywords: ['fee', 'fees', 'शुल्क', 'cost', 'charge', 'payment', 'money'],
      key: 'admission_info',
      label: 'Fee Structure',
    },
    {
      keywords: ['contact', 'phone', 'number', 'email', 'address', 'location', 'संपर्क', 'फोन', 'पत्ता', 'where'],
      key: 'contact_details',
      label: 'Contact Details',
    },
    {
      keywords: ['schedule', 'time', 'routine', 'daily', 'timetable', 'वेळापत्रक', 'दिनचर्या'],
      key: 'daily_schedule',
      label: 'Daily Schedule',
    },
    {
      keywords: ['facility', 'facilities', 'hostel', 'residential', 'food', 'meal', 'जेवण', 'निवासी', 'sports', 'खेळ'],
      key: 'facilities',
      label: 'Facilities',
    },
    {
      keywords: ['meal', 'menu', 'food', 'lunch', 'dinner', 'breakfast', 'जेवण', 'आहार'],
      key: 'daily_meal_plan',
      label: 'Daily Meal Plan',
    },
    {
      keywords: ['exam', 'competitive', 'jnv', 'sainik', 'rms', 'rimc', 'spi', 'nmms', 'ntse', 'neet', 'jee', 'cet', 'foundation', 'परीक्षा'],
      key: 'competitive_exams_details',
      label: 'Competitive Exams',
    },
    {
      keywords: ['grade', 'class', 'preparation', 'std', 'standard', 'इयत्ता'],
      key: 'class_wise_preparation',
      label: 'Class-wise Preparation',
    },
    {
      keywords: ['teacher', 'staff', 'faculty', 'शिक्षक', 'qualification'],
      key: 'teacher_management',
      label: 'Teacher Management',
    },
  ];

  const matchedLabels = new Set();
  const matchedContent = [];

  for (const section of KEYWORD_SECTIONS) {
    const matches = section.keywords.some(kw =>
      tokens.some(t => t.includes(kw) || kw.includes(t))
    );
    if (matches && schoolInfo[section.key] && !matchedLabels.has(section.label)) {
      matchedLabels.add(section.label);
      matchedContent.push(formatSection(section.label, schoolInfo[section.key]));
    }
  }

  // If no specific section matched, try a broad search using full_context
  if (matchedContent.length === 0 && schoolInfo.full_context) {
    const fullText = schoolInfo.full_context.toLowerCase();
    const hasAnyToken = tokens.some(t => fullText.includes(t));
    if (hasAnyToken) {
      return '[SCHOOL INFO]\n' + schoolInfo.full_context;
    }
  }

  return matchedContent.join('\n\n---\n\n');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\sअ-ह़ा-ौॅॉंःँ]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function formatSection(label, data) {
  if (typeof data === 'string') return `[${label.toUpperCase()}]\n${data}`;
  if (Array.isArray(data)) {
    return `[${label.toUpperCase()}]\n` + data.map(item => {
      if (typeof item === 'string') return '• ' + item;
      return '• ' + Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ');
    }).join('\n');
  }
  if (typeof data === 'object') {
    return `[${label.toUpperCase()}]\n` + Object.entries(data).map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${v.join(', ')}`;
      if (typeof v === 'object' && v !== null) return `${k}: ${JSON.stringify(v)}`;
      return `${k}: ${v}`;
    }).join('\n');
  }
  return '';
}
