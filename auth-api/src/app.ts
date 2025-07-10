import fastify from 'fastify';
import { PrismaClient } from 'generated/prisma/client';

export const app = fastify();
export const prisma = new PrismaClient();
