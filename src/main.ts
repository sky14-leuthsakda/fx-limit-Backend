import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors';
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import apiRoutes from './features/API/api.route.js'

const app = new Hono();

app.use(requestLogger);

app.use('*', cors({
  origin: ['http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.onError(errorHandler);

// Swagger Spec Endpoint (Basic Spec)
app.get('/doc', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'FX Limit System API',
      version: '1.0.0',
      description: 'API Documentation ສຳລັບທີມ Frontend',
    },
    paths: {
      '/': {
        get: {
          summary: 'Check API Status',
          responses: {
            '200': { description: 'Successful response' },
          },
        },
      },
    },
  });
});

// Swagger UI Route
app.get('/ui', swaggerUI({ url: '/doc' }));

app.get("/", (c) => c.json({ 
    success: true, 
    message: "FX Limit System API ພ້ອມໃຊ້ງານ" 
}));

app.route("/", apiRoutes);

const port = Number(process.env.PORT ?? 3002);

serve({ 
  fetch: app.fetch,
  port,
});

console.log(`🚀 FX Limit System API running on http://localhost:${port}`);
