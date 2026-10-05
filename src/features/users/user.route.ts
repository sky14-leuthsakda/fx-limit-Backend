import { Hono } from "hono";
import { 
  createUserSchema, 
  updateUserSchema,
  assignRoleSchema 
} from "./user.schema.js";
import * as userService from "./user.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";
import { requirePermission } from "../../middlewares/permission.middleware.js"; 

const userRoutes = new Hono<{ Variables: Variables }>();
const canManageUsers = requirePermission("USER_MANAGE");

// Create User 
userRoutes.post("/", authMiddleware, canManageUsers, async (c) => {
  const body = await c.req.json();
  const validation = createUserSchema.safeParse(body);

  if(!validation.success) {
    return c.json({
      success: false,
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
      errors: validation.error.issues
    }, 400);
  }

  const { userId } = c.get("user")
  const newUser = await userService.createNewUser(validation.data, userId);
    
  return c.json({
    success: true,
    message: "ສ້າງຜູ້ໃຊ້ສຳເລັດ",
    data: newUser
  },201);
});

// Assign Role To User
userRoutes.post("/:id/roles", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({
      success: false,
      message: "ຕ້ອງລະບຸ ID"
    }, 400);
  }

  const body = await c.req.json();
  const validation = assignRoleSchema.safeParse(body);

  if (!validation.success) {
    return c.json({
      success: false,
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
      errors: validation.error.issues
    }, 400);
  }

  const { userId } = c.get("user")
  const roles = await userService.assignRole(
    Number(id), 
    validation.data.roleId, 
    userId
  );

  return c.json({
    success: true,
    message: "ເພີ່ມ Role ໃຫ້ຜູ້ໃຊ້ງານສຳເລັດ",
    data: roles
  }, 201)
})

// User All
userRoutes.get("/", authMiddleware, canManageUsers, async (c) => {
  const users = await userService.getAllUsers();

  return c.json({
    success: true,
    message: "ດຶງລາຍຊື່ຜູ້ໃຊ້ງານສຳເລັດ",
    data: users 
  }, 200);
});

// User Paginated
userRoutes.get("/paginated", authMiddleware, canManageUsers, async (c) => {
  const page = Number(c.req.query("page") ?? 1);
  const limit = Number(c.req.query("limit") ?? 10);

  const result = await userService.getUsersPaginated(page, limit);
  return c.json({
    success: true,
    message: "ດຶງລາຍການຜູ້ໃຊ້ສຳເລັດ",
    data: result.users,
    pagination: result.pagination,
  });
});

// User By Id 
userRoutes.get("/:id", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  } 
  
  const user = await userService.getUserById(Number(id));

  return c.json({ 
    success: true, 
    data: user 
  });
});

// User Role 
userRoutes.get("/:id/roles", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({
      success: false,
      message: "ຕ້ອງລະບຸ ID"
    }, 400);
  }
  
  const roles = await userService.getUserRoles(Number(id));

  return c.json({
    success: true,
    message: "ດຶງຂໍ້ມູນ Role ຂອງຜູ້ໃຊ້ສຳເລັດ",
    data: roles
  });
})

// Update User 
userRoutes.put("/:id", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  const body = await c.req.json();
  const validation = updateUserSchema.safeParse(body);
  
  if (!validation.success) {
    return c.json({ 
      success: false, 
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
      errors: validation.error.issues 
    }, 400);
  }

  const { userId } = c.get("user");
  const updatedUser = await userService.updateExistingUser(
    Number(id), 
    validation.data, 
    userId
  );

  return c.json({ 
    success: true, 
    message: "ແກ້ໄຂຜູ້ໃຊ້ສຳເລັດ", 
    data: updatedUser
  });
});


// Soft Delete User
userRoutes.patch("/:id/disable", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  } 
    
  const { userId } = c.get("user");
  await userService.softDeleteUser(Number(id), userId);

  return c.json({ 
    success: true, 
    message: "ປິດການໃຊ້ງານຜູ້ໃຊ້ສຳເລັດ" 
  });
});

// Restore User 
userRoutes.patch("/:id/enable", authMiddleware, canManageUsers, async (c) => {
  const id = c.req.param("id");
  
  if (!id) {
      return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  const { userId } = c.get("user");
  await userService.restoreUser(Number(id), userId);

  return c.json({ 
    success: true, 
    message: "ເປີດການໃຊ້ງານຜູ້ໃຊ້ສຳເລັດ" 
  });
});

// Remove Role User
userRoutes.delete("/:id/roles/:roleId", authMiddleware, canManageUsers, async (c) => {
  const Uid = c.req.param("id");
  const Rid = c.req.param("roleId");

  if (!Uid || !Rid) {
    return c.json({
      success: false,
      message: "ຕ້ອງລະບຸ User ID ແລະ Role ID"
    }, 400)
  }

  await userService.removeUserRole(
    Number(Uid),
    Number(Rid)
  );
  
  return c.json({
    success: true,
    message: "ລົບ Role ຂອງຜູ້ໃຊ້ສຳເລັດ"
  });
});

export default userRoutes;