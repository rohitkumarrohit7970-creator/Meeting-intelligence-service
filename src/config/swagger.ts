import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';

const currentDir = dirname(fileURLToPath(import.meta.url));
const hasBuiltRoutes = existsSync(join(currentDir, '../routes/authRoutes.js'));
const routeGlob = hasBuiltRoutes ? join(currentDir, '../routes/*.js') : join(currentDir, '../routes/*.ts');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meeting Intelligence Service API',
      version: '1.0.0',
      description: 'API documentation for the Meeting Intelligence Service',
    },
    servers: [
      {
        url: '/',
        description: hasBuiltRoutes ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [routeGlob], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
