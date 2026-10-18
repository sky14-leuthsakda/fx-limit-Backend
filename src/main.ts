import { Hono } from "hono";
import { apiReference } from "@scalar/hono-api-reference";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors';
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { ratelimiter } from "./middlewares/rateLimit.middleware.js";
import apiRoutes from './features/API/api.route.js'
import { swaggerSpec } from "./docs/swagger.js";

const app = new Hono();

// Logger
app.use(requestLogger);

// Rate Limit
app.use("*", ratelimiter({ windowMs: 60 * 1000, max: 100 }));

// Open cors Frontend Port
app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],       
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Error Handler
app.onError(errorHandler);

// Swagger/OpenAPI Spec Endpoint
app.get('/docs', (c) => {
  return c.json(swaggerSpec);
});

// Swagger API Reference UI Route
app.get('/ui', apiReference({
  spec: {
    url: '/docs'
  }
}));

app.get("/", (c) => c.json({ 
    success: true, 
    message: "FX Limit System API ພ້ອມໃຊ້ງານ" 
}));

// API
app.route("/", apiRoutes);

const port = Number(process.env.PORT ?? 3002);

serve({ 
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
});

console.log(`🚀 FX Limit System API running on http://localhost:${port}`);
