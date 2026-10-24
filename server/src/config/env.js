import 'dotenv/config';
import { setServers } from 'node:dns';

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
if (dnsServers?.length) setServers(dnsServers);
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173')
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsed.data;


