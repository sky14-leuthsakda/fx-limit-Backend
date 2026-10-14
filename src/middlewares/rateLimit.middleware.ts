import type { Context, Next } from "hono";

interface RateLimitOptions {
    windowMs: number;
    max: number;
}

export const ratelimiter = (options: RateLimitOptions) => {
    const hits = new Map<string, { count: number; resetTime: number}>();

    setInterval(() => {
        const now = Date.now();
        for (const [ip, data] of hits.entries()) {
            if (now > data.resetTime) {
                hits.delete(ip);
            }
        }
    }, 60000);

    return async (c: Context, next: Next) => {
        const ip = c.req.header("x-forwarded-for") || "127.0.0.1";
        const now = Date.now()

        let record = hits.get(ip);

        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + options.windowMs };
            hits.set(ip, record);
        } else {
            record.count++;
        }

        if (record.count > options.max) {
            return c.json({
                success: false,
                message: "ສົ່ງ Request ຖີ່ເກີນໄປ, ກະລຸນາລອງໃຫມ່ພາຍຫລັງ",
            }, 429);
        }

        await next();
    };
};