import type { Context, Next } from "hono";
import type { Variables } from "./types.js";
import { AppError } from "../utils/AppError.js";

export const requirePermission = (requirePermission: string) => {
    return async (c: Context<{ Variables: Variables }>, next: Next) => {
        const user = c.get("user");

        if (!user.permissions?.includes(requirePermission)) {
            throw new AppError(`ທ່ານບໍ່ມີສິດ ${requirePermission} ໃນການດຳເນີນລາຍການນີ້`, 403);
        }

        await next();
    }
}