import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors';
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import apiRoutes from './features/API/api.route.js'

const app = new OpenAPIHono();

app.use(requestLogger);

app.use('*', cors({
  origin: ['http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.onError(errorHandler);

// OpenAPI Specification Endpoint (/doc)
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'FX Limit System API',
    description: 'API Documentation ສຳລັບທີມ Frontend',
  },
});

// Swagger Ui Enpoint (/ui)
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
