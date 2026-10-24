import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { originGuard } from './middleware/originGuard.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors((req, callback) => {
  const sameOrigin = `${req.protocol}://${req.get('host')}`;
  callback(null, { origin: [env.CLIENT_ORIGIN, env.FRONTEND_URL, sameOrigin], credentials: true });
}));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(originGuard);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next());
});
app.use(notFoundHandler);
app.use(errorHandler);
export default app;


