import { Hono } from "hono";
import {
  createCustomerSchema,
  updateCustomerSchema,
  findCustomerByIdCodeSchema,
} from "./customers.schema.js";
import * as customerService from "./customers.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const customerRoutes = new Hono<{ Variables: Variables }>();
const canEnterFx = requirePermission("FX_ENTRY");
const canViewFx = requirePermission("FX_VIEW");
const canEditFx = requirePermission("FX_EDIT");

// Create Customer
customerRoutes.post("/", authMiddleware, canEnterFx, async (c) => {
    const body = await c.req.json();
    const validation = createCustomerSchema.safeParse(body);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const newCustomer = await customerService.createNewCustomer(validation.data, userId);

    return c.json({ 
        success: true, 
        message: "ສ້າງຂໍ້ມູນລູກຄ້າສຳເລັດ", 
        data: newCustomer 
    }, 201);
});

// Get All Customers
customerRoutes.get("/", authMiddleware, canViewFx, async (c) => {
    const customers = await customerService.getAllCustomers();
  
    return c.json({ 
        success: true, 
        data: customers 
    });
});

// Get Customers Paginated
customerRoutes.get("/paginated", authMiddleware, canViewFx, async (c) => {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 20);

    const result = await customerService.getCustomersPaginated(page, limit);

    return c.json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
    });
});

// Find Customer By (idTypeId, idCode)
customerRoutes.get("/find", authMiddleware, canEnterFx, async (c) => {
    const query = {
        idTypeId: c.req.query("idTypeId"),
        idCode: c.req.query("idCode"),
    };

    const validation = findCustomerByIdCodeSchema.safeParse(query);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues
        }, 400);
    }

    const customer = await customerService.findCustomerByIdCode(
        validation.data.idTypeId,
        validation.data.idCode
    );

    return c.json({ 
        success: true, 
        data: customer 
    });
});

// Get Customer By Id
customerRoutes.get("/:id", authMiddleware, canViewFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const customer = await customerService.getCustomerById(Number(id));
        return c.json({ 
            success: true, 
            data: customer 
    });
});

// Update Customer
customerRoutes.put("/:id", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateCustomerSchema.safeParse(body);

    if (!validation.success) {
        return c.json({ 
            success: false, 
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ", 
            errors: validation.error.issues 
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await customerService.updateExistingCustomer(
        Number(id),
        validation.data,
        userId
    );

    return c.json({
        success: true,
        message: "ແກ້ໄຂຂໍ້ມູນລູກຄ້າສຳເລັດ",
        data: updated,
    });
});

// Soft Delete Customer
customerRoutes.patch("/:id/disable", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await customerService.softDeleteCustomer(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" 
    });
});

// Restore Customer
customerRoutes.patch("/:id/enable", authMiddleware, canEditFx, async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ 
            success: false, 
            message: "ຕ້ອງລະບຸ ID" 
        }, 400);
    }

    const { userId } = c.get("user");
    await customerService.restoreCustomer(Number(id), userId);

    return c.json({ 
        success: true, 
        message: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ" 
    });
});

export default customerRoutes;