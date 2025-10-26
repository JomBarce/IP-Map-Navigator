import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import loginRouter from './routes/login.js';

const app: Application = express();

app.use(express.json({ limit: '20mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

// Mount routes
app.use('/api', loginRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(distPath));

  // Fallback for SPA routes
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export default app;
