import { Hono } from "hono";
import { 
  createRoleSchema,
  updateRoleSchema,
  assignPermissionSchema
} from "./role.schema.js";
import * as roleService from "./role.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { Variables } from "../../middlewares/types.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const roleRoutes = new Hono<{ Variables: Variables }>();
const canManageUsers = requirePermission("USER_MANAGE");

// Middleware & CanPermission
roleRoutes.use('*', authMiddleware, canManageUsers);

// Create Role
roleRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const validation = createRoleSchema.safeParse(body);

  if (!validation.success) {
    return c.json({ 
      success: false, 
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
      errors: validation.error.issues 
    }, 400);
  }

  const { userId } = c.get("user"); 
  const newRole = await roleService.createNewRole(validation.data, userId);

  return c.json({ 
    success: true, 
    message: "ສ້າງ Role ສຳເລັດ", 
    data: newRole 
  }, 201);
});

// Roles All
roleRoutes.get("/", async (c) => {
  const roles = await roleService.getAllRoles();
  
  return c.json({ 
    success: true, 
    message: "ດຶງລາຍຊື່ Roles ທັງຫມົດສຳເລັດ",
    data: roles 
  });
});

//Get Users Deleted
roleRoutes.get("/deleted", async (c) => {
  const deletedRoles = await roleService.getDeletedRoles();
  return c.json({ 
    success: true, 
    message: "ດຶງລາຍຊື່ Roles ທີ່ຖືກລົບສຳເລັດ",
    data: deletedRoles 
  });
});

// Role By Id
roleRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  const role = await roleService.getRoleById(Number(id));

  return c.json({ 
    success: true, 
    data: role 
  });
});

roleRoutes.get("/:id/permissions", async (c) => {
  const id = c.req.param("id");

  if (!id) return c.json({
    sucess: false,
    message: "ຕ້ອງລະບຸ ID"
  }, 400);

  const permissions = await roleService.getRolePermissions(Number(id));
  
  return c.json({
    success: true,
    message: "ດຶງຂໍ້ມູນ Permission ຂອງ Role ສຳເລັດ",
    data: permissions    
  });
});

// Update Role 
roleRoutes.put("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  const body = await c.req.json();
  const validation = updateRoleSchema.safeParse(body);

  if (!validation.success) {
    return c.json({ 
      success: false, 
      message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
      errors: validation.error.issues 
    }, 400);
  }

  const { userId } = c.get("user");
  const role = await roleService.updateExistingRole(Number(id), validation.data, userId);

  return c.json({ 
    success: true, 
    message: "ແກ້ໄຂ Role ສຳເລັດ", 
    data: role 
  });
});

// Soft Delete
roleRoutes.patch("/:id/disable", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  const { userId } = c.get("user");
  await roleService.softDeleteRole(Number(id), userId);

  return c.json({ 
    success: true, 
    message: "ປິດການໃຊ້ງານ Role ສຳເລັດ" 
  });
});

// Restore Role
roleRoutes.patch("/:id/enable", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  } 

  const { userId } = c.get("user")
  await roleService.restoreRole(Number(id), userId);

  return c.json({ 
    success: true, 
    message: "ເປີດໃຊ້ Role ສຳເລັດ" 
  });
});

// ==================== Role Permissions ====================

// Attach 1 Permission To Role
roleRoutes.post("/:id/permissions", async (c) => {
  const id = c.req.param("id");
  if (!id) return c.json({ success: false, message: "ຕ້ອງລະບຸ ID" }, 400);
 
  const body = await c.req.json();
  const validation = assignPermissionSchema.safeParse(body);
 
  if (!validation.success) {
    return c.json(
      {
        success: false,
        message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
        errors: validation.error.issues,
      },
      400
    );
  }
 
  const { userId } = c.get("user");
  const permissions = await roleService.assignPermission(
    Number(id),
    validation.data.permissionId,
    userId
  );
 
  return c.json({ 
    success: true, 
    message: "ເພີ່ມ Permission ສຳເລັດ", 
    data: permissions 
  }, 201);
});

// Revoke Permission From Role 
roleRoutes.delete("/:id/permissions/:permissionId",async (c) => {
  const id = c.req.param("id");
  const permissionId = c.req.param("permissionId");
 
  if (!id || !permissionId) {
    return c.json({ 
      success: false, 
      message: "ຕ້ອງລະບຸ ID" 
    }, 400);
  }

  await roleService.revokePermission(Number(id), Number(permissionId));
 
  return c.json({ 
    success: true, 
    message: "ຖອນ Permission ສຳເລັດ" 
  });
});

export default roleRoutes;