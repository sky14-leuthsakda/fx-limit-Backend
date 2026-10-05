import type { ErrorHandler } from "hono";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorHandler = (err, c) => {
    console.error("🔥 Server Error:", err);

    if (err instanceof AppError) {
        return c.json({
            success: false,
            message: err.message
        }, err.statusCode as any)
    }

    return c.json({
        success: false,
        message: "ເກີດຂໍ້ຜິດພາດພາຍໃນລະບົບ" 
    }, 500)
}