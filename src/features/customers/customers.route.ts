import { Hono } from "hono";
import {
  createCustomerSchema,
  updateCustomerSchema,
  findCustomerByIdCodeSchema,
  searchCustomerByNameSchema,
} from "./customers.schema.js";
import * as customerService from "./customers.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import type { Variables } from "../../middlewares/types.js";

const customerRoutes = new Hono<{ Variables: Variables }>();
const canEnterFx = requirePermission("FX_ENTRY");
const canViewFx = requirePermission("FX_VIEW");
const canEditFx = requirePermission("FX_EDIT");

// Apply authMiddleware globally for all customer routes
customerRoutes.use("*", authMiddleware);

// Create Customer 
customerRoutes.post("/", canEnterFx, async (c) => {
    const body = await c.req.json();
    const validation = createCustomerSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const { userId } = c.get("user");
    const newCustomer = await customerService.createNewCustomer(
        validation.data,
        userId
    );

    return c.json({
        success: true,
        message: "ສ້າງຂໍ້ມູນລູກຄ້າສຳເລັດ",
        data: newCustomer,
    }, 201);
});

// Get All Customers
customerRoutes.get("/", canViewFx, async (c) => {
    const customers = await customerService.getAllCustomers();

    return c.json({
        success: true,
        data: customers,
    });
});

// Get Customers Paginated
customerRoutes.get("/paginated", canViewFx, async (c) => {
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
customerRoutes.get("/find", canEnterFx, async (c) => {
    const query = {
        idTypeId: c.req.query("idTypeId"),
        idCode: c.req.query("idCode"),
    };

    const validation = findCustomerByIdCodeSchema.safeParse(query);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const customer = await customerService.findCustomerByIdCode(
        validation.data.idTypeId,
        validation.data.idCode
    );

    return c.json({
        success: true,
        data: customer,
    });
});

// Search Customer By Name
customerRoutes.get("/search", canViewFx, async (c) => {
    const query = { name: c.req.query("name") };
    const validation = searchCustomerByNameSchema.safeParse(query);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const limitParam = c.req.query("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    const customers = await customerService.searchCustomers(
        validation.data.name,
        limit
    );

    return c.json({
        success: true,
        data: customers,
    });
});

// Get Customer By Id
customerRoutes.get("/:id", canViewFx, async (c) => {
    const customerId = Number(c.req.param("id"));

    if (isNaN(customerId)) {
        return c.json({
            success: false,
            message: "ID ຕ້ອງເປັນຕົວເລກທີ່ຖືກຕ້ອງ",
        }, 400);
    }

    const customer = await customerService.getCustomerById(customerId);
    return c.json({
        success: true,
        data: customer,
    });
});


// Update Customer
customerRoutes.put("/:id", canEditFx, async (c) => {
    const customerId = Number(c.req.param("id"));

    if (isNaN(customerId)) {
        return c.json({
            success: false,
            message: "ID ຕ້ອງເປັນຕົວເລກທີ່ຖືກຕ້ອງ",
        }, 400);
    }

    const body = await c.req.json();
    const validation = updateCustomerSchema.safeParse(body);

    if (!validation.success) {
        return c.json({
            success: false,
            message: "ຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
            errors: validation.error.issues,
        }, 400);
    }

    const { userId } = c.get("user");
    const updated = await customerService.updateExistingCustomer(
        customerId,
        validation.data,
        userId
    );

    return c.json({
        success: true,
        message: "ແກ້ໄຂຂໍ້ມູນລູກຄ້າສຳເລັດ",
        data: updated,
    });
});

// Soft Delete Customer (Disable)
customerRoutes.patch("/:id/disable", canEditFx, async (c) => {
    const customerId = Number(c.req.param("id"));

    if (isNaN(customerId)) {
        return c.json({
            success: false,
            message: "ID ຕ້ອງເປັນຕົວເລກທີ່ຖືກຕ້ອງ",
        }, 400);
    }

    const { userId } = c.get("user");
    await customerService.softDeleteCustomer(customerId, userId);

    return c.json({
        success: true,
        message: "ປິດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ",
    });
});

// Restore Customer (Enable)
customerRoutes.patch("/:id/enable", canEditFx, async (c) => {
    const customerId = Number(c.req.param("id"));

    if (isNaN(customerId)) {
        return c.json({
            success: false,
            message: "ID ຕ້ອງເປັນຕົວເລກທີ່ຖືກຕ້ອງ",
        }, 400);
    }

    const { userId } = c.get("user");
    await customerService.restoreCustomer(customerId, userId);

    return c.json({
        success: true,
        message: "ເປີດການໃຊ້ງານຂໍ້ມູນລູກຄ້າສຳເລັດ",
    });
});

export default customerRoutes;