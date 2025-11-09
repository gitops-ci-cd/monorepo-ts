import express from 'express';
import cors from 'cors';
import { formatDate } from '@monorepo/utils';
import type { User, HelloResponse, ApiError } from '@monorepo/types';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const users: Record<string, User> = {
  '1': { id: '1', name: 'Alice', language: 'en' },
  '2': { id: '2', name: 'José', language: 'es' },
  '3': { id: '3', name: 'Marie', language: 'fr' },
  'world': { id: 'world', name: 'World', language: 'en' }
};

// Greeting translations
const greetings: Record<string, string> = {
  'en': 'Hello',
  'es': 'Hola',
  'fr': 'Bonjour',
  'de': 'Hallo',
  'it': 'Ciao',
  'pt': 'Olá',
  'ru': 'Привет',
  'ja': 'こんにちは',
  'zh': '你好',
  'ko': '안녕하세요'
};

// Get greeting in browser's native language
function getGreeting(acceptLanguage: string = 'en'): string {
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].split('-')[0].trim())
    .filter(lang => lang in greetings);

  return greetings[languages[0]] || greetings['en'];
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: formatDate(new Date()) });
});

app.get('/hello/:id', (req, res) => {
  const { id } = req.params;
  const acceptLanguage = req.headers['accept-language'];

  const user = users[id];
  if (!user) {
    const error: ApiError = {
      error: 'Not Found',
      message: `User with id '${id}' not found`
    };
    return res.status(404).json(error);
  }

  const greeting = getGreeting(acceptLanguage);
  const response: HelloResponse = {
    greeting,
    user,
    timestamp: formatDate(new Date())
  };

  res.json(response);
});

app.get('/users', (req, res) => {
  res.json(Object.values(users));
});

// Error handling
app.use((req, res) => {
  const error: ApiError = {
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  };
  res.status(404).json(error);
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👋 Try: http://localhost:${PORT}/hello/world`);
});
