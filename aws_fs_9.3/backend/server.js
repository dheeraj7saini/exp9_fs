import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*';

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: ALLOW_ORIGIN }));

// In-memory messages store (replace with MongoDB if desired)
const messages = [{ id: 1, text: 'Hello from API via ALB!' }];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  const item = { id: messages.length + 1, text };
  messages.push(item);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
