import { Hono } from "hono";
import { 
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema
} from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const authRoutes = new Hono<{ Variables: Variables }>();
const canManageUser = requirePermission("USER_MANAGE");

// Login User
authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return c.json(
      { success: false, message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", errors: validation.error.issues },
      400
    );
  }

  const result = await authService.loginUser(validation.data);

  return c.json({
    success: true,
    message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
    data: result,
  });
});

// LogOut User
authRoutes.post("/logout", authMiddleware, async (c) => {
  const { userId } = c.get("user");
  const result = await authService.logoutUser(userId);

  return c.json({
    success: true,
    message: result.message,
  });
});

authRoutes.post("/change-password", authMiddleware, async (c) => {
  const body = await c.req.json();
  const validation = changePasswordSchema.safeParse(body);

  if (!validation.success) {
    return c.json({
      success: false,
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
      errors: validation.error.issues
    }, 400);
  }

  const { userId } = c.get("user");
  const result = await authService.changePassword(userId, validation.data);

  return c.json({
    success: true,
    message: result.message,
  });
});

authRoutes.post("/reset-password/:userId", authMiddleware, canManageUser, async (c) => {
  const targetUserId = Number(c.req.param("userId"));

  if (!targetUserId) {
    return c.json({
      success: false,
      message: "ຕ້ອງລະບຸ User ID"
    }, 400);
  }

  const body = await c.req.json();
  const validation = resetPasswordSchema.safeParse(body);

  if (!validation.success) {
    return c.json({
      success: false,
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
      errors: validation.error.issues
    }, 400);
  }

  const result = await authService.resetPassword(targetUserId, validation.data);

  return c.json({
    success: true,
    message: result.message,
  });
});

export default authRoutes;