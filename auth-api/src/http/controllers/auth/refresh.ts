import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

type RefreshBody = { sessionId?: string };
type JwtPayload = { sub: string; role: string; sessionId?: string };

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true });

  // Atualiza a sessão vinculada ao usuário
  const sessionId =
    request.cookies.sessionId ||
    (request.body as RefreshBody)?.sessionId ||
    (request.user as JwtPayload)?.sessionId;
  const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';
  if (sessionId) {
    const sessionsRepository = new PrismaSessionsRepository();
    await sessionsRepository.updateSessionInfo(sessionId, ip);
  }

  const token = await reply.jwtSign(
    { role: request.user.role, sessionId },
    { sign: { sub: request.user.sub } },
  );

  const refreshToken = await reply.jwtSign(
    { role: request.user.role, sessionId },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
  );
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}
