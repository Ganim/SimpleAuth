// fastify-jwt.d.ts
import '@fastify/jwt';
import type { Role as PrismaRole } from '@prisma/client';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      role: PrismaRole;
      sessionId: string;
    };
  }
}
