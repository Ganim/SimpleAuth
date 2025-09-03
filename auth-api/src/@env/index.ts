import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3333),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default('user'),
  SMTP_PASS: z.string().default('pass'),
  FRONTEND_URL: z.url().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error(
    '⚠️ Invalid environment variables:',
    z.treeifyError(_env.error),
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
