import { env } from './@env';
import { app } from './app';

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`🌐  HTTP server is running: http://localhost:${env.PORT}`);
    console.log(
      `📑  Swagger docs is running: http://localhost:${env.PORT}/docs`,
    );
  });
