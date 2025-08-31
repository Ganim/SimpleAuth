import { FastifyInstance } from 'fastify';
import { healthCheckController } from './health-check.controller';

export async function healthRoutes(app: FastifyInstance) {
  app.register(healthCheckController);
}
