import { Hono } from "hono";
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

app.get("/", (c) => c.json({ 
  success: true, 
  message: "FX Limit System API ພ້ອມໃຊ້ງານ" 
}));

app.route("/", apiRoutes);


const port = Number(process.env.PORT ?? 3000);

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 FX Limit System API running on http://localhost:${port}`);










